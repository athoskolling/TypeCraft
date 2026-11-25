import { describe, expect, it } from 'vitest';
import { evaluateSubmission, evaluatePlayground } from '../evaluator';

describe('TypeCraft 3-Layer Diagnostic Engine', () => {
  it('passes any valid solution regardless of implementation style (never fixed-string comparison)', async () => {
    const testCases = [
      { id: 't1', name: 'sums positives', fnName: 'sumEven', args: [[1, 2, 3, 4, 6]], expected: 12 },
      { id: 't2', name: 'empty array', fnName: 'sumEven', args: [[]], expected: 0 },
    ];

    const imperative = await evaluateSubmission({
      requestId: 'r1',
      entryFile: 'solution.ts',
      entryFunction: 'sumEven',
      files: {
        'solution.ts': `export function sumEven(nums: readonly number[]): number {
          let total = 0;
          for (const n of nums) {
            if (n % 2 === 0) total += n;
          }
          return total;
        }`,
      },
      testCases,
    });

    const functional = await evaluateSubmission({
      requestId: 'r2',
      entryFile: 'solution.ts',
      entryFunction: 'sumEven',
      files: {
        'solution.ts': `export const sumEven = (nums: number[]): number =>
          nums.filter((x) => (x & 1) === 0).reduce((acc, v) => acc + v, 0);`,
      },
      testCases,
    });

    expect(imperative.passed).toBe(true);
    expect(functional.passed).toBe(true);
  });

  it('Layer 1 catches strict TS errors with friendly explanations and blocks AST any/@ts-ignore', async () => {
    const resCompiler = await evaluateSubmission({
      requestId: 'r3',
      entryFile: 'solution.ts',
      files: {
        'solution.ts': `export function greet(name) { return name.toUpperCase(); }`,
      },
      testCases: [],
    });

    expect(resCompiler.passed).toBe(false);
    expect(resCompiler.layer1.compilerDiagnostics.some((d) => d.code === 7006)).toBe(true);
    expect(
      resCompiler.layer1.compilerDiagnostics.find((d) => d.code === 7006)?.friendlyExplanation
    ).toContain('TS7006');

    const resAst = await evaluateSubmission({
      requestId: 'r4',
      entryFile: 'solution.ts',
      files: {
        'solution.ts': `// @ts-ignore\nexport function parse(v: any): string { return String(v); }`,
      },
      astRules: { forbidExplicitAny: true, forbidTsIgnore: true, requireGenerics: true },
      testCases: [],
    });

    expect(resAst.passed).toBe(false);
    const rulesTriggered = resAst.layer1.astViolations.map((v) => v.rule);
    expect(rulesTriggered).toContain('forbidExplicitAny');
    expect(rulesTriggered).toContain('forbidTsIgnore');
    expect(rulesTriggered).toContain('requireGenerics');
  });

  it('Layer 1 evaluates Expect<Equal<...>> type-challenge assertions individually', async () => {
    const passType = await evaluateSubmission({
      requestId: 'r5',
      entryFile: 'solution.ts',
      files: {
        'solution.ts': `export type MyPick<T, K extends keyof T> = { [P in K]: T[P] };`,
      },
      typeAssertionPrelude: `import type { MyPick } from './solution';\ninterface Todo { id: number; title: string; done: boolean; }`,
      typeAssertions: [
        { id: 'ta1', name: 'single key', assertion: `Expect<Equal<MyPick<Todo, 'title'>, { title: string }>>` },
        { id: 'ta2', name: 'union keys', assertion: `Expect<Equal<MyPick<Todo, 'id' | 'done'>, { id: number; done: boolean }>>` },
      ],
      testCases: [],
    });

    expect(passType.passed).toBe(true);
    expect(passType.layer1.typeAssertionResults).toHaveLength(2);
    expect(passType.layer1.typeAssertionResults.every((r) => r.passed)).toBe(true);

    const failType = await evaluateSubmission({
      requestId: 'r6',
      entryFile: 'solution.ts',
      files: {
        'solution.ts': `export type MyPick<T, _K extends keyof T> = T;`,
      },
      typeAssertionPrelude: `import type { MyPick } from './solution';\ninterface Todo { id: number; title: string; }`,
      typeAssertions: [
        { id: 'ta1', name: 'single key', assertion: `Expect<Equal<MyPick<Todo, 'title'>, { title: string }>>` },
      ],
      testCases: [],
    });

    expect(failType.passed).toBe(false);
    expect(failType.layer1.typeAssertionResults[0].passed).toBe(false);
  });

  it('Layer 2 bundles multi-file CommonJS projects and captures console.log', async () => {
    const res = await evaluateSubmission({
      requestId: 'r7',
      entryFile: 'engine.ts',
      entryFunction: 'computeTotal',
      files: {
        'types.ts': `export interface LineItem { price: number; qty: number; }`,
        'math.ts': `import type { LineItem } from './types';\nexport const subtotal = (items: LineItem[]): number => items.reduce((s, i) => s + i.price * i.qty, 0);`,
        'engine.ts': `import type { LineItem } from './types';\nimport { subtotal } from './math';\nexport function computeTotal(items: LineItem[]): string {\n  const sub = subtotal(items);\n  console.log('Subtotal computed:', sub);\n  return sub.toFixed(2);\n}`,
      },
      testCases: [
        {
          id: 'mp1',
          name: 'computes multi-file receipt subtotal',
          args: [[{ price: 12.5, qty: 2 }, { price: 5, qty: 1 }]],
          expected: '30.00',
        },
      ],
    });

    expect(res.passed).toBe(true);
    expect(res.layer2.consoleEntries[0]?.text).toBe('Subtotal computed: 30');
  });

  it('Layer 3 diagnoses off-by-one, .toFixed precision, Beecrowd whitespace, forgotten return, mutation, and wrong order', async () => {
    // 1. Forgotten return
    const noReturn = await evaluateSubmission({
      requestId: 'd1',
      entryFile: 'solution.ts',
      files: { 'solution.ts': `export function solve(s: string) { console.log(s); }` },
      testCases: [{ id: 't1', name: 'basic', args: ['hi'], expected: 'hi' }],
    });
    expect(noReturn.layer2.testResults[0].diagnosis?.kind).toBe('forgotten-return');

    // 2. Input mutation
    const mutated = await evaluateSubmission({
      requestId: 'd2',
      entryFile: 'solution.ts',
      entryFunction: 'sortedCopy',
      files: { 'solution.ts': `export function sortedCopy(arr: number[]): number[] { return arr.sort((a, b) => a - b); }` },
      testCases: [{ id: 't1', name: 'immutable sort', args: [[3, 1, 2]], expected: [1, 2, 3], checkImmutability: true }],
    });
    expect(mutated.passed).toBe(false);
    expect(mutated.layer2.testResults[0].diagnosis?.kind).toBe('input-mutation');

    // 3. Off-by-one
    const offByOne = await evaluateSubmission({
      requestId: 'd3',
      entryFile: 'solution.ts',
      entryFunction: 'countItems',
      files: { 'solution.ts': `export function countItems(n: number): number { return n - 1; }` },
      testCases: [{ id: 't1', name: 'count', args: [5], expected: 5 }],
    });
    expect(offByOne.layer2.testResults[0].diagnosis?.kind).toBe('off-by-one');

    // 4. Decimal .toFixed precision
    const badDecimal = await evaluateSubmission({
      requestId: 'd4',
      entryFile: 'solution.ts',
      files: { 'solution.ts': `export function solve(): string { return 'TOTAL = R$ 19.5'; }` },
      testCases: [{ id: 't1', name: 'currency', args: [''], expected: 'TOTAL = R$ 19.50' }],
    });
    expect(badDecimal.layer2.testResults[0].diagnosis?.kind).toBe('float-precision');

    // 5. Whitespace / trailing newline (Beecrowd style)
    const badWs = await evaluateSubmission({
      requestId: 'd5',
      entryFile: 'solution.ts',
      files: { 'solution.ts': `export function solve(): string { return 'X = 10\\n'; }` },
      testCases: [{ id: 't1', name: 'stdout', args: [''], expected: 'X = 10' }],
    });
    expect(badWs.layer2.testResults[0].diagnosis?.kind).toBe('whitespace-newline');

    // 6. Wrong element order
    const wrongOrder = await evaluateSubmission({
      requestId: 'd6',
      entryFile: 'solution.ts',
      entryFunction: 'rank',
      files: { 'solution.ts': `export function rank(xs: number[]): number[] { return [...xs].sort((a, b) => b - a); }` },
      testCases: [{ id: 't1', name: 'asc', args: [[2, 1, 3]], expected: [1, 2, 3] }],
    });
    expect(wrongOrder.layer2.testResults[0].diagnosis?.kind).toBe('wrong-order');

    // 7. Playground execution
    const play = await evaluatePlayground({
      requestId: 'p1',
      entryFile: 'solution.ts',
      files: { 'solution.ts': `export function solve(input: string): string { return input.trim().toUpperCase(); }` },
      customInput: '  zed ide  ',
    });
    expect(play.ok).toBe(true);
    expect(play.output).toBe('ZED IDE');
  });
});
