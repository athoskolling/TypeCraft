import type { Section } from '../types/curriculum';

export const section4: Section = {
  id: 'section-4',
  number: 4,
  slug: 'generics-data-structures',
  title: 'Generics & Data Structures',
  subtitle: 'Type Parameter Inference, Constraints, Maps/Sets, Stacks/Queues & Graph Traversals',
  accentColor: '#56b6c2',
  description:
    'Write reusable, zero-cast algorithms and data structures using generic type parameters, `extends` constraints, key-safe indexed lookups, hash maps and sets, O(1) circular queues, monotonic stacks/deques, binary trees, topological sorting, and BFS graph routing.',
  phases: [
    {
      id: 's4-p1',
      number: 1,
      title: 'Generic Functions & Type Parameter Inference',
      subtitle: 'Polymorphic collection combinators, callback inference, and tuple type utilities',
      conceptSummary: `Generics parameterize functions, classes, and types over unknown concrete types while preserving exact relationships between inputs and outputs:

- **Automatic argument inference:** Calling \`zipWith([1, 2], ['a', 'b'], (n, s) => s.repeat(n))\` lets TypeScript infer \`A = number\`, \`B = string\`, and \`R = string\` automatically without explicit type arguments.
- **Multiple type parameters:** Functions like \`groupBy<T, K extends PropertyKey>\` relate element type \`T\` to selector output \`K\` so the return type narrows to \`Record<K, T[]>\`.
- **Variadic tuple inference:** At the type level, \`T extends readonly [infer Head, ...infer Tail]\` destructures tuples recursively cleanly and safely.`,
      challenges: [
        {
          id: 's4-p1-c1',
          title: 'Generic zipWith Combinator',
          style: 'leetcode',
          difficulty: 'beginner',
          description: `Implement a generic collection combinator \`zipWith<A, B, R>(left, right, combiner)\`.

### Requirements
- Iterate from \`index = 0\` up to \`Math.min(left.length, right.length) - 1\`.
- For each index, invoke \`combiner(left[index], right[index], index)\` and collect the results into a new \`R[]\`.
- Do not mutate \`left\` or \`right\`.`,
          tags: ['Generics', 'Type Inference', 'Higher-Order Functions'],
          hints: [
            'Declare three type parameters: `export function zipWith<A, B, R>(left: readonly A[], right: readonly B[], combiner: (a: A, b: B, index: number) => R): R[]`.',
            'Stop at `const len = Math.min(left.length, right.length)` so neither array goes out of bounds.',
          ],
          entryFunction: 'zipWith',
          astRules: { requireGenerics: true },
          starterCode: `export function zipWith<A, B, R>(
  left: readonly A[],
  right: readonly B[],
  combiner: (a: A, b: B, index: number) => R
): R[] {
  // TODO: Combine elements pairwise up to the shorter array length
  void left;
  void right;
  void combiner;
  return [];
}
`,
          referenceSolution: `export function zipWith<A, B, R>(
  left: readonly A[],
  right: readonly B[],
  combiner: (a: A, b: B, index: number) => R
): R[] {
  const limit = Math.min(left.length, right.length);
  const result: R[] = [];
  for (let i = 0; i < limit; i++) {
    result.push(combiner(left[i], right[i], i));
  }
  return result;
}
`,
          typeAssertionPrelude: `import { zipWith } from './solution';

const combined = zipWith([10, 20], ['ms', 's'], (val, unit, idx) => ({ idx, label: \`\${val}\${unit}\` }));`,
          typeAssertions: [
            {
              id: 'ta-1',
              name: 'Infers output element type R from combiner return value',
              assertion: `Expect<Equal<typeof combined, { idx: number; label: string }[]>>`,
            },
          ],
          testCases: [
            {
              id: 'tc-1',
              name: 'Zips equal-length number and string arrays',
              harnessCode: `return exports.zipWith([2, 3, 1], ['ha', 'yo', 'go'], (n, word) => word.repeat(n));`,
              expected: ['haha', 'yoyo' + 'yo', 'go'],
            },
            {
              id: 'tc-2',
              name: 'Truncates cleanly to shorter left or right array',
              harnessCode: `return exports.zipWith([10, 20, 30, 40], [1, 2], (a, b) => a + b);`,
              expected: [11, 22],
            },
            {
              id: 'tc-3',
              name: 'Passes 0-based index as third argument to combiner',
              harnessCode: `return exports.zipWith(['a', 'b', 'c'], [true, false, true], (ch, flag, idx) => \`\${idx}:\${ch}:\${flag}\`);`,
              expected: ['0:a:true', '1:b:false', '2:c:true'],
            },
            {
              id: 'tc-4',
              name: 'Hidden: Empty input array returns empty array without calling combiner',
              hidden: true,
              harnessCode: `
                let calls = 0;
                const out = exports.zipWith([], [1, 2, 3], () => { calls++; return 0; });
                return { out, calls };
              `,
              expected: { out: [], calls: 0 },
            },
            {
              id: 'tc-5',
              name: 'Hidden: Does not mutate input arrays',
              hidden: true,
              harnessCode: `
                const a = [5, 6];
                const b = [7, 8, 9];
                const res = exports.zipWith(a, b, (x, y) => x * y);
                return { res, a, b };
              `,
              expected: { res: [35, 48], a: [5, 6], b: [7, 8, 9] },
            },
          ],
        },
        {
          id: 's4-p1-c2',
          title: 'Generic groupBy<T, K>',
          style: 'leetcode',
          difficulty: 'easy',
          description: `Implement \`groupBy<T, K extends PropertyKey>(items, keySelector)\` returning \`Record<K, T[]>\`.

### Requirements
- Call \`keySelector(item, index)\` for each element in \`items\`.
- Group matching items into arrays under their computed key while preserving original encounter order within each bucket.
- Use \`Object.hasOwn\` when checking existing buckets so keys like \`"toString"\` do not collide with \`Object.prototype\`.`,
          tags: ['Generics', 'PropertyKey', 'Grouping'],
          hints: [
            'Constrain `K extends PropertyKey` so string literal unions like `"odd" | "even"` are preserved in `Record<K, T[]>`.',
            'Check `if (!Object.hasOwn(groups, key)) { groups[key] = []; }` before pushing `item`.',
          ],
          entryFunction: 'groupBy',
          astRules: { requireGenerics: true },
          starterCode: `export function groupBy<T, K extends PropertyKey>(
  items: readonly T[],
  keySelector: (item: T, index: number) => K
): Record<K, T[]> {
  // TODO: Group items into buckets keyed by keySelector
  void items;
  void keySelector;
  return {} as Record<K, T[]>;
}
`,
          referenceSolution: `export function groupBy<T, K extends PropertyKey>(
  items: readonly T[],
  keySelector: (item: T, index: number) => K
): Record<K, T[]> {
  const groups = {} as Record<K, T[]>;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const key = keySelector(item, i);
    if (!Object.hasOwn(groups, key)) {
      groups[key] = [];
    }
    groups[key].push(item);
  }
  return groups;
}
`,
          typeAssertionPrelude: `import { groupBy } from './solution';

const parity = groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? 'even' : 'odd'));`,
          typeAssertions: [
            {
              id: 'ta-1',
              name: 'Preserves literal union key type K in Record<K, T[]>',
              assertion: `Expect<Equal<typeof parity, Record<'even' | 'odd', number[]>>>`,
            },
          ],
          testCases: [
            {
              id: 'tc-1',
              name: 'Groups numbers by parity preserving order',
              harnessCode: `return exports.groupBy([1, 4, 3, 8, 5], (n) => (n % 2 === 0 ? 'even' : 'odd'));`,
              expected: { odd: [1, 3, 5], even: [4, 8] },
            },
            {
              id: 'tc-2',
              name: 'Groups objects by derived tier using index parameter',
              harnessCode: `
                const tasks = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
                return exports.groupBy(tasks, (_t, idx) => (idx < 2 ? 'head' : 'tail'));
              `,
              expected: {
                head: [{ id: 'a' }, { id: 'b' }],
                tail: [{ id: 'c' }, { id: 'd' }],
              },
            },
            {
              id: 'tc-3',
              name: 'Empty array returns empty object',
              harnessCode: `return exports.groupBy([], (x) => String(x));`,
              expected: {},
            },
            {
              id: 'tc-4',
              name: 'Hidden: Safely handles Object.prototype key names like "toString"',
              hidden: true,
              harnessCode: `return exports.groupBy(['toString', 'normal', 'toString'], (s) => s);`,
              expected: { toString: ['toString', 'toString'], normal: ['normal'] },
            },
            {
              id: 'tc-5',
              name: 'Hidden: Supports numeric bucket keys',
              hidden: true,
              harnessCode: `return exports.groupBy(['go', 'ts', 'rust', 'c'], (w) => w.length);`,
              expected: { 1: ['c'], 2: ['go', 'ts'], 4: ['rust'] },
            },
          ],
        },
        {
          id: 's4-p1-c3',
          title: 'Order-Preserving uniqBy & partition',
          style: 'leetcode',
          difficulty: 'easy',
          description: `Implement two foundational generic array utilities in O(N) time:

1. \`uniqBy<T, K>(items: readonly T[], selector: (item: T) => K): T[]\`
   Returns a new array keeping only the **first** occurrence of each distinct key \`K\` (compared via \`Set<K>\` SameValueZero semantics).
2. \`partition<T>(items: readonly T[], predicate: (item: T, index: number) => boolean): [T[], T[]]\`
   Splits \`items\` in a single pass into a tuple \`[matched, unmatched]\` preserving relative order.`,
          tags: ['Generics', 'Tuples', 'Deduplication'],
          hints: [
            'In `uniqBy`, maintain `const seen = new Set<K>()` and add `item` to output only when `!seen.has(key)`.',
            'Annotate `partition` return type explicitly as `[T[], T[]]` so TypeScript exposes a 2-tuple rather than `T[][]`.',
          ],
          entryFunction: 'uniqBy',
          astRules: { requireGenerics: true },
          starterCode: `export function uniqBy<T, K>(
  items: readonly T[],
  selector: (item: T) => K
): T[] {
  // TODO: Keep first occurrence for each selector key
  void items;
  void selector;
  return [];
}

export function partition<T>(
  items: readonly T[],
  predicate: (item: T, index: number) => boolean
): [T[], T[]] {
  // TODO: Split items into [matched, unmatched]
  void items;
  void predicate;
  return [[], []];
}
`,
          referenceSolution: `export function uniqBy<T, K>(
  items: readonly T[],
  selector: (item: T) => K
): T[] {
  const seen = new Set<K>();
  const out: T[] = [];
  for (const item of items) {
    const key = selector(item);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

export function partition<T>(
  items: readonly T[],
  predicate: (item: T, index: number) => boolean
): [T[], T[]] {
  const matched: T[] = [];
  const unmatched: T[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (predicate(item, i)) {
      matched.push(item);
    } else {
      unmatched.push(item);
    }
  }
  return [matched, unmatched];
}
`,
          typeAssertionPrelude: `import { uniqBy, partition } from './solution';

const u = uniqBy([{ id: 1, v: 'a' }], (x) => x.id);
const p = partition(['x', 'y'], (s) => s.length > 0);`,
          typeAssertions: [
            {
              id: 'ta-1',
              name: 'uniqBy preserves exact element type T[]',
              assertion: `Expect<Equal<typeof u, { id: number; v: string }[]>>`,
            },
            {
              id: 'ta-2',
              name: 'partition returns a 2-element tuple [T[], T[]]',
              assertion: `Expect<Equal<typeof p, [string[], string[]]>>`,
            },
          ],
          testCases: [
            {
              id: 'tc-1',
              name: 'uniqBy keeps first matching object per key',
              harnessCode: `
                return exports.uniqBy(
                  [{ id: 'a', rev: 1 }, { id: 'b', rev: 1 }, { id: 'a', rev: 2 }],
                  (item) => item.id
                );
              `,
              expected: [
                { id: 'a', rev: 1 },
                { id: 'b', rev: 1 },
              ],
            },
            {
              id: 'tc-2',
              name: 'uniqBy case-insensitive string deduplication',
              harnessCode: `return exports.uniqBy(['TypeScript', 'typescript', 'Rust', 'RUST'], (s) => s.toLowerCase());`,
              expected: ['TypeScript', 'Rust'],
            },
            {
              id: 'tc-3',
              name: 'partition separates items into [matched, unmatched]',
              harnessCode: `return exports.partition([10, -3, 0, 25, -1], (n) => n >= 0);`,
              expected: [
                [10, 0, 25],
                [-3, -1],
              ],
            },
            {
              id: 'tc-4',
              name: 'partition passes index argument accurately',
              harnessCode: `return exports.partition(['a', 'b', 'c', 'd'], (_v, i) => i % 2 === 0);`,
              expected: [
                ['a', 'c'],
                ['b', 'd'],
              ],
            },
            {
              id: 'tc-5',
              name: 'Hidden: Empty inputs produce empty arrays',
              hidden: true,
              harnessCode: `return { u: exports.uniqBy([], (x) => x), p: exports.partition([], () => true) };`,
              expected: { u: [], p: [[], []] },
            },
            {
              id: 'tc-6',
              name: 'Hidden: uniqBy handles NaN keys consistently via Set semantics',
              hidden: true,
              harnessCode: `return exports.uniqBy([NaN, 1, NaN, 2], (n) => n).map((x) => Number.isNaN(x) ? 'NaN' : x);`,
              expected: ['NaN', 1, 2],
            },
          ],
        },
        {
          id: 's4-p1-c4',
          title: 'Generic Tuple Utilities (SwapPair, HeadOrNull & ZipTuples)',
          style: 'type-challenge',
          difficulty: 'easy',
          description: `Implement three compile-time tuple utilities using conditional \`infer\`:

1. \`SwapPair<P extends readonly [unknown, unknown]>\`: Returns mutable tuple \`[B, A]\` for input \`[A, B]\` or \`readonly [A, B]\`.
2. \`HeadOrNull<T extends readonly unknown[]>\`: Returns the first element type \`T[0]\` if \`T\` is non-empty, or \`null\` if \`T\` is \`[]\` / \`readonly []\`.
3. \`ZipTuples<A extends readonly unknown[], B extends readonly unknown[]>\`: Recursively pairs elements into \`[[A0, B0], [A1, B1], ...]\`, stopping when either tuple runs out of elements.`,
          tags: ['Tuples', 'infer', 'Recursive Types'],
          hints: [
            'Match `P extends readonly [infer First, infer Second] ? [Second, First] : never`.',
            'Match `T extends readonly [infer Head, ...unknown[]] ? Head : null`.',
            'For `ZipTuples`, match `[A, B] extends [readonly [infer AH, ...infer AT], readonly [infer BH, ...infer BT]] ? [[AH, BH], ...ZipTuples<AT, BT>] : []`.',
          ],
          starterCode: `export type SwapPair<P extends readonly [unknown, unknown]> = P;

export type HeadOrNull<T extends readonly unknown[]> = unknown;

export type ZipTuples<
  A extends readonly unknown[],
  B extends readonly unknown[],
> = [];
`,
          referenceSolution: `export type SwapPair<P extends readonly [unknown, unknown]> =
  P extends readonly [infer First, infer Second] ? [Second, First] : never;

export type HeadOrNull<T extends readonly unknown[]> =
  T extends readonly [infer Head, ...unknown[]] ? Head : null;

export type ZipTuples<
  A extends readonly unknown[],
  B extends readonly unknown[],
> = A extends readonly [infer AH, ...infer AT]
  ? B extends readonly [infer BH, ...infer BT]
    ? [[AH, BH], ...ZipTuples<AT, BT>]
    : []
  : [];
`,
          typeAssertionPrelude: `import type { SwapPair, HeadOrNull, ZipTuples } from './solution';`,
          typeAssertions: [
            {
              id: 'ta-1',
              name: 'SwapPair reverses pair types including readonly input tuples',
              assertion: `Expect<Equal<SwapPair<readonly [string, number]>, [number, string]>>`,
            },
            {
              id: 'ta-2',
              name: 'HeadOrNull extracts head element of non-empty tuple',
              assertion: `Expect<Equal<HeadOrNull<[boolean, string, number]>, boolean>>`,
            },
            {
              id: 'ta-3',
              name: 'HeadOrNull returns null for empty tuple',
              assertion: `Expect<Equal<HeadOrNull<readonly []>, null>>`,
            },
            {
              id: 'ta-4',
              name: 'ZipTuples pairs equal-length tuples',
              assertion: `Expect<Equal<ZipTuples<[1, 2, 3], ['a', 'b', 'c']>, [[1, 'a'], [2, 'b'], [3, 'c']]>>`,
            },
            {
              id: 'ta-5',
              name: 'Hidden: ZipTuples truncates to shorter tuple',
              hidden: true,
              assertion: `Expect<Equal<ZipTuples<[1, 2, 3, 4], ['x', 'y']>, [[1, 'x'], [2, 'y']]>>`,
            },
            {
              id: 'ta-6',
              name: 'Hidden: ZipTuples with empty tuple yields []',
              hidden: true,
              assertion: `Expect<Equal<ZipTuples<[], [1, 2]>, []>>`,
            },
          ],
          testCases: [],
        },
      ],
    },
    {
      id: 's4-p2',
      number: 2,
      title: 'Generic Constraints (`extends`) & Key-Safe Utilities',
      subtitle: 'Constraining type parameters to object shapes, valid keys, and comparable fields',
      conceptSummary: `Unconstrained \`<T>\` treats values as opaque boxes. Adding **generic constraints** (\`extends\`) unlocks safe member access while keeping full polymorphism:

- **\`K extends keyof T\`:** Connects a key parameter directly to an object's property names, giving \`T[K]\` as the exact indexed lookup return type.
- **Value-constrained keys (\`T extends Record<K, string | number>\`):** Restricts \`key\` so callers can only pass keys whose values are valid dictionary keys or sortable primitives!
- **Type-level object merging:** Mapped types over \`keyof A | keyof B\` compute exact overridden property types cleanly.`,
      challenges: [
        {
          id: 's4-p2-c1',
          title: 'Key-Constrained pluck<T, K>',
          style: 'leetcode',
          difficulty: 'easy',
          description: `Implement \`pluck<T, K extends keyof T>(items: readonly T[], key: K): T[K][]\` so it extracts \`item[key]\` across every element in \`items\` without mutating the input array.`,
          tags: ['Constraints', 'keyof', 'Indexed Access Types'],
          hints: [
            'Signature: `export function pluck<T, K extends keyof T>(items: readonly T[], key: K): T[K][]`.',
            '`items.map((item) => item[key])` returns `T[K][]` directly with zero casts.',
          ],
          entryFunction: 'pluck',
          astRules: { requireGenerics: true },
          starterCode: `export function pluck<T, K extends keyof T>(
  items: readonly T[],
  key: K
): T[K][] {
  // TODO: Extract item[key] for each element in items
  void items;
  void key;
  return [];
}
`,
          referenceSolution: `export function pluck<T, K extends keyof T>(
  items: readonly T[],
  key: K
): T[K][] {
  return items.map((item) => item[key]);
}
`,
          typeAssertionPrelude: `import { pluck } from './solution';

interface Metric {
  readonly name: string;
  readonly latencyMs: number;
  readonly cached?: boolean;
}
declare const metrics: readonly Metric[];
const latencies = pluck(metrics, 'latencyMs');
const flags = pluck(metrics, 'cached');`,
          typeAssertions: [
            {
              id: 'ta-1',
              name: 'pluck narrows return array element type to T[K]',
              assertion: `Expect<Equal<typeof latencies, number[]>>`,
            },
            {
              id: 'ta-2',
              name: 'pluck preserves optional T[K] | undefined union',
              assertion: `Expect<Equal<typeof flags, (boolean | undefined)[]>>`,
            },
          ],
          testCases: [
            {
              id: 'tc-1',
              name: 'Extracts string property across records',
              checkImmutability: true,
              args: [
                [
                  { id: 'srv-1', port: 8080 },
                  { id: 'srv-2', port: 9090 },
                ],
                'id',
              ],
              expected: ['srv-1', 'srv-2'],
            },
            {
              id: 'tc-2',
              name: 'Extracts numeric property including 0',
              checkImmutability: true,
              args: [
                [
                  { sku: 'A', stock: 12 },
                  { sku: 'B', stock: 0 },
                ],
                'stock',
              ],
              expected: [12, 0],
            },
            {
              id: 'tc-3',
              name: 'Empty input array returns empty array',
              checkImmutability: true,
              args: [[], 'id'],
              expected: [],
            },
            {
              id: 'tc-4',
              name: 'Hidden: Preserves nested object references cleanly',
              hidden: true,
              checkImmutability: true,
              args: [
                [
                  { meta: { v: 1 } },
                  { meta: { v: 2 } },
                ],
                'meta',
              ],
              expected: [{ v: 1 }, { v: 2 }],
            },
            {
              id: 'tc-5',
              name: 'Hidden: Preserves null and false values',
              hidden: true,
              checkImmutability: true,
              args: [[{ ok: false }, { ok: null }], 'ok'],
              expected: [false, null],
            },
          ],
        },
        {
          id: 's4-p2-c2',
          title: 'Constrained indexBy Lookup Builder',
          style: 'leetcode',
          difficulty: 'easy',
          description: `Implement \`indexBy<T extends Record<K, string | number>, K extends keyof T>(items, key)\` returning \`Record<string, T>\`.

### Requirements
- Constrain \`T\` and \`K\` so \`item[key]\` is guaranteed at compile time to be \`string | number\`.
- Index each item in \`items\` under \`String(item[key])\`.
- When two items share the same key value, the **later** item overwrites the earlier one.
- Do not mutate \`items\`.`,
          tags: ['Generic Constraints', 'Dictionary Indexing', 'Immutability'],
          hints: [
            'Use `<T extends Record<K, string | number>, K extends keyof T>` so calling `indexBy(users, "tags")` (where `tags` is `string[]`) is rejected at compile time!',
            'Assign `lookup[String(item[key])] = item` in a forward loop.',
          ],
          entryFunction: 'indexBy',
          astRules: { requireGenerics: true },
          starterCode: `export function indexBy<
  T extends Record<K, string | number>,
  K extends keyof T,
>(items: readonly T[], key: K): Record<string, T> {
  // TODO: Build lookup table keyed by String(item[key])
  void items;
  void key;
  return {};
}
`,
          referenceSolution: `export function indexBy<
  T extends Record<K, string | number>,
  K extends keyof T,
>(items: readonly T[], key: K): Record<string, T> {
  const out: Record<string, T> = {};
  for (const item of items) {
    out[String(item[key])] = item;
  }
  return out;
}
`,
          typeAssertionPrelude: `import { indexBy } from './solution';

interface NodeInfo {
  readonly id: string;
  readonly slot: number;
}
declare const nodes: readonly NodeInfo[];
const byId = indexBy(nodes, 'id');`,
          typeAssertions: [
            {
              id: 'ta-1',
              name: 'Returns Record<string, NodeInfo>',
              assertion: `Expect<Equal<typeof byId, Record<string, NodeInfo>>>`,
            },
          ],
          testCases: [
            {
              id: 'tc-1',
              name: 'Indexes objects by unique string key',
              checkImmutability: true,
              args: [
                [
                  { code: 'US', tax: 8 },
                  { code: 'BR', tax: 17 },
                ],
                'code',
              ],
              expected: {
                US: { code: 'US', tax: 8 },
                BR: { code: 'BR', tax: 17 },
              },
            },
            {
              id: 'tc-2',
              name: 'Later duplicate key overwrites earlier entry',
              checkImmutability: true,
              args: [
                [
                  { id: 'cfg', version: 1 },
                  { id: 'cfg', version: 2 },
                ],
                'id',
              ],
              expected: {
                cfg: { id: 'cfg', version: 2 },
              },
            },
            {
              id: 'tc-3',
              name: 'Indexes by numeric key converted to string',
              checkImmutability: true,
              args: [
                [
                  { port: 80, proto: 'http' },
                  { port: 443, proto: 'https' },
                ],
                'port',
              ],
              expected: {
                '80': { port: 80, proto: 'http' },
                '443': { port: 443, proto: 'https' },
              },
            },
            {
              id: 'tc-4',
              name: 'Hidden: Empty array returns empty lookup object',
              hidden: true,
              checkImmutability: true,
              args: [[], 'id'],
              expected: {},
            },
            {
              id: 'tc-5',
              name: 'Hidden: Numeric key 0 is indexed accurately under "0"',
              hidden: true,
              checkImmutability: true,
              args: [[{ idx: 0, label: 'genesis' }], 'idx'],
              expected: { '0': { idx: 0, label: 'genesis' } },
            },
          ],
        },
        {
          id: 's4-p2-c3',
          title: 'Stable Immutable sortByKey',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Implement \`sortByKey<T extends Record<K, string | number>, K extends keyof T>(items, key, direction)\`.

### Requirements
- \`direction\` defaults to \`'asc'\` (\`'asc' | 'desc'\`).
- **Never mutate** \`items\` (return a new sorted array).
- Compare \`number\` values numerically (\`aVal - bVal\`) and \`string\` values by standard code-unit order (\`aVal < bVal ? -1 : aVal > bVal ? 1 : 0\`).
- **Stability:** Elements with equal \`item[key]\` values must keep their original relative order in \`items\` even when \`direction === 'desc'\`!`,
          tags: ['Generic Constraints', 'Stable Sort', 'Immutability'],
          hints: [
            'Copy first via `[...items]` (ES2019+ `Array.prototype.sort` is guaranteed stable!).',
            'Be careful with `desc`: negate the comparison sign (`cmp * -1`), so when `cmp === 0` it stays `0` and preserves original order rather than reversing ties!',
          ],
          entryFunction: 'sortByKey',
          astRules: { requireGenerics: true },
          starterCode: `export function sortByKey<
  T extends Record<K, string | number>,
  K extends keyof T,
>(
  items: readonly T[],
  key: K,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  // TODO: Return a new stably sorted array without mutating items
  void key;
  void direction;
  return [...items];
}
`,
          referenceSolution: `export function sortByKey<
  T extends Record<K, string | number>,
  K extends keyof T,
>(
  items: readonly T[],
  key: K,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  const factor = direction === 'desc' ? -1 : 1;
  return [...items].sort((a, b) => {
    const va = a[key];
    const vb = b[key];
    if (typeof va === 'number' && typeof vb === 'number') {
      const diff = va - vb;
      return diff === 0 ? 0 : diff * factor;
    }
    const sa = String(va);
    const sb = String(vb);
    if (sa < sb) return -1 * factor;
    if (sa > sb) return 1 * factor;
    return 0;
  });
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Sorts numbers ascending by default',
              checkImmutability: true,
              args: [
                [
                  { host: 'c', latency: 45 },
                  { host: 'a', latency: 12 },
                  { host: 'b', latency: 30 },
                ],
                'latency',
              ],
              expected: [
                { host: 'a', latency: 12 },
                { host: 'b', latency: 30 },
                { host: 'c', latency: 45 },
              ],
            },
            {
              id: 'tc-2',
              name: 'Preserves original tie order on descending sort (stability)',
              checkImmutability: true,
              args: [
                [
                  { id: 'first-10', score: 10 },
                  { id: 'top-50', score: 50 },
                  { id: 'second-10', score: 10 },
                  { id: 'third-10', score: 10 },
                ],
                'score',
                'desc',
              ],
              expected: [
                { id: 'top-50', score: 50 },
                { id: 'first-10', score: 10 },
                { id: 'second-10', score: 10 },
                { id: 'third-10', score: 10 },
              ],
            },
            {
              id: 'tc-3',
              name: 'Sorts string keys descending',
              checkImmutability: true,
              args: [
                [{ slug: 'alpha' }, { slug: 'gamma' }, { slug: 'beta' }],
                'slug',
                'desc',
              ],
              expected: [{ slug: 'gamma' }, { slug: 'beta' }, { slug: 'alpha' }],
            },
            {
              id: 'tc-4',
              name: 'Handles negative numbers accurately',
              checkImmutability: true,
              args: [
                [{ delta: -5 }, { delta: -20 }, { delta: 0 }, { delta: 3 }],
                'delta',
                'asc',
              ],
              expected: [{ delta: -20 }, { delta: -5 }, { delta: 0 }, { delta: 3 }],
            },
            {
              id: 'tc-5',
              name: 'Hidden: Empty array returns empty array',
              hidden: true,
              checkImmutability: true,
              args: [[], 'score', 'desc'],
              expected: [],
            },
            {
              id: 'tc-6',
              name: 'Hidden: Numerical sort does not treat 100 as smaller than 20',
              hidden: true,
              checkImmutability: true,
              args: [[{ n: 100 }, { n: 20 }, { n: 3 }], 'n', 'asc'],
              expected: [{ n: 3 }, { n: 20 }, { n: 100 }],
            },
          ],
        },
        {
          id: 's4-p2-c4',
          title: 'Constrained MergeObjects & KeysByValue',
          style: 'type-challenge',
          difficulty: 'medium',
          description: `Implement two constrained object type utilities:

1. \`MergeObjects<A extends object, B extends object>\`: Produces a flat mapped object type combining all keys of \`A\` and \`B\`. Whenever a key exists in both \`A\` and \`B\`, \`B\`'s property type (and non-optional status if required in \`B\`) overrides \`A\`'s! (For simplicity, evaluate as \`{ [K in keyof A | keyof B]: K extends keyof B ? B[K] : K extends keyof A ? A[K] : never }\` — all test properties are required non-readonly fields.)
2. \`KeysByValue<T extends object, V>\`: Extracts the union of keys \`K\` of \`T\` whose required value type \`T[K]\` is assignable to \`V\`.`,
          tags: ['Generic Constraints', 'Mapped Types', 'Key Extraction'],
          hints: [
            'Iterate `[K in keyof A | keyof B]` and check `K extends keyof B ? B[K] : K extends keyof A ? A[K] : never`.',
            'For `KeysByValue<T, V>`, map `{ [K in keyof T]-?: T[K] extends V ? K : never }[keyof T]`.',
          ],
          starterCode: `export type MergeObjects<A extends object, B extends object> = A & B;

export type KeysByValue<T extends object, V> = keyof T;
`,
          referenceSolution: `export type MergeObjects<A extends object, B extends object> = {
  [K in keyof A | keyof B]: K extends keyof B
    ? B[K]
    : K extends keyof A
      ? A[K]
      : never;
};

export type KeysByValue<T extends object, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
`,
          typeAssertionPrelude: `import type { MergeObjects, KeysByValue } from './solution';

interface DefaultRow {
  id: number;
  name: string;
  active: boolean;
  retries: number;
}`,
          typeAssertions: [
            {
              id: 'ta-1',
              name: 'MergeObjects overrides overlapping key type with B',
              assertion: `Expect<Equal<MergeObjects<{ id: number; name: string }, { id: string; role: 'admin' }>, { id: string; name: string; role: 'admin' }>>`,
            },
            {
              id: 'ta-2',
              name: 'MergeObjects with empty object preserves A',
              assertion: `Expect<Equal<MergeObjects<{ x: 1; y: 2 }, {}>, { x: 1; y: 2 }>>`,
            },
            {
              id: 'ta-3',
              name: 'KeysByValue extracts numeric keys',
              assertion: `Expect<Equal<KeysByValue<DefaultRow, number>, 'id' | 'retries'>>`,
            },
            {
              id: 'ta-4',
              name: 'KeysByValue supports union target value V',
              assertion: `Expect<Equal<KeysByValue<DefaultRow, string | boolean>, 'name' | 'active'>>`,
            },
            {
              id: 'ta-5',
              name: 'Hidden: KeysByValue returns never when no field matches V',
              hidden: true,
              assertion: `Expect<Equal<KeysByValue<DefaultRow, string[]>, never>>`,
            },
            {
              id: 'ta-6',
              name: 'Hidden: MergeObjects where B replaces every key of A',
              hidden: true,
              assertion: `Expect<Equal<MergeObjects<{ a: number; b: number }, { a: boolean; b: string }>, { a: boolean; b: string }>>`,
            },
          ],
          testCases: [],
        },
      ],
    },
    {
      id: 's4-p3',
      number: 3,
      title: 'Maps, Sets & Frequency Algorithms',
      subtitle: 'O(1) hash lookups, canonical signatures, top-K ranking, and sliding cooldowns',
      conceptSummary: `JavaScript's \`Map<K, V>\` and \`Set<T>\` provide guaranteed average-case **O(1)** lookup, insertion, and deletion while preserving insertion order and avoiding \`Object.prototype\` key collisions:

- **Canonical signatures:** Grouping equivalence classes (such as case-insensitive anagrams) reduces to mapping each item to a canonical string key inside \`Map<string, string[]>\`.
- **Set algebra:** Computing retention, churn, and Jaccard similarity over \`Set<T>\` scales linearly \`O(|A| + |B|)\` instead of \`O(|A| * |B|)\` nested \`includes\` scans.
- **Stateful stream filtering:** Tracking last-accepted timestamps in \`Map<string, number>\` powers real-time deduplication and rate-limiting.`,
      challenges: [
        {
          id: 's4-p3-c1',
          title: 'Case-Insensitive Anagram Grouping',
          style: 'leetcode',
          difficulty: 'easy',
          description: `Implement \`groupAnagrams(words: readonly string[]): string[][]\`.

### Rules
- Two words are anagrams if they contain the exact same letters **ignoring case** (e.g. \`"Tea"\` and \`"eat"\`).
- Preserve the **original casing** of each word in the output arrays.
- Preserve **first-seen group order** as well as **within-group encounter order**.
- Do not mutate \`words\`.`,
          tags: ['Map', 'Canonical Key', 'Strings'],
          hints: [
            'Compute `const signature = [...word.toLowerCase()].sort().join("")` for each word.',
            '`Map` iterates entries in insertion order, so `[...buckets.values()]` automatically preserves first-seen group order!',
          ],
          entryFunction: 'groupAnagrams',
          starterCode: `export function groupAnagrams(words: readonly string[]): string[][] {
  // TODO: Group case-insensitive anagrams preserving encounter order
  void words;
  return [];
}
`,
          referenceSolution: `export function groupAnagrams(words: readonly string[]): string[][] {
  const buckets = new Map<string, string[]>();
  for (const word of words) {
    const sig = [...word.toLowerCase()].sort().join('');
    let group = buckets.get(sig);
    if (!group) {
      group = [];
      buckets.set(sig, group);
    }
    group.push(word);
  }
  return [...buckets.values()];
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Groups mixed-case anagrams preserving original casing and order',
              checkImmutability: true,
              args: [['Tea', 'eat', 'Tan', 'ate', 'nat', 'bat']],
              expected: [['Tea', 'eat', 'ate'], ['Tan', 'nat'], ['bat']],
            },
            {
              id: 'tc-2',
              name: 'Handles empty strings and single-letter words',
              checkImmutability: true,
              args: [['', 'A', '', 'a']],
              expected: [['', ''], ['A', 'a']],
            },
            {
              id: 'tc-3',
              name: 'Empty input returns empty array',
              checkImmutability: true,
              args: [[]],
              expected: [],
            },
            {
              id: 'tc-4',
              name: 'Hidden: Distinguishes repeated character multiplicities ("aab" vs "abb")',
              hidden: true,
              checkImmutability: true,
              args: [['aab', 'abb', 'baa', 'bab']],
              expected: [
                ['aab', 'baa'],
                ['abb', 'bab'],
              ],
            },
            {
              id: 'tc-5',
              name: 'Hidden: Preserves duplicate identical words in same bucket',
              hidden: true,
              checkImmutability: true,
              args: [['Listen', 'Silent', 'Listen']],
              expected: [['Listen', 'Silent', 'Listen']],
            },
          ],
        },
        {
          id: 's4-p3-c2',
          title: 'Top-K Frequent Normalized Tokens',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Implement \`topKFrequentTokens(tokens: readonly string[], k: number): string[]\`.

### Rules
1. Normalize each token via \`token.trim().toLowerCase()\`, skipping any token that becomes empty \`""\`.
2. If \`k <= 0\`, return \`[]\`.
3. Rank unique normalized tokens by:
   - **Frequency descending**, then
   - **Lexicographical order ascending** (\`a < b ? -1 : 1\`) on ties.
4. Return at most \`k\` tokens.`,
          tags: ['Map', 'Frequency Counting', 'Custom Comparator'],
          hints: [
            'Count normalized non-empty tokens in a `Map<string, number>`.',
            'Sort `[...counts.entries()]` by `b[1] - a[1]` first, then `a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0`, and `.slice(0, k)`.',
          ],
          entryFunction: 'topKFrequentTokens',
          starterCode: `export function topKFrequentTokens(
  tokens: readonly string[],
  k: number
): string[] {
  // TODO: Count normalized tokens and return top k with alphabetical tie-break
  void tokens;
  void k;
  return [];
}
`,
          referenceSolution: `export function topKFrequentTokens(
  tokens: readonly string[],
  k: number
): string[] {
  if (k <= 0) return [];
  const counts = new Map<string, number>();

  for (const raw of tokens) {
    const norm = raw.trim().toLowerCase();
    if (norm.length === 0) continue;
    counts.set(norm, (counts.get(norm) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
    })
    .slice(0, k)
    .map(([token]) => token);
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Ranks by frequency and tie-breaks alphabetically',
              checkImmutability: true,
              args: [['Error', 'warn', 'ERROR', 'info', 'Warn', 'debug'], 2],
              expected: ['error', 'warn'],
            },
            {
              id: 'tc-2',
              name: 'Ignores whitespace-only strings and handles k larger than unique count',
              checkImmutability: true,
              args: [['  ', 'ts', '\t', 'go', 'ts'], 10],
              expected: ['ts', 'go'],
            },
            {
              id: 'tc-3',
              name: 'k <= 0 returns empty array',
              checkImmutability: true,
              args: [['a', 'a', 'b'], 0],
              expected: [],
            },
            {
              id: 'tc-4',
              name: 'Hidden: Multi-way tie resolved strictly ASCII ascending',
              hidden: true,
              checkImmutability: true,
              args: [['delta', 'alpha', 'charlie', 'bravo'], 3],
              expected: ['alpha', 'bravo', 'charlie'],
            },
            {
              id: 'tc-5',
              name: 'Hidden: All blank tokens returns empty array',
              hidden: true,
              checkImmutability: true,
              args: [['', '   ', '\n'], 5],
              expected: [],
            },
          ],
        },
        {
          id: 's4-p3-c3',
          title: 'Generic Cohort Set Analytics',
          style: 'leetcode',
          difficulty: 'easy',
          description: `Implement \`analyzeCohortSets<T>(previous: readonly T[], current: readonly T[]): CohortReport<T>\` using \`Set<T>\` in linear time.

### Output Fields
Deduplicate both cohorts preserving first-seen order:
- \`retained\`: unique elements from \`previous\` that also exist in \`current\` (in \`previous\` first-seen order).
- \`churned\`: unique elements from \`previous\` that do **not** exist in \`current\` (in \`previous\` first-seen order).
- \`acquired\`: unique elements from \`current\` that did **not** exist in \`previous\` (in \`current\` first-seen order).
- \`jaccardIndex\`: \`|Previous ∩ Current| / |Previous ∪ Current|\` rounded via \`Math.round(val * 1000) / 1000\` (if both sets are empty, return \`1\`).`,
          tags: ['Set', 'Generics', 'Cohort Analytics'],
          hints: [
            'Construct `const prevSet = new Set(previous)` and `const currSet = new Set(current)`—`Set` automatically deduplicates while preserving first-seen insertion order!',
            'Union size equals `prevSet.size + acquired.length` (or `retained.length + churned.length + acquired.length`).',
          ],
          entryFunction: 'analyzeCohortSets',
          astRules: { requireGenerics: true },
          starterCode: `export interface CohortReport<T> {
  readonly retained: T[];
  readonly churned: T[];
  readonly acquired: T[];
  readonly jaccardIndex: number;
}

export function analyzeCohortSets<T>(
  previous: readonly T[],
  current: readonly T[]
): CohortReport<T> {
  // TODO: Compute retained, churned, acquired, and jaccardIndex in O(N + M)
  void previous;
  void current;
  return { retained: [], churned: [], acquired: [], jaccardIndex: 0 };
}
`,
          referenceSolution: `export interface CohortReport<T> {
  readonly retained: T[];
  readonly churned: T[];
  readonly acquired: T[];
  readonly jaccardIndex: number;
}

export function analyzeCohortSets<T>(
  previous: readonly T[],
  current: readonly T[]
): CohortReport<T> {
  const prevSet = new Set<T>(previous);
  const currSet = new Set<T>(current);

  const retained: T[] = [];
  const churned: T[] = [];
  for (const item of prevSet) {
    if (currSet.has(item)) {
      retained.push(item);
    } else {
      churned.push(item);
    }
  }

  const acquired: T[] = [];
  for (const item of currSet) {
    if (!prevSet.has(item)) {
      acquired.push(item);
    }
  }

  const unionSize = retained.length + churned.length + acquired.length;
  const jaccardIndex =
    unionSize === 0 ? 1 : Math.round((retained.length / unionSize) * 1000) / 1000;

  return { retained, churned, acquired, jaccardIndex };
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Computes cohort sets and Jaccard similarity with duplicate inputs',
              checkImmutability: true,
              args: [
                ['u1', 'u2', 'u1', 'u3'],
                ['u2', 'u4', 'u3', 'u4'],
              ],
              expected: {
                retained: ['u2', 'u3'],
                churned: ['u1'],
                acquired: ['u4'],
                jaccardIndex: 0.5,
              },
            },
            {
              id: 'tc-2',
              name: 'Two empty cohorts return jaccardIndex 1',
              checkImmutability: true,
              args: [[], []],
              expected: {
                retained: [],
                churned: [],
                acquired: [],
                jaccardIndex: 1,
              },
            },
            {
              id: 'tc-3',
              name: 'Disjoint numeric cohorts return jaccardIndex 0',
              checkImmutability: true,
              args: [
                [10, 20],
                [30, 40],
              ],
              expected: {
                retained: [],
                churned: [10, 20],
                acquired: [30, 40],
                jaccardIndex: 0,
              },
            },
            {
              id: 'tc-4',
              name: 'Hidden: Rounds 1/3 Jaccard ratio to 0.333',
              hidden: true,
              checkImmutability: true,
              args: [
                ['a', 'b'],
                ['b', 'c'],
              ],
              expected: {
                retained: ['b'],
                churned: ['a'],
                acquired: ['c'],
                jaccardIndex: 0.333,
              },
            },
            {
              id: 'tc-5',
              name: 'Hidden: Identical cohorts yield jaccardIndex 1',
              hidden: true,
              checkImmutability: true,
              args: [
                [1, 2, 3],
                [3, 2, 1],
              ],
              expected: {
                retained: [1, 2, 3],
                churned: [],
                acquired: [],
                jaccardIndex: 1,
              },
            },
          ],
        },
        {
          id: 's4-p3-c4',
          title: 'Event Stream Cooldown Deduplicator',
          style: 'beecrowd',
          difficulty: 'easy',
          description: `Filter a chronological alert stream so duplicate keys within a cooldown window are suppressed.

### Input Format
- First line: \`N W\` (\`N >= 0\` events, \`W >= 0\` cooldown seconds).
- Next \`N\` lines: \`<timestampSec> <eventKey>\` (timestamps are non-decreasing integers).

### Deduplication Rule
An event \`(t, key)\` is **ACCEPTED** if \`key\` has never been accepted before OR \`t - lastAcceptedTime.get(key) >= W\`.
- When accepted, update \`lastAcceptedTime.set(key, t)\`.
- When suppressed, do **not** update \`lastAcceptedTime\`!

### Output Format
\`\`\`
ACCEPTED: <acceptedCount>
SUPPRESSED: <suppressedCount>
<t1> <key1>
...
\`\`\`
(Only accepted events are listed after the two summary lines.)`,
          tags: ['Map', 'Rate Limiting', 'Stdin Stream'],
          hints: [
            'Store `lastAccepted = new Map<string, number>()`.',
            'If `prev === undefined || ts - prev >= windowSec`, accept the event and update `lastAccepted.set(key, ts)`.',
          ],
          entryFunction: 'solve',
          playgroundInput: `6 10
0 disk_full
4 disk_full
9 cpu_high
10 disk_full
15 disk_full
19 cpu_high`,
          starterCode: `export function solve(input: string): string {
  // TODO: Filter chronological events using cooldown window W
  void input;
  return '';
}
`,
          referenceSolution: `export function solve(input: string): string {
  const lines = input
    .split(/\\r?\\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return 'ACCEPTED: 0\\nSUPPRESSED: 0';
  }

  const header = lines[0].split(/\\s+/);
  const n = Number(header[0]);
  const windowSec = Number(header[1]);

  const lastAccepted = new Map<string, number>();
  const acceptedLines: string[] = [];
  let suppressed = 0;

  for (let i = 1; i <= n && i < lines.length; i++) {
    const parts = lines[i].split(/\\s+/);
    const ts = Number(parts[0]);
    const key = parts[1];
    if (key === undefined || !Number.isFinite(ts)) continue;

    const prev = lastAccepted.get(key);
    if (prev === undefined || ts - prev >= windowSec) {
      lastAccepted.set(key, ts);
      acceptedLines.push(\`\${ts} \${key}\`);
    } else {
      suppressed++;
    }
  }

  return [
    \`ACCEPTED: \${acceptedLines.length}\`,
    \`SUPPRESSED: \${suppressed}\`,
    ...acceptedLines,
  ].join('\\n');
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Suppresses events strictly inside cooldown window without extending cooldown',
              args: [
                `6 10
0 disk_full
4 disk_full
9 cpu_high
10 disk_full
15 disk_full
19 cpu_high`,
              ],
              expected: `ACCEPTED: 4\nSUPPRESSED: 2\n0 disk_full\n9 cpu_high\n10 disk_full\n19 cpu_high`,
            },
            {
              id: 'tc-2',
              name: 'Zero cooldown window W = 0 accepts every event even at identical timestamps',
              args: [
                `3 0
5 ping
5 ping
5 ping`,
              ],
              expected: `ACCEPTED: 3\nSUPPRESSED: 0\n5 ping\n5 ping\n5 ping`,
            },
            {
              id: 'tc-3',
              name: 'Zero events outputs only summary counts',
              args: [`0 30`],
              expected: `ACCEPTED: 0\nSUPPRESSED: 0`,
            },
            {
              id: 'tc-4',
              name: 'Hidden: Suppressed events do not reset cooldown anchor',
              hidden: true,
              args: [
                `4 5
10 auth_fail
12 auth_fail
14 auth_fail
15 auth_fail`,
              ],
              expected: `ACCEPTED: 2\nSUPPRESSED: 2\n10 auth_fail\n15 auth_fail`,
            },
            {
              id: 'tc-5',
              name: 'Hidden: Handles prototype-named eventKey "constructor" safely via Map',
              hidden: true,
              args: [
                `2 10
1 constructor
5 constructor`,
              ],
              expected: `ACCEPTED: 1\nSUPPRESSED: 1\n1 constructor`,
            },
          ],
        },
      ],
    },
    {
      id: 's4-p4',
      number: 4,
      title: 'Stacks, Queues & Linked/Deque Structures',
      subtitle: 'Monotonic stacks, bracket matching, O(1) circular queues, and sliding window deques',
      conceptSummary: `Choosing the right linear data structure keeps throughput **O(N)** instead of degrading to **O(N²)**:

- **Monotonic stacks:** Maintaining indices in decreasing order solves "next greater element" across an entire array in \`O(N)\` total pushes and pops.
- **Circular ring buffers:** Calling \`Array.prototype.shift()\` shifts every remaining element in \`O(N)\`. A fixed-capacity circular buffer (\`head\`, \`tail\`, \`count\`) achieves true **O(1)** \`enqueue\` and \`dequeue\`.
- **Monotonic index deques:** Maintaining candidate indices in decreasing value order with a \`head\` pointer computes sliding-window maxima in \`O(N)\` time.`,
      challenges: [
        {
          id: 's4-p4-c1',
          title: 'Monotonic Stack: Next Greater Distance',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Given \`readings: readonly number[]\`, implement \`nextGreaterDistances(readings)\` in **O(N)** time.

For each index \`i\`, return \`j - i\` where \`j > i\` is the **first** index with \`readings[j] > readings[i]\`. If no strictly greater reading occurs to the right of \`i\`, set \`result[i] = 0\`.`,
          tags: ['Monotonic Stack', 'Arrays', 'O(N)'],
          hints: [
            'Initialize `const result = new Array<number>(readings.length).fill(0)` and `const stack: number[] = []` storing unresolved indices.',
            'While `stack` is non-empty and `readings[i] > readings[stack[stack.length - 1]]`, pop `prevIdx` and set `result[prevIdx] = i - prevIdx`.',
          ],
          entryFunction: 'nextGreaterDistances',
          starterCode: `export function nextGreaterDistances(readings: readonly number[]): number[] {
  // TODO: Compute distance to next strictly greater element using a monotonic stack
  return readings.map(() => 0);
}
`,
          referenceSolution: `export function nextGreaterDistances(readings: readonly number[]): number[] {
  const result = new Array<number>(readings.length).fill(0);
  const stack: number[] = [];

  for (let i = 0; i < readings.length; i++) {
    const current = readings[i];
    while (stack.length > 0 && current > readings[stack[stack.length - 1]]) {
      const prevIdx = stack.pop()!;
      result[prevIdx] = i - prevIdx;
    }
    stack.push(i);
  }

  return result;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Classic fluctuating temperature/latency series',
              checkImmutability: true,
              args: [[73, 74, 75, 71, 69, 72, 76, 73]],
              expected: [1, 1, 4, 2, 1, 1, 0, 0],
            },
            {
              id: 'tc-2',
              name: 'Strictly decreasing array yields all zeros',
              checkImmutability: true,
              args: [[90, 80, 70, 60]],
              expected: [0, 0, 0, 0],
            },
            {
              id: 'tc-3',
              name: 'Equal values require strictly greater element to resolve',
              checkImmutability: true,
              args: [[50, 50, 50, 60]],
              expected: [3, 2, 1, 0],
            },
            {
              id: 'tc-4',
              name: 'Hidden: Empty array returns empty array',
              hidden: true,
              checkImmutability: true,
              args: [[]],
              expected: [],
            },
            {
              id: 'tc-5',
              name: 'Hidden: Handles negative numbers accurately',
              hidden: true,
              checkImmutability: true,
              args: [[-10, -20, -10, -5]],
              expected: [3, 1, 1, 0],
            },
          ],
        },
        {
          id: 's4-p4-c2',
          title: 'Balanced Delimiter Validator with Error Index',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Validate bracket nesting for \`()\`, \`[]\`, and \`{}\` inside \`source: string\` (ignoring all non-bracket characters) and return a discriminated \`DelimiterCheck\` result:

- **Valid:** \`{ valid: true, maxDepth: number }\` where \`maxDepth\` is the maximum simultaneous nesting depth reached (\`0\` if no brackets appear).
- **Invalid:** \`{ valid: false, errorIndex: number }\`:
  - If an unexpected or mismatched closing bracket appears at 0-based index \`i\`, return \`errorIndex: i\` immediately.
  - If the string ends with one or more unclosed opening brackets still on the stack, return the 0-based index of the **topmost (most recently opened)** unclosed bracket.`,
          tags: ['Stack', 'Discriminated Unions', 'Parsing'],
          hints: [
            'Push `{ char, index }` entries onto your stack whenever `(`, `[`, or `{` is seen, updating `maxDepth = Math.max(maxDepth, stack.length)`.',
            'If `stack.length > 0` after scanning `source`, `stack[stack.length - 1].index` is the most recently opened unclosed bracket.',
          ],
          entryFunction: 'validateDelimiters',
          astRules: { requireInterfaceOrType: true },
          starterCode: `export type DelimiterCheck =
  | { readonly valid: true; readonly maxDepth: number }
  | { readonly valid: false; readonly errorIndex: number };

export function validateDelimiters(source: string): DelimiterCheck {
  // TODO: Validate (), [], {} nesting and pinpoint exact errorIndex on failure
  void source;
  return { valid: false, errorIndex: -1 };
}
`,
          referenceSolution: `export type DelimiterCheck =
  | { readonly valid: true; readonly maxDepth: number }
  | { readonly valid: false; readonly errorIndex: number };

const MATCHING_OPEN: Readonly<Record<string, string>> = {
  ')': '(',
  ']': '[',
  '}': '{',
};

export function validateDelimiters(source: string): DelimiterCheck {
  const stack: { readonly open: string; readonly index: number }[] = [];
  let maxDepth = 0;

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push({ open: ch, index: i });
      if (stack.length > maxDepth) {
        maxDepth = stack.length;
      }
    } else if (ch === ')' || ch === ']' || ch === '}') {
      const top = stack.pop();
      if (!top || top.open !== MATCHING_OPEN[ch]) {
        return { valid: false, errorIndex: i };
      }
    }
  }

  if (stack.length > 0) {
    return { valid: false, errorIndex: stack[stack.length - 1].index };
  }

  return { valid: true, maxDepth };
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Tracks maximum nesting depth across valid expression',
              args: ['fn(a[0], { x: (1 + [2]) })'],
              expected: { valid: true, maxDepth: 4 },
            },
            {
              id: 'tc-2',
              name: 'Reports index of mismatched closing bracket',
              args: ['const arr = [1, (2 + 3]);'],
              expected: { valid: false, errorIndex: 22 },
            },
            {
              id: 'tc-3',
              name: 'Reports index of stray closing bracket on empty stack',
              args: ['abc } def'],
              expected: { valid: false, errorIndex: 4 },
            },
            {
              id: 'tc-4',
              name: 'Reports index of most recently opened unclosed bracket at EOF',
              args: ['outer( inner[ ok() '],
              expected: { valid: false, errorIndex: 12 },
            },
            {
              id: 'tc-5',
              name: 'Hidden: String with zero brackets is valid with maxDepth 0',
              hidden: true,
              args: ['plain text 123'],
              expected: { valid: true, maxDepth: 0 },
            },
            {
              id: 'tc-6',
              name: 'Hidden: Adjacent sequential pairs have maxDepth 1',
              hidden: true,
              args: ['()[]{}'],
              expected: { valid: true, maxDepth: 1 },
            },
          ],
        },
        {
          id: 's4-p4-c3',
          title: 'Generic O(1) Circular BoundedQueue<T>',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Implement \`export class BoundedQueue<T>\` backed by a fixed-size circular ring buffer (no \`Array.prototype.shift()\`).

### Class Contract
- \`constructor(capacity: number)\`: throws \`RangeError\` if \`!Number.isInteger(capacity) || capacity <= 0\`.
- \`enqueue(item: T): boolean\`: inserts \`item\` at the tail and returns \`true\`, or returns \`false\` without modifying the queue when \`size === capacity\`.
- \`dequeue(): T | undefined\`: removes and returns the oldest item in O(1) time (clearing the vacated slot to \`undefined\`), or \`undefined\` when empty.
- \`peek(): T | undefined\`: returns the oldest item without removing it, or \`undefined\` when empty.
- \`get size(): number\` and \`get capacity(): number\`.
- \`toArray(): T[]\`: returns current elements ordered from oldest (front) to newest (back).

> Note: Declare class fields explicitly instead of TypeScript constructor parameter properties (\`private x\`).`,
          tags: ['Generics', 'Circular Buffer', 'Queue', 'Classes'],
          hints: [
            'Maintain `buffer: (T | undefined)[]`, `head = 0`, `tail = 0`, and `count = 0`.',
            'Advance indices modulo capacity: `this.tail = (this.tail + 1) % this.cap` and `this.head = (this.head + 1) % this.cap`.',
          ],
          entryFunction: 'BoundedQueue',
          astRules: { requireGenerics: true, requireClass: true },
          starterCode: `export class BoundedQueue<T> {
  private readonly cap: number;

  constructor(capacity: number) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new RangeError('Capacity must be a positive integer');
    }
    this.cap = capacity;
  }

  get size(): number {
    return 0;
  }

  get capacity(): number {
    return this.cap;
  }

  enqueue(item: T): boolean {
    void item;
    return false;
  }

  dequeue(): T | undefined {
    return undefined;
  }

  peek(): T | undefined {
    return undefined;
  }

  toArray(): T[] {
    return [];
  }
}
`,
          referenceSolution: `export class BoundedQueue<T> {
  private readonly buffer: (T | undefined)[];
  private readonly cap: number;
  private head = 0;
  private tail = 0;
  private count = 0;

  constructor(capacity: number) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new RangeError('Capacity must be a positive integer');
    }
    this.cap = capacity;
    this.buffer = new Array<T | undefined>(capacity);
  }

  get size(): number {
    return this.count;
  }

  get capacity(): number {
    return this.cap;
  }

  enqueue(item: T): boolean {
    if (this.count === this.cap) return false;
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.cap;
    this.count++;
    return true;
  }

  dequeue(): T | undefined {
    if (this.count === 0) return undefined;
    const val = this.buffer[this.head];
    this.buffer[this.head] = undefined;
    this.head = (this.head + 1) % this.cap;
    this.count--;
    return val;
  }

  peek(): T | undefined {
    if (this.count === 0) return undefined;
    return this.buffer[this.head];
  }

  toArray(): T[] {
    const out: T[] = [];
    for (let i = 0; i < this.count; i++) {
      out.push(this.buffer[(this.head + i) % this.cap] as T);
    }
    return out;
  }
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Enforces capacity limit and FIFO order',
              harnessCode: `
                const q = new exports.BoundedQueue(3);
                const r1 = [q.enqueue('a'), q.enqueue('b'), q.enqueue('c'), q.enqueue('d')];
                return { r1, peek: q.peek(), size: q.size, arr: q.toArray() };
              `,
              expected: {
                r1: [true, true, true, false],
                peek: 'a',
                size: 3,
                arr: ['a', 'b', 'c'],
              },
            },
            {
              id: 'tc-2',
              name: 'Wraps head and tail cleanly across multiple cycles',
              harnessCode: `
                const q = new exports.BoundedQueue(3);
                q.enqueue(1);
                q.enqueue(2);
                q.enqueue(3);
                const d1 = q.dequeue();
                const d2 = q.dequeue();
                q.enqueue(4);
                q.enqueue(5);
                return { d1, d2, arr: q.toArray(), size: q.size, capacity: q.capacity };
              `,
              expected: {
                d1: 1,
                d2: 2,
                arr: [3, 4, 5],
                size: 3,
                capacity: 3,
              },
            },
            {
              id: 'tc-3',
              name: 'Empty dequeue and peek return undefined',
              harnessCode: `
                const q = new exports.BoundedQueue(2);
                q.enqueue(10);
                const first = q.dequeue();
                const second = q.dequeue();
                return { first, second, peek: q.peek(), size: q.size };
              `,
              expected: { first: 10, second: undefined, peek: undefined, size: 0 },
            },
            {
              id: 'tc-4',
              name: 'Throws RangeError for non-positive or non-integer capacity',
              harnessCode: `
                const errs = [];
                for (const bad of [0, -2, 1.5]) {
                  try {
                    new exports.BoundedQueue(bad);
                    errs.push('none');
                  } catch (e) {
                    errs.push(e instanceof RangeError ? 'RangeError' : 'Other');
                  }
                }
                return errs;
              `,
              expected: ['RangeError', 'RangeError', 'RangeError'],
            },
            {
              id: 'tc-5',
              name: 'Hidden: Supports falsy values like 0, false, and "" accurately',
              hidden: true,
              harnessCode: `
                const q = new exports.BoundedQueue(3);
                q.enqueue(0);
                q.enqueue(false);
                q.enqueue('');
                return [q.dequeue(), q.dequeue(), q.dequeue(), q.dequeue()];
              `,
              expected: [0, false, '', undefined],
            },
            {
              id: 'tc-6',
              name: 'Hidden: Capacity 1 queue alternates enqueue/dequeue 5 times',
              hidden: true,
              harnessCode: `
                const q = new exports.BoundedQueue(1);
                const log = [];
                for (let i = 1; i <= 5; i++) {
                  log.push([q.enqueue(i), q.enqueue(999), q.dequeue()]);
                }
                return log;
              `,
              expected: [
                [true, false, 1],
                [true, false, 2],
                [true, false, 3],
                [true, false, 4],
                [true, false, 5],
              ],
            },
          ],
        },
        {
          id: 's4-p4-c4',
          title: 'Monotonic Deque: Sliding Window Maximum',
          style: 'leetcode',
          difficulty: 'hard',
          description: `Implement \`slidingWindowMax(nums: readonly number[], k: number): number[]\` in **O(N)** time.

### Rules
- If \`nums.length === 0\`, \`k <= 0\`, or \`k > nums.length\`, return \`[]\`.
- Otherwise return an array of length \`nums.length - k + 1\` where element \`i\` is \`Math.max(...nums.slice(i, i + k))\`, computed in linear time using a monotonic index deque.`,
          tags: ['Deque', 'Sliding Window', 'O(N)'],
          hints: [
            'Store candidate indices in `deque: number[]` with a `head = 0` pointer so front eviction (`head++`) is O(1).',
            'Before pushing `i`: (1) advance `head` if `deque[head] <= i - k`, and (2) pop from the back while `nums[deque[deque.length - 1]] <= nums[i]`.',
          ],
          entryFunction: 'slidingWindowMax',
          starterCode: `export function slidingWindowMax(
  nums: readonly number[],
  k: number
): number[] {
  // TODO: Compute sliding window maximums in O(N) using a monotonic deque
  void nums;
  void k;
  return [];
}
`,
          referenceSolution: `export function slidingWindowMax(
  nums: readonly number[],
  k: number
): number[] {
  if (nums.length === 0 || k <= 0 || k > nums.length) {
    return [];
  }

  const deque: number[] = [];
  let head = 0;
  const out: number[] = [];

  for (let i = 0; i < nums.length; i++) {
    while (head < deque.length && deque[head] <= i - k) {
      head++;
    }
    while (head < deque.length && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    deque.push(i);
    if (i >= k - 1) {
      out.push(nums[deque[head]]);
    }
  }

  return out;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Classic window k = 3 across positive and negative values',
              checkImmutability: true,
              args: [[1, 3, -1, -3, 5, 3, 6, 7], 3],
              expected: [3, 3, 5, 5, 6, 7],
            },
            {
              id: 'tc-2',
              name: 'Strictly decreasing sequence evicts expired front indices',
              checkImmutability: true,
              args: [[9, 8, 7, 6, 5], 2],
              expected: [9, 8, 7, 6],
            },
            {
              id: 'tc-3',
              name: 'Window size k = 1 returns copy of nums',
              checkImmutability: true,
              args: [[4, -2, 7], 1],
              expected: [4, -2, 7],
            },
            {
              id: 'tc-4',
              name: 'Window size k > nums.length returns empty array',
              checkImmutability: true,
              args: [[1, 2], 5],
              expected: [],
            },
            {
              id: 'tc-5',
              name: 'Hidden: Window size equal to array length returns single maximum',
              hidden: true,
              checkImmutability: true,
              args: [[-8, -3, -12, -4], 4],
              expected: [-3],
            },
            {
              id: 'tc-6',
              name: 'Hidden: Duplicate maximum values survive when earlier duplicate expires',
              hidden: true,
              checkImmutability: true,
              args: [[5, 1, 5, 1, 2], 3],
              expected: [5, 5, 5],
            },
          ],
        },
      ],
    },
    {
      id: 's4-p5',
      number: 5,
      title: 'Trees, Graphs & Traversals',
      subtitle: 'Generic tree BFS, deterministic Kahn topological sort, shortest paths, and recursive types',
      conceptSummary: `Hierarchical and network problems map cleanly onto typed trees and adjacency lists:

- **Generic tree nodes:** \`interface TreeNode<T> { value: T; left?: TreeNode<T> | null; right?: TreeNode<T> | null }\` supports breadth-first level grouping for any payload \`T\`.
- **Topological ordering (Kahn's algorithm):** Tracking in-degrees and repeatedly peeling 0-in-degree nodes produces a valid dependency build order—and automatically isolates cycle members when \`order.length < nodeCount\`!
- **Unweighted shortest path (BFS):** Exploring sorted adjacency lists level-by-level with a \`parent\` map reconstructs the lexicographically smallest minimum-hop route.`,
      challenges: [
        {
          id: 's4-p5-c1',
          title: 'Generic Binary Tree Level-Order Traversal',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Define \`TreeNode<T>\` and implement \`levelOrderValues<T>(root: TreeNode<T> | null): T[][]\` returning node values grouped depth-by-depth from left to right (\`[]\` when \`root === null\`).`,
          tags: ['Binary Trees', 'BFS', 'Generics'],
          hints: [
            'Process one entire frontier array `currentLevel: TreeNode<T>[]` per iteration, building `values: T[]` and `nextLevel: TreeNode<T>[]`.',
            'Treat both `undefined` and `null` children as absent.',
          ],
          entryFunction: 'levelOrderValues',
          astRules: { requireGenerics: true, requireInterfaceOrType: true },
          starterCode: `export interface TreeNode<T> {
  readonly value: T;
  readonly left?: TreeNode<T> | null;
  readonly right?: TreeNode<T> | null;
}

export function levelOrderValues<T>(root: TreeNode<T> | null): T[][] {
  // TODO: Traverse binary tree level-by-level from left to right
  void root;
  return [];
}
`,
          referenceSolution: `export interface TreeNode<T> {
  readonly value: T;
  readonly left?: TreeNode<T> | null;
  readonly right?: TreeNode<T> | null;
}

export function levelOrderValues<T>(root: TreeNode<T> | null): T[][] {
  if (root === null) return [];
  const levels: T[][] = [];
  let frontier: TreeNode<T>[] = [root];

  while (frontier.length > 0) {
    const levelVals: T[] = [];
    const nextFrontier: TreeNode<T>[] = [];
    for (const node of frontier) {
      levelVals.push(node.value);
      if (node.left) nextFrontier.push(node.left);
      if (node.right) nextFrontier.push(node.right);
    }
    levels.push(levelVals);
    frontier = nextFrontier;
  }

  return levels;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Groups balanced and sparse binary tree levels',
              args: [
                {
                  value: 3,
                  left: { value: 9 },
                  right: {
                    value: 20,
                    left: { value: 15 },
                    right: { value: 7 },
                  },
                },
              ],
              expected: [[3], [9, 20], [15, 7]],
            },
            {
              id: 'tc-2',
              name: 'Null root returns empty array',
              args: [null],
              expected: [],
            },
            {
              id: 'tc-3',
              name: 'Works polymorphically on string values',
              args: [
                {
                  value: 'root',
                  left: { value: 'L1', left: { value: 'L2' } },
                  right: null,
                },
              ],
              expected: [['root'], ['L1'], ['L2']],
            },
            {
              id: 'tc-4',
              name: 'Hidden: Single node tree returns [[value]]',
              hidden: true,
              args: [{ value: 42 }],
              expected: [[42]],
            },
            {
              id: 'tc-5',
              name: 'Hidden: Preserves falsy node values like 0 and ""',
              hidden: true,
              args: [
                {
                  value: 0,
                  left: { value: 0 },
                  right: { value: -1 },
                },
              ],
              expected: [[0], [0, -1]],
            },
          ],
        },
        {
          id: 's4-p5-c2',
          title: 'Topological Build Order with Cycle Detection',
          style: 'leetcode',
          difficulty: 'hard',
          description: `Implement \`resolveBuildOrder(packages, dependencies)\` to compute a deterministic package build plan.

### Graph Rules
- \`packages\`: list of package names.
- \`dependencies\`: array of pairs \`[pkg, dep]\` meaning \`dep\` **must be built before** \`pkg\` (directed edge \`dep -> pkg\`).
- Include any package name appearing in \`dependencies\` even if omitted from \`packages\`, and deduplicate duplicate edges (note: self-dependency \`[x, x]\` is an immediate cycle!).
- **Deterministic tie-breaking:** Whenever multiple packages have 0 remaining unmet dependencies, emit the **lexicographically smallest** (\`a < b\`) package next.
- **Return value:**
  - Acyclic: \`{ ok: true, order: string[] }\`
  - Cyclic: \`{ ok: false, cycleNodes: string[] }\` containing all nodes that could **not** be scheduled in \`order\`, sorted lexicographically.`,
          tags: ['Graphs', 'Topological Sort', 'Cycle Detection'],
          hints: [
            'Build `adj = new Map<string, Set<string>>()` (`dep -> Set<pkg>`) and `inDegree = new Map<string, number>()` so duplicate `[pkg, dep]` pairs only increment `inDegree` once.',
            'Keep `ready: string[]` sorted ascending whenever 0-in-degree nodes are added, popping from index 0 (or sort descending and `.pop()`).',
          ],
          entryFunction: 'resolveBuildOrder',
          astRules: { requireInterfaceOrType: true },
          starterCode: `export type BuildPlanResult =
  | { readonly ok: true; readonly order: string[] }
  | { readonly ok: false; readonly cycleNodes: string[] };

export function resolveBuildOrder(
  packages: readonly string[],
  dependencies: readonly (readonly [string, string])[]
): BuildPlanResult {
  // TODO: Run deterministic Kahn's algorithm and detect cycles
  void packages;
  void dependencies;
  return { ok: true, order: [] };
}
`,
          referenceSolution: `export type BuildPlanResult =
  | { readonly ok: true; readonly order: string[] }
  | { readonly ok: false; readonly cycleNodes: string[] };

export function resolveBuildOrder(
  packages: readonly string[],
  dependencies: readonly (readonly [string, string])[]
): BuildPlanResult {
  const adj = new Map<string, Set<string>>();
  const inDegree = new Map<string, number>();

  const ensureNode = (name: string) => {
    if (!adj.has(name)) adj.set(name, new Set());
    if (!inDegree.has(name)) inDegree.set(name, 0);
  };

  for (const pkg of packages) {
    ensureNode(pkg);
  }

  for (const [pkg, dep] of dependencies) {
    ensureNode(pkg);
    ensureNode(dep);
    const neighbors = adj.get(dep)!;
    if (!neighbors.has(pkg)) {
      neighbors.add(pkg);
      inDegree.set(pkg, (inDegree.get(pkg) ?? 0) + 1);
    }
  }

  const ready: string[] = [];
  for (const [node, deg] of inDegree.entries()) {
    if (deg === 0) ready.push(node);
  }
  ready.sort((a, b) => (b < a ? -1 : b > a ? 1 : 0)); // descending so pop() yields smallest

  const order: string[] = [];
  while (ready.length > 0) {
    const current = ready.pop()!;
    order.push(current);

    for (const next of adj.get(current)!) {
      const nextDeg = (inDegree.get(next) ?? 0) - 1;
      inDegree.set(next, nextDeg);
      if (nextDeg === 0) {
        ready.push(next);
        ready.sort((a, b) => (b < a ? -1 : b > a ? 1 : 0));
      }
    }
  }

  if (order.length < inDegree.size) {
    const scheduled = new Set(order);
    const cycleNodes = [...inDegree.keys()]
      .filter((n) => !scheduled.has(n))
      .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    return { ok: false, cycleNodes };
  }

  return { ok: true, order };
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Resolves diamond dependency graph with lexicographical tie-breaking',
              args: [
                ['app', 'ui', 'api', 'core'],
                [
                  ['app', 'ui'],
                  ['app', 'api'],
                  ['ui', 'core'],
                  ['api', 'core'],
                ],
              ],
              expected: { ok: true, order: ['core', 'api', 'ui', 'app'] },
            },
            {
              id: 'tc-2',
              name: 'Detects cycle and isolates unscheduled downstream & cycle nodes',
              args: [
                ['core', 'auth', 'billing', 'portal'],
                [
                  ['auth', 'core'],
                  ['auth', 'billing'],
                  ['billing', 'auth'],
                  ['portal', 'billing'],
                ],
              ],
              expected: { ok: false, cycleNodes: ['auth', 'billing', 'portal'] },
            },
            {
              id: 'tc-3',
              name: 'Deduplicates repeated dependency edges and includes implicit nodes',
              args: [
                ['web'],
                [
                  ['web', 'sdk'],
                  ['web', 'sdk'],
                ],
              ],
              expected: { ok: true, order: ['sdk', 'web'] },
            },
            {
              id: 'tc-4',
              name: 'Independent packages sort alphabetically',
              args: [['zeta', 'alpha', 'mu'], []],
              expected: { ok: true, order: ['alpha', 'mu', 'zeta'] },
            },
            {
              id: 'tc-5',
              name: 'Hidden: Self-dependency [x, x] is flagged as cycle',
              hidden: true,
              args: [['ok', 'self'], [['self', 'self']]],
              expected: { ok: false, cycleNodes: ['self'] },
            },
            {
              id: 'tc-6',
              name: 'Hidden: Empty graph returns empty order',
              hidden: true,
              args: [[], []],
              expected: { ok: true, order: [] },
            },
          ],
        },
        {
          id: 's4-p5-c3',
          title: 'Service Mesh Shortest Hop Route (BFS)',
          style: 'beecrowd',
          difficulty: 'medium',
          description: `Find the minimum-hop route between two services in an undirected service mesh.

### Input Format
- First line: \`N M\` (\`N\` services, \`M\` undirected links).
- Next \`M\` lines: \`<u> <v>\` (bidirectional link between \`u\` and \`v\`).
- Last line: \`<source> <target>\`.

### Tie-Breaking & Output Format
Sort each node's neighbor list lexicographically (\`a < b\`) before running BFS from \`<source>\`, so the first time \`<target>\` is reached yields the lexicographically smallest shortest path!
- If \`<source> === <target>\`:
  \`\`\`
  HOPS: 0
  PATH: <source>
  \`\`\`
- If reachable in \`k\` hops:
  \`\`\`
  HOPS: <k>
  PATH: <n0> -> <n1> -> ... -> <nk>
  \`\`\`
- If unreachable:
  \`\`\`
  UNREACHABLE
  \`\`\``,
          tags: ['BFS', 'Graphs', 'Shortest Path'],
          hints: [
            'Check `source === target` up front (even if `M === 0` and neither node appeared in an edge!).',
            'Sort every adjacency list ascending once before BFS, mark neighbors `visited` at enqueue time, and store `parent.set(next, curr)` to reconstruct the path.',
          ],
          entryFunction: 'solve',
          playgroundInput: `5 6
gateway auth
gateway cache
auth db
cache db
db analytics
cache analytics
gateway analytics`,
          starterCode: `export function solve(input: string): string {
  // TODO: Run BFS over sorted adjacency lists and reconstruct shortest path
  void input;
  return '';
}
`,
          referenceSolution: `export function solve(input: string): string {
  const lines = input
    .split(/\\r?\\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) return 'UNREACHABLE';

  const [, mStr] = lines[0].split(/\\s+/);
  const m = Number(mStr);
  const adj = new Map<string, Set<string>>();

  const addEdge = (u: string, v: string) => {
    if (!adj.has(u)) adj.set(u, new Set());
    if (!adj.has(v)) adj.set(v, new Set());
    if (u !== v) {
      adj.get(u)!.add(v);
      adj.get(v)!.add(u);
    }
  };

  for (let i = 1; i <= m && i < lines.length - 1; i++) {
    const [u, v] = lines[i].split(/\\s+/);
    if (u && v) addEdge(u, v);
  }

  const [source, target] = lines[lines.length - 1].split(/\\s+/);
  if (!source || !target) return 'UNREACHABLE';
  if (source === target) {
    return \`HOPS: 0\\nPATH: \${source}\`;
  }

  if (!adj.has(source) || !adj.has(target)) {
    return 'UNREACHABLE';
  }

  const sortedAdj = new Map<string, string[]>();
  for (const [node, set] of adj.entries()) {
    sortedAdj.set(
      node,
      [...set].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
    );
  }

  const visited = new Set<string>([source]);
  const parent = new Map<string, string>();
  const queue: string[] = [source];
  let head = 0;

  while (head < queue.length) {
    const curr = queue[head++];
    if (curr === target) break;

    for (const next of sortedAdj.get(curr) ?? []) {
      if (!visited.has(next)) {
        visited.add(next);
        parent.set(next, curr);
        queue.push(next);
      }
    }
  }

  if (!visited.has(target)) {
    return 'UNREACHABLE';
  }

  const path: string[] = [];
  let step: string | undefined = target;
  while (step !== undefined) {
    path.push(step);
    step = parent.get(step);
  }
  path.reverse();

  return \`HOPS: \${path.length - 1}\\nPATH: \${path.join(' -> ')}\`;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Finds 2-hop shortest path over sorted neighbors',
              args: [
                `5 6
gateway auth
gateway cache
auth db
cache db
db analytics
cache analytics
gateway analytics`,
              ],
              expected: `HOPS: 2\nPATH: gateway -> cache -> analytics`,
            },
            {
              id: 'tc-2',
              name: 'Tie-breaks equal-hop routes lexicographically (auth before cache)',
              args: [
                `4 4
gateway cache
gateway auth
cache db
auth db
gateway db`,
              ],
              expected: `HOPS: 2\nPATH: gateway -> auth -> db`,
            },
            {
              id: 'tc-3',
              name: 'Disconnected components output UNREACHABLE',
              args: [
                `4 2
a b
c d
a d`,
              ],
              expected: `UNREACHABLE`,
            },
            {
              id: 'tc-4',
              name: 'Hidden: Identical source and target yields 0 hops even with 0 edges',
              hidden: true,
              args: [
                `1 0
edge-node edge-node`,
              ],
              expected: `HOPS: 0\nPATH: edge-node`,
            },
            {
              id: 'tc-5',
              name: 'Hidden: Direct 1-hop neighbor',
              hidden: true,
              args: [
                `3 2
web api
api db
db api`,
              ],
              expected: `HOPS: 1\nPATH: db -> api`,
            },
          ],
        },
        {
          id: 's4-p5-c4',
          title: 'Recursive DeepReadonly & DotPaths',
          style: 'type-challenge',
          difficulty: 'hard',
          description: `Implement two recursive type-level utilities:

1. \`DeepReadonly<T>\`: Recursively marks all object properties, arrays, and tuples as \`readonly\`, while leaving function types (\`Function\`) untouched as-is.
2. \`DotPaths<T>\`: For a nested plain object \`T\`, produces the union of all valid dot-delimited string paths (both intermediate object keys and leaf keys). Treat arrays/tuples and functions as leaf values (do **not** recurse into array indices or function properties).`,
          tags: ['Recursive Types', 'Template Literal Types', 'DeepReadonly'],
          hints: [
            'In `DeepReadonly<T>`, check `T extends Function ? T : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T`.',
            'In `DotPaths<T>`, iterate `[K in Extract<keyof T, string>]`: if `T[K]` is `readonly unknown[]` or `Function`, emit `K`; else if `T[K] extends object`, emit `K | \`\${K}.\${DotPaths<T[K]>}\``; else emit `K`.',
          ],
          starterCode: `export type DeepReadonly<T> = T;

export type DotPaths<T> = keyof T;
`,
          referenceSolution: `export type DeepReadonly<T> = T extends Function
  ? T
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

export type DotPaths<T> = T extends object
  ? {
      [K in Extract<keyof T, string>]-?: NonNullable<T[K]> extends readonly unknown[] | Function
        ? K
        : NonNullable<T[K]> extends object
          ? K | \`\${K}.\${DotPaths<NonNullable<T[K]>>}\`
          : K;
    }[Extract<keyof T, string>]
  : never;
`,
          typeAssertionPrelude: `import type { DeepReadonly, DotPaths } from './solution';

interface AppConfig {
  server: {
    host: string;
    tls: {
      certPath: string;
    };
  };
  tags: string[];
  onBoot: (port: number) => void;
}`,
          typeAssertions: [
            {
              id: 'ta-1',
              name: 'DeepReadonly marks nested objects, arrays, and tuples readonly while keeping functions callable',
              assertion: `Expect<Equal<DeepReadonly<{ a: { b: number }; list: [string, { ok: boolean }]; fn: (x: number) => string }>, {
                readonly a: { readonly b: number };
                readonly list: readonly [string, { readonly ok: boolean }];
                readonly fn: (x: number) => string;
              }>>`,
            },
            {
              id: 'ta-2',
              name: 'DotPaths generates intermediate and leaf dot-separated paths',
              assertion: `Expect<Equal<DotPaths<AppConfig>, 'server' | 'server.host' | 'server.tls' | 'server.tls.certPath' | 'tags' | 'onBoot'>>`,
            },
            {
              id: 'ta-3',
              name: 'DotPaths on flat object matches string keys',
              assertion: `Expect<Equal<DotPaths<{ id: string; count: number }>, 'id' | 'count'>>`,
            },
            {
              id: 'ta-4',
              name: 'DeepReadonly on primitive leaves primitive unchanged',
              assertion: `Expect<Equal<DeepReadonly<string | number>, string | number>>`,
            },
            {
              id: 'ta-5',
              name: 'Hidden: DotPaths handles optional nested objects cleanly',
              hidden: true,
              assertion: `Expect<Equal<DotPaths<{ db?: { url: string } }>, 'db' | 'db.url'>>`,
            },
            {
              id: 'ta-6',
              name: 'Hidden: DotPaths on empty object yields never',
              hidden: true,
              assertion: `Expect<Equal<DotPaths<{}>, never>>`,
            },
          ],
          testCases: [],
        },
      ],
    },
  ],
  miniProject: {
    id: 's4-mp',
    title: 'Typed LRU Cache & Collection Query Engine',
    subtitle: '4-file O(1) generic LRU cache paired with a key-safe in-memory query engine',
    difficulty: 'hard',
    description: `Build a generic **O(1) \`LRUCache<K, V>\`** and an in-memory **\`CollectionQueryEngine<T>\`** that caches query results and invalidates cached entries on writes.

### Module Specifications
1. **\`LRUCache<K, V>\` (\`lruCache.ts\`)**:
   - \`constructor(capacity: number)\`: throws \`RangeError\` if \`!Number.isInteger(capacity) || capacity <= 0\`.
   - \`get(key: K): V | undefined\`: on miss, increments \`misses\` and returns \`undefined\`. On hit, promotes \`key\` to most-recently-used (MRU), increments \`hits\`, and returns the value.
   - \`set(key: K, value: V): void\`: if \`key\` already exists, updates its value and promotes it to MRU (no eviction). If \`key\` is new and \`size === capacity\`, evicts the **least-recently-used** (LRU) entry and increments \`evictions\` before inserting.
   - \`has(key: K): boolean\`: non-mutating check (does **not** promote or affect \`hits\`/\`misses\`).
   - \`delete(key: K): boolean\`: removes \`key\` if present.
   - \`clear(): void\`: removes all cached entries while **preserving** cumulative \`hits\`, \`misses\`, and \`evictions\` counters!
   - \`keys(): K[]\`: returns current keys ordered from **LRU (oldest)** to **MRU (newest)**.
   - \`stats(): CacheStats\`: returns \`{ hits, misses, evictions, size, capacity }\`.

2. **\`CollectionQueryEngine<T>\` (\`queryEngine.ts\`)**:
   - \`constructor(initialItems?: readonly T[], cacheCapacity?: number)\` (defaults: \`[]\`, \`16\`). Clones initial items so external mutations cannot corrupt internal state.
   - \`insert(item: T): void\`: appends a shallow copy \`{ ...item }\` and calls \`cache.clear()\` to invalidate cached query results.
   - \`removeWhere(predicate: (item: T) => boolean): number\`: removes matching records, returning the removed count; calls \`cache.clear()\` **only** if at least 1 record was removed.
   - \`query(spec?: QuerySpec<T>): T[]\`:
     - Builds a canonical cache key string from \`spec\` (so \`where\` field/operator key order does not cause false cache misses!).
     - On cache hit, returns shallow-cloned copies of the cached rows.
     - On cache miss, filters rows matching all \`where\` operators (\`eq\`, \`neq\`, \`gt\`, \`gte\`, \`lt\`, \`lte\`, \`in\`), stably sorts if \`orderBy\` is provided (\`dir\` defaults to \`'asc'\`), slices \`offset\` (default \`0\`) and \`limit\` (if defined), caches a cloned snapshot, and returns shallow-cloned copies.
   - \`count(): number\` and \`getCacheStats(): CacheStats\`.`,
    architectureNotes: `- **\`types.ts\`**: Read-only generic query DSL (\`FilterOperator<V>\`, \`WhereClause<T>\`, \`QuerySpec<T>\`, \`CacheStats\`).
- **\`lruCache.ts\`**: Generic \`LRUCache<K, V>\` leveraging \`Map\` insertion-order guarantees for O(1) promotion and LRU eviction.
- **\`queryEngine.ts\`**: Generic \`CollectionQueryEngine<T>\` implementing predicate evaluation, canonical cache keys, stable sorting, pagination, and write invalidation.
- **\`index.ts\`**: Public barrel module exporting \`LRUCache\`, \`CollectionQueryEngine\`, and all query types.`,
    tags: ['Generics', 'LRU Cache', 'Query Engine', 'Map Ordering'],
    hints: [
      'In JavaScript `Map`, `this.map.keys().next().value` is always the oldest (LRU) key in O(1) time; deleting and re-setting a key moves it to the newest (MRU) position in O(1)!',
      'To build a canonical cache key for `QuerySpec<T>`, recursively sort object keys before `JSON.stringify` so `{ a: 1, b: 2 }` and `{ b: 2, a: 1 }` hash identically.',
      'Avoid TypeScript constructor parameter properties (`constructor(private x: number)`)—declare fields explicitly on the class.',
    ],
    entryFile: 'index.ts',
    astRules: {
      requireGenerics: true,
      requireClass: true,
      requireInterfaceOrType: true,
    },
    files: [
      {
        path: 'types.ts',
        description: 'Key-safe filter operators, query specification, and cache telemetry contracts',
        readOnly: true,
        starterCode: `export type PrimitiveField = string | number | boolean;

export type SortDirection = 'asc' | 'desc';

export interface FilterOperator<V> {
  readonly eq?: V;
  readonly neq?: V;
  readonly gt?: V;
  readonly gte?: V;
  readonly lt?: V;
  readonly lte?: V;
  readonly in?: readonly V[];
}

export type WhereClause<T> = {
  readonly [K in keyof T]?: FilterOperator<T[K]>;
};

export interface OrderBySpec<T> {
  readonly key: keyof T & string;
  readonly dir?: SortDirection;
}

export interface QuerySpec<T> {
  readonly where?: WhereClause<T>;
  readonly orderBy?: OrderBySpec<T>;
  readonly offset?: number;
  readonly limit?: number;
}

export interface CacheStats {
  readonly hits: number;
  readonly misses: number;
  readonly evictions: number;
  readonly size: number;
  readonly capacity: number;
}
`,
        referenceSolution: `export type PrimitiveField = string | number | boolean;

export type SortDirection = 'asc' | 'desc';

export interface FilterOperator<V> {
  readonly eq?: V;
  readonly neq?: V;
  readonly gt?: V;
  readonly gte?: V;
  readonly lt?: V;
  readonly lte?: V;
  readonly in?: readonly V[];
}

export type WhereClause<T> = {
  readonly [K in keyof T]?: FilterOperator<T[K]>;
};

export interface OrderBySpec<T> {
  readonly key: keyof T & string;
  readonly dir?: SortDirection;
}

export interface QuerySpec<T> {
  readonly where?: WhereClause<T>;
  readonly orderBy?: OrderBySpec<T>;
  readonly offset?: number;
  readonly limit?: number;
}

export interface CacheStats {
  readonly hits: number;
  readonly misses: number;
  readonly evictions: number;
  readonly size: number;
  readonly capacity: number;
}
`,
      },
      {
        path: 'lruCache.ts',
        description: 'Generic O(1) LRU cache backed by Map insertion order',
        starterCode: `import type { CacheStats } from './types';

export class LRUCache<K, V> {
  private readonly maxSize: number;
  private readonly store = new Map<K, V>();
  private hitCount = 0;
  private missCount = 0;
  private evictionCount = 0;

  constructor(capacity: number) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new RangeError('LRUCache capacity must be a positive integer');
    }
    this.maxSize = capacity;
  }

  get(key: K): V | undefined {
    // TODO: Track hits/misses and promote key to MRU on hit
    void key;
    return undefined;
  }

  set(key: K, value: V): void {
    // TODO: Insert/update key as MRU and evict oldest entry when over capacity
    void key;
    void value;
  }

  has(key: K): boolean {
    return this.store.has(key);
  }

  delete(key: K): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  keys(): K[] {
    return [...this.store.keys()];
  }

  stats(): CacheStats {
    return {
      hits: this.hitCount,
      misses: this.missCount,
      evictions: this.evictionCount,
      size: this.store.size,
      capacity: this.maxSize,
    };
  }
}
`,
        referenceSolution: `import type { CacheStats } from './types';

export class LRUCache<K, V> {
  private readonly maxSize: number;
  private readonly store = new Map<K, V>();
  private hitCount = 0;
  private missCount = 0;
  private evictionCount = 0;

  constructor(capacity: number) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new RangeError('LRUCache capacity must be a positive integer');
    }
    this.maxSize = capacity;
  }

  get(key: K): V | undefined {
    if (!this.store.has(key)) {
      this.missCount++;
      return undefined;
    }
    const val = this.store.get(key) as V;
    this.store.delete(key);
    this.store.set(key, val);
    this.hitCount++;
    return val;
  }

  set(key: K, value: V): void {
    if (this.store.has(key)) {
      this.store.delete(key);
      this.store.set(key, value);
      return;
    }

    if (this.store.size >= this.maxSize) {
      const oldest = this.store.keys().next();
      if (!oldest.done) {
        this.store.delete(oldest.value);
        this.evictionCount++;
      }
    }

    this.store.set(key, value);
  }

  has(key: K): boolean {
    return this.store.has(key);
  }

  delete(key: K): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  keys(): K[] {
    return [...this.store.keys()];
  }

  stats(): CacheStats {
    return {
      hits: this.hitCount,
      misses: this.missCount,
      evictions: this.evictionCount,
      size: this.store.size,
      capacity: this.maxSize,
    };
  }
}
`,
      },
      {
        path: 'queryEngine.ts',
        description: 'Key-safe in-memory collection query engine with cached execution',
        starterCode: `import { LRUCache } from './lruCache';
import type { CacheStats, PrimitiveField, QuerySpec } from './types';

export class CollectionQueryEngine<T extends Record<string, PrimitiveField>> {
  private rows: T[];
  private readonly cache: LRUCache<string, T[]>;

  constructor(initialItems: readonly T[] = [], cacheCapacity = 16) {
    this.rows = initialItems.map((item) => ({ ...item }));
    this.cache = new LRUCache<string, T[]>(cacheCapacity);
  }

  insert(item: T): void {
    // TODO: Clone item, append to rows, and invalidate cache
    void item;
  }

  removeWhere(predicate: (item: T) => boolean): number {
    // TODO: Remove matching rows, invalidate cache if > 0 removed, and return removed count
    void predicate;
    return 0;
  }

  query(spec: QuerySpec<T> = {}): T[] {
    // TODO: Check canonical cache key, otherwise filter, sort, paginate, cache, and return cloned rows
    void spec;
    return [];
  }

  count(): number {
    return this.rows.length;
  }

  getCacheStats(): CacheStats {
    return this.cache.stats();
  }
}
`,
        referenceSolution: `import { LRUCache } from './lruCache';
import type {
  CacheStats,
  FilterOperator,
  PrimitiveField,
  QuerySpec,
  WhereClause,
} from './types';

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (typeof value === 'object' && value !== null) {
    const rec = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(rec).sort()) {
      if (rec[key] !== undefined) {
        sorted[key] = canonicalize(rec[key]);
      }
    }
    return sorted;
  }
  return value;
}

function matchesOperator<V extends PrimitiveField>(
  actual: V,
  op: FilterOperator<V>
): boolean {
  if (op.eq !== undefined && actual !== op.eq) return false;
  if (op.neq !== undefined && actual === op.neq) return false;
  if (op.gt !== undefined && !(actual > op.gt)) return false;
  if (op.gte !== undefined && !(actual >= op.gte)) return false;
  if (op.lt !== undefined && !(actual < op.lt)) return false;
  if (op.lte !== undefined && !(actual <= op.lte)) return false;
  if (op.in !== undefined && !op.in.includes(actual)) return false;
  return true;
}

function matchesWhere<T extends Record<string, PrimitiveField>>(
  row: T,
  where: WhereClause<T> | undefined
): boolean {
  if (!where) return true;
  for (const key of Object.keys(where) as (keyof T & string)[]) {
    const op = where[key];
    if (op !== undefined && !matchesOperator(row[key], op)) {
      return false;
    }
  }
  return true;
}

export class CollectionQueryEngine<T extends Record<string, PrimitiveField>> {
  private rows: T[];
  private readonly cache: LRUCache<string, T[]>;

  constructor(initialItems: readonly T[] = [], cacheCapacity = 16) {
    this.rows = initialItems.map((item) => ({ ...item }));
    this.cache = new LRUCache<string, T[]>(cacheCapacity);
  }

  insert(item: T): void {
    this.rows.push({ ...item });
    this.cache.clear();
  }

  removeWhere(predicate: (item: T) => boolean): number {
    const kept: T[] = [];
    let removed = 0;
    for (const row of this.rows) {
      if (predicate(row)) {
        removed++;
      } else {
        kept.push(row);
      }
    }
    if (removed > 0) {
      this.rows = kept;
      this.cache.clear();
    }
    return removed;
  }

  query(spec: QuerySpec<T> = {}): T[] {
    const normalizedSpec: QuerySpec<T> = {
      where: spec.where,
      orderBy: spec.orderBy
        ? { key: spec.orderBy.key, dir: spec.orderBy.dir ?? 'asc' }
        : undefined,
      offset: spec.offset ?? 0,
      limit: spec.limit,
    };
    const cacheKey = JSON.stringify(canonicalize(normalizedSpec));
    const cached = this.cache.get(cacheKey);
    if (cached !== undefined) {
      return cached.map((r) => ({ ...r }));
    }

    let result = this.rows.filter((row) => matchesWhere(row, spec.where));

    if (spec.orderBy) {
      const sortKey = spec.orderBy.key;
      const factor = spec.orderBy.dir === 'desc' ? -1 : 1;
      result = [...result].sort((a, b) => {
        const va = a[sortKey];
        const vb = b[sortKey];
        if (va < vb) return -1 * factor;
        if (va > vb) return 1 * factor;
        return 0;
      });
    }

    const start = Math.max(0, spec.offset ?? 0);
    const end =
      spec.limit !== undefined ? start + Math.max(0, spec.limit) : undefined;
    const sliced = result.slice(start, end);

    const snapshot = sliced.map((r) => ({ ...r }));
    this.cache.set(cacheKey, snapshot);
    return snapshot.map((r) => ({ ...r }));
  }

  count(): number {
    return this.rows.length;
  }

  getCacheStats(): CacheStats {
    return this.cache.stats();
  }
}
`,
      },
      {
        path: 'index.ts',
        description: 'Public entry module re-exporting LRUCache, CollectionQueryEngine, and query contracts',
        starterCode: `export { LRUCache } from './lruCache';
export { CollectionQueryEngine } from './queryEngine';
export type {
  CacheStats,
  FilterOperator,
  OrderBySpec,
  PrimitiveField,
  QuerySpec,
  SortDirection,
  WhereClause,
} from './types';
`,
        referenceSolution: `export { LRUCache } from './lruCache';
export { CollectionQueryEngine } from './queryEngine';
export type {
  CacheStats,
  FilterOperator,
  OrderBySpec,
  PrimitiveField,
  QuerySpec,
  SortDirection,
  WhereClause,
} from './types';
`,
      },
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'LRUCache evicts oldest entry and maintains LRU -> MRU keys() order',
        harnessCode: `
          const cache = new exports.LRUCache(3);
          cache.set('a', 1);
          cache.set('b', 2);
          cache.set('c', 3);
          cache.set('d', 4); // evicts 'a'
          return {
            hasA: cache.has('a'),
            keys: cache.keys(),
            stats: cache.stats(),
          };
        `,
        expected: {
          hasA: false,
          keys: ['b', 'c', 'd'],
          stats: { hits: 0, misses: 0, evictions: 1, size: 3, capacity: 3 },
        },
      },
      {
        id: 'tc-2',
        name: 'LRUCache get() promotes entry to MRU and tracks hits & misses',
        harnessCode: `
          const cache = new exports.LRUCache(2);
          cache.set('x', 10);
          cache.set('y', 20);
          const v1 = cache.get('x'); // 'x' becomes MRU, 'y' is now LRU
          const vMiss = cache.get('missing');
          cache.set('z', 30); // evicts 'y', keeps 'x'
          return {
            v1,
            vMiss,
            keys: cache.keys(),
            stats: cache.stats(),
          };
        `,
        expected: {
          v1: 10,
          vMiss: undefined,
          keys: ['x', 'z'],
          stats: { hits: 1, misses: 1, evictions: 1, size: 2, capacity: 2 },
        },
      },
      {
        id: 'tc-3',
        name: 'CollectionQueryEngine supports multi-field where, orderBy, offset, and limit',
        harnessCode: `
          const engine = new exports.CollectionQueryEngine([
            { id: 'p1', category: 'gpu', price: 900, inStock: true },
            { id: 'p2', category: 'gpu', price: 500, inStock: true },
            { id: 'p3', category: 'cpu', price: 400, inStock: true },
            { id: 'p4', category: 'gpu', price: 1200, inStock: false },
            { id: 'p5', category: 'gpu', price: 700, inStock: true },
          ]);
          return engine.query({
            where: {
              category: { eq: 'gpu' },
              inStock: { eq: true },
              price: { gte: 500, lte: 1000 },
            },
            orderBy: { key: 'price', dir: 'desc' },
            offset: 1,
            limit: 2,
          });
        `,
        expected: [
          { id: 'p5', category: 'gpu', price: 700, inStock: true },
          { id: 'p2', category: 'gpu', price: 500, inStock: true },
        ],
      },
      {
        id: 'tc-4',
        name: 'Canonical cache key hits regardless of where property order and isolates mutations',
        harnessCode: `
          const engine = new exports.CollectionQueryEngine([
            { id: 'u1', role: 'admin', age: 34 },
            { id: 'u2', role: 'user', age: 28 },
          ], 4);
          const first = engine.query({ where: { role: { in: ['admin', 'lead'] }, age: { gt: 20 } } });
          first[0].age = 999; // mutate returned row
          const second = engine.query({ where: { age: { gt: 20 }, role: { in: ['admin', 'lead'] } } });
          return { second, stats: engine.getCacheStats() };
        `,
        expected: {
          second: [{ id: 'u1', role: 'admin', age: 34 }],
          stats: { hits: 1, misses: 1, evictions: 0, size: 1, capacity: 4 },
        },
      },
      {
        id: 'tc-5',
        name: 'Hidden: insert and removeWhere invalidate cached queries while preserving telemetry counters',
        hidden: true,
        harnessCode: `
          const engine = new exports.CollectionQueryEngine([
            { sku: 'A', qty: 5 },
            { sku: 'B', qty: 2 },
          ], 4);
          engine.query({ where: { qty: { gte: 3 } } }); // miss 1
          engine.query({ where: { qty: { gte: 3 } } }); // hit 1
          engine.insert({ sku: 'C', qty: 9 }); // invalidates cache
          const afterInsert = engine.query({ where: { qty: { gte: 3 } }, orderBy: { key: 'sku' } }); // miss 2
          const noOpRemove = engine.removeWhere((r) => r.qty > 100); // 0 removed -> cache NOT cleared!
          const afterNoOp = engine.query({ where: { qty: { gte: 3 } }, orderBy: { key: 'sku' } }); // hit 2!
          const removed = engine.removeWhere((r) => r.sku === 'A'); // 1 removed -> cache cleared
          const finalRows = engine.query({ where: { qty: { gte: 3 } }, orderBy: { key: 'sku' } }); // miss 3
          return {
            afterInsertCount: afterInsert.length,
            noOpRemove,
            afterNoOpCount: afterNoOp.length,
            removed,
            finalSkus: finalRows.map((r) => r.sku),
            stats: engine.getCacheStats(),
          };
        `,
        expected: {
          afterInsertCount: 2,
          noOpRemove: 0,
          afterNoOpCount: 2,
          removed: 1,
          finalSkus: ['C'],
          stats: { hits: 2, misses: 3, evictions: 0, size: 1, capacity: 4 },
        },
      },
      {
        id: 'tc-6',
        name: 'Hidden: Updating existing key in LRUCache promotes without incrementing evictions',
        hidden: true,
        harnessCode: `
          const cache = new exports.LRUCache(2);
          cache.set('k1', 'v1');
          cache.set('k2', 'v2');
          cache.set('k1', 'v1-updated'); // promotes k1, no eviction
          cache.set('k3', 'v3'); // evicts k2
          return {
            k1: cache.get('k1'),
            k2: cache.get('k2'),
            stats: cache.stats(),
          };
        `,
        expected: {
          k1: 'v1-updated',
          k2: undefined,
          stats: { hits: 1, misses: 1, evictions: 1, size: 2, capacity: 2 },
        },
      },
    ],
  },
  exam: {
    id: 's4-exam',
    title: 'Section 4 Cumulative Exam',
    subtitle: 'Comprehensive 5-task exam spanning Sections 1–4: BFS routing, constrained generics, command stacks, stream queues, and advanced types',
    coveredSections: [1, 2, 3, 4],
    passingScore: 1,
    description:
      'Complete all 5 tasks without hints to demonstrate mastery across Sections 1–4: dynamic BFS routing with offline nodes, key-constrained generic pivot aggregations, discriminated undo/redo command stacks, O(N) stream frequency queues, and generic type transformations.',
    tasks: [
      {
        id: 's4-exam-t1',
        title: 'Failover Mesh Router',
        style: 'beecrowd',
        difficulty: 'medium',
        description: `Answer dynamic shortest-hop routing queries over an undirected cluster network as nodes go offline and online.

### Input Format
- First line: \`M Q\` (\`M\` bidirectional links, \`Q\` events/queries).
- Next \`M\` lines: \`<u> <v>\` (undirected link).
- Next \`Q\` lines, each one of:
  - \`OFFLINE <node>\`: marks \`<node>\` offline (cannot be used as source, intermediate hop, or destination).
  - \`ONLINE <node>\`: marks \`<node>\` online again.
  - \`ROUTE <src> <dst>\`: prints minimum hop count between \`<src>\` and \`<dst>\` using only currently **online** nodes, or \`-1\` if unreachable (or if \`<src>\` or \`<dst>\` is currently offline!). Note: if \`<src> === <dst>\` and \`<src>\` is online, print \`0\`.

### Output Format
One line per \`ROUTE\` command containing the integer hop count (or \`-1\`).`,
        tags: ['Graphs', 'BFS', 'Sets', 'Stdin Queries'],
        hints: [],
        entryFunction: 'solve',
        playgroundInput: `4 5
n1 n2
n2 n3
n1 n4
n4 n3
ROUTE n1 n3
OFFLINE n2
OFFLINE n4
ROUTE n1 n3
ONLINE n4`,
        starterCode: `export function solve(input: string): string {
  // Implement dynamic failover BFS router
  void input;
  return '';
}
`,
        referenceSolution: `export function solve(input: string): string {
  const lines = input
    .split(/\\r?\\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return '';
  const [mStr, qStr] = lines[0].split(/\\s+/);
  const m = Number(mStr);
  const q = Number(qStr);

  const adj = new Map<string, Set<string>>();
  for (let i = 1; i <= m && i < lines.length; i++) {
    const [u, v] = lines[i].split(/\\s+/);
    if (!u || !v) continue;
    if (!adj.has(u)) adj.set(u, new Set());
    if (!adj.has(v)) adj.set(v, new Set());
    if (u !== v) {
      adj.get(u)!.add(v);
      adj.get(v)!.add(u);
    }
  }

  const offline = new Set<string>();
  const out: string[] = [];

  const bfsHops = (src: string, dst: string): number => {
    if (offline.has(src) || offline.has(dst)) return -1;
    if (src === dst) return 0;
    if (!adj.has(src) || !adj.has(dst)) return -1;

    const visited = new Set<string>([src]);
    const queue: { readonly node: string; readonly dist: number }[] = [
      { node: src, dist: 0 },
    ];
    let head = 0;

    while (head < queue.length) {
      const { node, dist } = queue[head++];
      for (const next of adj.get(node) ?? []) {
        if (offline.has(next) || visited.has(next)) continue;
        if (next === dst) return dist + 1;
        visited.add(next);
        queue.push({ node: next, dist: dist + 1 });
      }
    }
    return -1;
  };

  const startOps = 1 + m;
  for (let i = startOps; i < startOps + q && i < lines.length; i++) {
    const parts = lines[i].split(/\\s+/);
    const cmd = parts[0];
    if (cmd === 'OFFLINE' && parts[1]) {
      offline.add(parts[1]);
    } else if (cmd === 'ONLINE' && parts[1]) {
      offline.delete(parts[1]);
    } else if (cmd === 'ROUTE' && parts[1] && parts[2]) {
      out.push(String(bfsHops(parts[1], parts[2])));
    }
  }

  return out.join('\\n');
}
`,
        testCases: [
          {
            id: 'tc-1',
            name: 'Reroutes around offline nodes and recovers on ONLINE',
            args: [
              `4 6
n1 n2
n2 n3
n1 n4
n4 n5
ROUTE n1 n3
OFFLINE n2
ROUTE n1 n3
ONLINE n2
ROUTE n1 n3
OFFLINE n1`,
            ],
            expected: `2\n-1\n2`,
          },
          {
            id: 'tc-2',
            name: 'Same-node route returns 0 when online and -1 when offline',
            args: [
              `1 4
a b
ROUTE a a
OFFLINE a
ROUTE a a
ROUTE x x`,
            ],
            expected: `0\n-1\n0`,
          },
          {
            id: 'tc-3',
            name: 'Takes longer backup path when primary shortcut is offline',
            args: [
              `4 3
s t
s m1
m1 m2
m2 t
ROUTE s t
OFFLINE m1
ROUTE s t`,
            ],
            expected: `1\n1`,
          },
          {
            id: 'tc-4',
            name: 'Hidden: Disabling direct bridge forces 3-hop detour',
            hidden: true,
            args: [
              `4 3
s mid
mid t
s b1
b1 t
OFFLINE mid
ROUTE s t
OFFLINE b1`,
            ],
            expected: `2`,
          },
          {
            id: 'tc-5',
            name: 'Hidden: Offline destination returns -1 immediately',
            hidden: true,
            args: [
              `2 2
a b
b c
OFFLINE c
ROUTE a c`,
            ],
            expected: `-1`,
          },
        ],
      },
      {
        id: 's4-exam-t2',
        title: 'Constrained Generic Pivot Aggregator',
        style: 'leetcode',
        difficulty: 'medium',
        description: `Implement \`pivotNumericStats<T extends Record<GK, string> & Record<VK, number>, GK extends keyof T, VK extends keyof T>(rows, groupKey, valueKey)\`.

For every row in \`rows\`, group by \`String(row[groupKey])\` and compute \`{ count, sum, min, max }\` over \`Number(row[valueKey])\` without mutating \`rows\`.`,
        tags: ['Generic Constraints', 'Aggregation', 'Immutability'],
        hints: [],
        entryFunction: 'pivotNumericStats',
        astRules: { requireGenerics: true, requireInterfaceOrType: true },
        starterCode: `export interface GroupStats {
  readonly count: number;
  readonly sum: number;
  readonly min: number;
  readonly max: number;
}

export function pivotNumericStats<
  T extends Record<GK, string> & Record<VK, number>,
  GK extends keyof T,
  VK extends keyof T,
>(
  rows: readonly T[],
  groupKey: GK,
  valueKey: VK
): Record<string, GroupStats> {
  void rows;
  void groupKey;
  void valueKey;
  return {};
}
`,
        referenceSolution: `export interface GroupStats {
  readonly count: number;
  readonly sum: number;
  readonly min: number;
  readonly max: number;
}

export function pivotNumericStats<
  T extends Record<GK, string> & Record<VK, number>,
  GK extends keyof T,
  VK extends keyof T,
>(
  rows: readonly T[],
  groupKey: GK,
  valueKey: VK
): Record<string, GroupStats> {
  const map = new Map<string, { count: number; sum: number; min: number; max: number }>();

  for (const row of rows) {
    const g = row[groupKey];
    const v = row[valueKey];
    const cur = map.get(g);
    if (!cur) {
      map.set(g, { count: 1, sum: v, min: v, max: v });
    } else {
      cur.count += 1;
      cur.sum += v;
      if (v < cur.min) cur.min = v;
      if (v > cur.max) cur.max = v;
    }
  }

  const out: Record<string, GroupStats> = {};
  for (const [k, stats] of map.entries()) {
    out[k] = stats;
  }
  return out;
}
`,
        testCases: [
          {
            id: 'tc-1',
            name: 'Aggregates count, sum, min, and max per group key',
            checkImmutability: true,
            args: [
              [
                { region: 'us', ms: 40 },
                { region: 'eu', ms: 75 },
                { region: 'us', ms: 15 },
                { region: 'us', ms: 95 },
              ],
              'region',
              'ms',
            ],
            expected: {
              us: { count: 3, sum: 150, min: 15, max: 95 },
              eu: { count: 1, sum: 75, min: 75, max: 75 },
            },
          },
          {
            id: 'tc-2',
            name: 'Handles negative values accurately',
            checkImmutability: true,
            args: [
              [
                { acct: 'pnl', delta: -30 },
                { acct: 'pnl', delta: -10 },
              ],
              'acct',
              'delta',
            ],
            expected: {
              pnl: { count: 2, sum: -40, min: -30, max: -10 },
            },
          },
          {
            id: 'tc-3',
            name: 'Empty input returns empty object',
            checkImmutability: true,
            args: [[], 'region', 'ms'],
            expected: {},
          },
          {
            id: 'tc-4',
            name: 'Hidden: Safely handles prototype key names like "toString"',
            hidden: true,
            checkImmutability: true,
            args: [[{ k: 'toString', v: 7 }], 'k', 'v'],
            expected: { toString: { count: 1, sum: 7, min: 7, max: 7 } },
          },
          {
            id: 'tc-5',
            name: 'Hidden: Works when zero values are present',
            hidden: true,
            checkImmutability: true,
            args: [
              [
                { k: 'z', v: 0 },
                { k: 'z', v: 5 },
              ],
              'k',
              'v',
            ],
            expected: { z: { count: 2, sum: 5, min: 0, max: 5 } },
          },
        ],
      },
      {
        id: 's4-exam-t3',
        title: 'Discriminated Editor Undo/Redo Stack',
        style: 'leetcode',
        difficulty: 'medium',
        description: `Implement \`evaluateEditorCommands(commands)\` over an initially empty text buffer \`""\` using undo and redo stacks.

### Commands (\`EditorCmd\`)
- \`{ type: 'APPEND'; text: string }\`: if \`text.length > 0\`, pushes current buffer onto \`undoStack\`, clears \`redoStack\`, and appends \`text\`. (If \`text === ""\`, no-op: do not touch stacks!)
- \`{ type: 'DELETE_END'; count: number }\`: removes \`Math.min(buffer.length, Math.max(0, count))\` characters from the end. ONLY if the buffer actually changed (\`next !== current\`), pushes prior buffer onto \`undoStack\` and clears \`redoStack\`.
- \`{ type: 'UNDO' }\`: if \`undoStack\` is non-empty, pushes current buffer onto \`redoStack\` and restores the top of \`undoStack\`.
- \`{ type: 'REDO' }\`: if \`redoStack\` is non-empty, pushes current buffer onto \`undoStack\` and restores the top of \`redoStack\`.

Return \`{ text: string; undoDepth: number; redoDepth: number }\`.`,
        tags: ['Stacks', 'Discriminated Unions', 'Exhaustiveness'],
        hints: [],
        entryFunction: 'evaluateEditorCommands',
        astRules: { requireTypeNarrowing: true, requireInterfaceOrType: true },
        starterCode: `export type EditorCmd =
  | { readonly type: 'APPEND'; readonly text: string }
  | { readonly type: 'DELETE_END'; readonly count: number }
  | { readonly type: 'UNDO' }
  | { readonly type: 'REDO' };

export interface EditorStateSummary {
  readonly text: string;
  readonly undoDepth: number;
  readonly redoDepth: number;
}

export function evaluateEditorCommands(
  commands: readonly EditorCmd[]
): EditorStateSummary {
  void commands;
  return { text: '', undoDepth: 0, redoDepth: 0 };
}
`,
        referenceSolution: `export type EditorCmd =
  | { readonly type: 'APPEND'; readonly text: string }
  | { readonly type: 'DELETE_END'; readonly count: number }
  | { readonly type: 'UNDO' }
  | { readonly type: 'REDO' };

export interface EditorStateSummary {
  readonly text: string;
  readonly undoDepth: number;
  readonly redoDepth: number;
}

function assertNever(x: never): never {
  throw new Error(\`Unhandled command: \${JSON.stringify(x)}\`);
}

export function evaluateEditorCommands(
  commands: readonly EditorCmd[]
): EditorStateSummary {
  let current = '';
  const undoStack: string[] = [];
  const redoStack: string[] = [];

  for (const cmd of commands) {
    switch (cmd.type) {
      case 'APPEND': {
        if (cmd.text.length > 0) {
          undoStack.push(current);
          redoStack.length = 0;
          current += cmd.text;
        }
        break;
      }
      case 'DELETE_END': {
        const removeCount = Math.min(current.length, Math.max(0, cmd.count));
        if (removeCount > 0) {
          undoStack.push(current);
          redoStack.length = 0;
          current = current.slice(0, current.length - removeCount);
        }
        break;
      }
      case 'UNDO': {
        if (undoStack.length > 0) {
          redoStack.push(current);
          current = undoStack.pop()!;
        }
        break;
      }
      case 'REDO': {
        if (redoStack.length > 0) {
          undoStack.push(current);
          current = redoStack.pop()!;
        }
        break;
      }
      default:
        assertNever(cmd);
    }
  }

  return {
    text: current,
    undoDepth: undoStack.length,
    redoDepth: redoStack.length,
  };
}
`,
        testCases: [
          {
            id: 'tc-1',
            name: 'Supports multi-step undo and redo',
            args: [
              [
                { type: 'APPEND', text: 'Type' },
                { type: 'APPEND', text: 'Script' },
                { type: 'DELETE_END', count: 6 },
                { type: 'APPEND', text: 'Craft' },
                { type: 'UNDO' },
                { type: 'UNDO' },
                { type: 'REDO' },
              ],
            ],
            expected: { text: 'Type', undoDepth: 3, redoDepth: 1 },
          },
          {
            id: 'tc-2',
            name: 'New edit after UNDO clears redo history',
            args: [
              [
                { type: 'APPEND', text: 'abc' },
                { type: 'APPEND', text: 'def' },
                { type: 'UNDO' },
                { type: 'APPEND', text: '!' },
                { type: 'REDO' },
              ],
            ],
            expected: { text: 'abc!', undoDepth: 2, redoDepth: 0 },
          },
          {
            id: 'tc-3',
            name: 'Empty APPEND and empty DELETE_END are no-ops that preserve redoStack',
            args: [
              [
                { type: 'APPEND', text: 'hi' },
                { type: 'UNDO' },
                { type: 'APPEND', text: '' },
                { type: 'DELETE_END', count: 5 },
                { type: 'REDO' },
              ],
            ],
            expected: { text: 'hi', undoDepth: 1, redoDepth: 0 },
          },
          {
            id: 'tc-4',
            name: 'Hidden: Extra UNDO and REDO on empty stacks do nothing',
            hidden: true,
            args: [[{ type: 'UNDO' }, { type: 'REDO' }]],
            expected: { text: '', undoDepth: 0, redoDepth: 0 },
          },
          {
            id: 'tc-5',
            name: 'Hidden: DELETE_END larger than buffer clears entire string cleanly',
            hidden: true,
            args: [
              [
                { type: 'APPEND', text: 'short' },
                { type: 'DELETE_END', count: 100 },
                { type: 'UNDO' },
              ],
            ],
            expected: { text: 'short', undoDepth: 1, redoDepth: 1 },
          },
        ],
      },
      {
        id: 's4-exam-t4',
        title: 'First Non-Repeating Stream Tracker',
        style: 'leetcode',
        difficulty: 'hard',
        description: `Implement \`firstNonRepeatingStream(tokens: readonly string[]): (string | null)[]\` in **O(N)** time.

After processing each prefix \`tokens[0..i]\`, output the **earliest-arrived** token whose frequency in \`tokens[0..i]\` is **exactly \`1\`**, or \`null\` if every token seen so far has appeared \`>= 2\` times.`,
        tags: ['Queue', 'Frequency Map', 'Streaming Algorithms'],
        hints: [],
        entryFunction: 'firstNonRepeatingStream',
        starterCode: `export function firstNonRepeatingStream(
  tokens: readonly string[]
): (string | null)[] {
  void tokens;
  return [];
}
`,
        referenceSolution: `export function firstNonRepeatingStream(
  tokens: readonly string[]
): (string | null)[] {
  const counts = new Map<string, number>();
  const queue: string[] = [];
  let head = 0;
  const result: (string | null)[] = [];

  for (const token of tokens) {
    const nextCount = (counts.get(token) ?? 0) + 1;
    counts.set(token, nextCount);
    if (nextCount === 1) {
      queue.push(token);
    }

    while (head < queue.length && (counts.get(queue[head]) ?? 0) > 1) {
      head++;
    }

    result.push(head < queue.length ? queue[head] : null);
  }

  return result;
}
`,
        testCases: [
          {
            id: 'tc-1',
            name: 'Advances queue head as earlier unique tokens repeat',
            checkImmutability: true,
            args: [['a', 'b', 'a', 'c', 'b', 'c']],
            expected: ['a', 'a', 'b', 'b', 'c', null],
          },
          {
            id: 'tc-2',
            name: 'Recovers when new unique token arrives after null state',
            checkImmutability: true,
            args: [['x', 'x', 'y', 'z', 'y']],
            expected: ['x', null, 'y', 'y', 'z'],
          },
          {
            id: 'tc-3',
            name: 'Empty stream returns empty array',
            checkImmutability: true,
            args: [[]],
            expected: [],
          },
          {
            id: 'tc-4',
            name: 'Hidden: Triple repetition does not resurrect already-repeated token',
            hidden: true,
            checkImmutability: true,
            args: [['k', 'k', 'k', 'm']],
            expected: ['k', null, null, 'm'],
          },
          {
            id: 'tc-5',
            name: 'Hidden: Handles prototype-named tokens safely via Map',
            hidden: true,
            checkImmutability: true,
            args: [['toString', 'valueOf', 'toString']],
            expected: ['toString', 'toString', 'valueOf'],
          },
        ],
      },
      {
        id: 's4-exam-t5',
        title: 'PickByValueType & UnwrapOkTuple',
        style: 'type-challenge',
        difficulty: 'hard',
        description: `Implement two advanced generic utilities combining Sections 3 & 4:

1. \`PickByValueType<T extends object, Target>\`: Produces an object type containing only properties \`K\` of \`T\` whose value type \`T[K]\` is assignable to \`Target\` (preserving \`readonly\` and \`?\` modifiers; note: for optional properties \`k?: U\`, check \`T[K] extends Target\` directly).
2. \`UnwrapOkTuple<T extends readonly unknown[]>\`: Given a tuple of \`Result\` objects (\`{ ok: true; value: V } | { ok: false; error: E }\`), extracts a tuple of the \`ok: true\` \`value\` types \`[V1, V2, ...]\`!`,
        tags: ['Mapped Key Remapping', 'Variadic Tuples', 'Discriminated Unions'],
        hints: [],
        starterCode: `export type PickByValueType<T extends object, Target> = T;

export type UnwrapOkTuple<T extends readonly unknown[]> = T;
`,
        referenceSolution: `export type PickByValueType<T extends object, Target> = {
  [K in keyof T as T[K] extends Target ? K : never]: T[K];
};

type ExtractOkValue<R> = R extends { readonly ok: true; readonly value: infer V }
  ? V
  : never;

export type UnwrapOkTuple<T extends readonly unknown[]> =
  T extends readonly [infer Head, ...infer Tail]
    ? [ExtractOkValue<Head>, ...UnwrapOkTuple<Tail>]
    : [];
`,
        typeAssertionPrelude: `import type { PickByValueType, UnwrapOkTuple } from './solution';

type Res<T, E> = { ok: true; value: T } | { ok: false; error: E };

interface MetricsModel {
  readonly id: string;
  count: number;
  ratio: number;
  label?: string;
  active: boolean;
}`,
        typeAssertions: [
          {
            id: 'ta-1',
            name: 'PickByValueType selects numeric properties',
            assertion: `Expect<Equal<PickByValueType<MetricsModel, number>, { count: number; ratio: number }>>`,
          },
          {
            id: 'ta-2',
            name: 'PickByValueType preserves readonly and optional modifiers when Target includes undefined',
            assertion: `Expect<Equal<PickByValueType<MetricsModel, string | undefined>, { readonly id: string; label?: string }>>`,
          },
          {
            id: 'ta-3',
            name: 'UnwrapOkTuple unwraps heterogeneous Result tuple into value tuple',
            assertion: `Expect<Equal<UnwrapOkTuple<[Res<number, string>, Res<boolean, Error>, Res<{ id: string }, 'ERR'>]>, [number, boolean, { id: string }]>>`,
          },
          {
            id: 'ta-4',
            name: 'UnwrapOkTuple on empty tuple returns []',
            assertion: `Expect<Equal<UnwrapOkTuple<[]>, []>>`,
          },
          {
            id: 'ta-5',
            name: 'Hidden: PickByValueType with unmatched Target yields {}',
            hidden: true,
            assertion: `Expect<Equal<PickByValueType<MetricsModel, number[]>, {}>>`,
          },
          {
            id: 'ta-6',
            name: 'Hidden: UnwrapOkTuple works with readonly input tuples',
            hidden: true,
            assertion: `Expect<Equal<UnwrapOkTuple<readonly [Res<'ok', never>]>, ['ok']>>`,
          },
        ],
        testCases: [],
      },
    ],
  },
};
