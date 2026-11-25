import type { LogicDiagnosis } from '../types/engine';

export function deepEqual(a: unknown, b: unknown, floatTolerance = 0): boolean {
  if (Object.is(a, b)) return true;

  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    if (floatTolerance > 0) {
      return Math.abs(a - b) <= floatTolerance;
    }
    return false;
  }

  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], floatTolerance)) return false;
    }
    return true;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [k, v] of a.entries()) {
      if (!b.has(k) || !deepEqual(v, b.get(k), floatTolerance)) return false;
    }
    return true;
  }

  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const item of a.values()) {
      if (!b.has(item)) return false;
    }
    return true;
  }

  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    const valA = (a as Record<string, unknown>)[key];
    const valB = (b as Record<string, unknown>)[key];
    if (!deepEqual(valA, valB, floatTolerance)) return false;
  }

  return true;
}

function canonicalSerialize(value: unknown): string {
  if (value === undefined) return '__undefined__';
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalSerialize).join(',')}]`;
  }
  const sortedKeys = Object.keys(value as Record<string, unknown>).sort();
  const props = sortedKeys.map(
    (k) => `${JSON.stringify(k)}:${canonicalSerialize((value as Record<string, unknown>)[k])}`
  );
  return `{${props.join(',')}}`;
}

function normalizeWhitespace(s: string): string {
  return s
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n')
    .trim();
}

function hasDecimalPrecisionMismatch(actual: string, expected: string): boolean {
  const numRegex = /-?\d+(?:\.\d+)?/g;
  const aNums = actual.match(numRegex);
  const eNums = expected.match(numRegex);
  if (!aNums || !eNums || aNums.length !== eNums.length || aNums.length === 0) {
    return false;
  }
  const strippedA = actual.replace(numRegex, '#').trim();
  const strippedE = expected.replace(numRegex, '#').trim();
  if (strippedA !== strippedE) return false;

  let anyDiff = false;
  for (let i = 0; i < aNums.length; i++) {
    if (aNums[i] !== eNums[i]) {
      anyDiff = true;
      const na = Number(aNums[i]);
      const ne = Number(eNums[i]);
      if (!Number.isFinite(na) || !Number.isFinite(ne) || Math.abs(na - ne) > 0.05) {
        return false;
      }
    }
  }
  return anyDiff;
}

function hasStringOffByOne(actual: string, expected: string): boolean {
  const trimmedA = actual.trim();
  const trimmedE = expected.trim();
  if (/^-?\d+$/.test(trimmedA) && /^-?\d+$/.test(trimmedE)) {
    return Math.abs(Number(trimmedA) - Number(trimmedE)) === 1;
  }
  return false;
}

export interface AnalyzeLogicInput {
  actual: unknown;
  expected: unknown;
  mutatedInput?: boolean;
  runtimeError?: string;
  timedOut?: boolean;
}

export function analyzeLogicError(input: AnalyzeLogicInput): LogicDiagnosis {
  if (input.timedOut) {
    return {
      kind: 'infinite-loop-timeout',
      title: 'Execution Timed Out (Possible Infinite Loop)',
      explanation:
        'Your code exceeded the sandbox time budget and the worker was safely terminated and respawned.',
      suggestion:
        'Check `while` / `for` termination conditions, pointer increments (`left++`, `right--`), or unresolved `Promise` callbacks.',
    };
  }

  if (input.runtimeError) {
    return {
      kind: 'runtime-exception',
      title: 'Unhandled Runtime Exception',
      explanation: `Execution threw an error: ${input.runtimeError}`,
      suggestion:
        'Check edge cases such as empty inputs, out-of-bounds indices, invalid parsing, or calling methods on `undefined`.',
    };
  }

  if (input.mutatedInput) {
    return {
      kind: 'input-mutation',
      title: 'Input Mutation Detected',
      explanation:
        'Your function mutated an input array or object in-place (for example via `.sort()`, `.reverse()`, `.splice()`, `.push()`, or direct property assignment).',
      suggestion:
        'Clone inputs before modifying them — e.g. `[...items].sort(...)`, `items.slice()`, or `{ ...record }` — to preserve immutability.',
    };
  }

  const { actual, expected } = input;

  // 1. Forgotten return
  if (actual === undefined && expected !== undefined) {
    return {
      kind: 'forgotten-return',
      title: 'Forgotten `return` Statement (`undefined` Returned)',
      explanation:
        'Your function returned `undefined` instead of a computed value. Remember that `console.log(...)` prints to stdout/console rather than returning a value from `solve()`.',
      suggestion:
        'Ensure every execution path ends with `return result;` (and don\'t omit `return` inside `{ ... }` arrow function bodies).',
    };
  }

  // 2. Numeric checks: float precision & off-by-one
  if (typeof actual === 'number' && typeof expected === 'number') {
    const diff = Math.abs(actual - expected);
    if (diff === 1) {
      return {
        kind: 'off-by-one',
        title: 'Off-by-One Error (±1)',
        explanation: `Expected \`${expected}\`, but got \`${actual}\` (difference of ${actual > expected ? '+1' : '-1'}).`,
        suggestion:
          'Inspect loop bounds (`<` vs `<=`), 0-based vs 1-based indexing, or inclusive/exclusive range endpoints.',
      };
    }
    if (diff > 0 && diff <= 0.05) {
      return {
        kind: 'float-precision',
        title: 'Floating-Point / Rounding Precision Mismatch',
        explanation: `Expected \`${expected}\`, but got \`${actual}\` (off by ${diff.toExponential(2)}). IEEE-754 binary floating-point math can introduce tiny rounding drift.`,
        suggestion:
          'Format or round at the final step using `Number(value.toFixed(2))` or integer cents arithmetic (`Math.round(amount * 100)`).',
      };
    }
  }

  // 3. String checks: Beecrowd whitespace/newlines, .toFixed decimal formatting, string ±1
  if (typeof actual === 'string' && typeof expected === 'string') {
    if (normalizeWhitespace(actual) === normalizeWhitespace(expected)) {
      const trailingActual = actual.endsWith('\n') ? 'has trailing \\n' : 'no trailing \\n';
      const trailingExpected = expected.endsWith('\n') ? 'expects trailing \\n' : 'expects no trailing \\n';
      return {
        kind: 'whitespace-newline',
        title: 'Whitespace or Line-Break Formatting Difference',
        explanation: `Your core values match, but whitespace/newlines differ (${trailingActual}, ${trailingExpected}). Actual: ${JSON.stringify(actual)} vs Expected: ${JSON.stringify(expected)}.`,
        suggestion:
          'Check `.trim()`, extra spaces at line ends, or `\n` joining (`lines.join("\\n")`). Beecrowd-style outputs require exact formatting.',
      };
    }

    if (hasDecimalPrecisionMismatch(actual, expected)) {
      return {
        kind: 'float-precision',
        title: 'Decimal Formatting / `.toFixed()` Mismatch',
        explanation: `Numeric output differs only in decimal places or rounding: got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}.`,
        suggestion:
          'Use `.toFixed(n)` (for example `total.toFixed(2)`) so trailing zeros like `.50` and rounding match the specification.',
      };
    }

    if (hasStringOffByOne(actual, expected)) {
      return {
        kind: 'off-by-one',
        title: 'Off-by-One Count (±1)',
        explanation: `Formatted integer output \`${actual.trim()}\` is off by 1 from expected \`${expected.trim()}\`.`,
        suggestion:
          'Double-check boundary conditions (`<` vs `<=`), header line skipping, or empty trailing line handling (`input.trim().split(...)`).',
      };
    }
  }

  // 4. Array checks: wrong element order & off-by-one length
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length === expected.length && actual.length > 1) {
      const sortedActual = [...actual].map(canonicalSerialize).sort();
      const sortedExpected = [...expected].map(canonicalSerialize).sort();
      if (deepEqual(sortedActual, sortedExpected)) {
        return {
          kind: 'wrong-order',
          title: 'Correct Elements in Wrong Order',
          explanation:
            'Your array contains the exact expected elements, but their order does not match the specification.',
          suggestion:
            'Check comparator direction (`a - b` ascending vs `b - a` descending), tie-breaker rules, or insertion order.',
        };
      }
    }

    if (Math.abs(actual.length - expected.length) === 1) {
      const shorter = actual.length < expected.length ? actual : expected;
      const longer = actual.length < expected.length ? expected : actual;
      const isPrefix = shorter.every((item, idx) => deepEqual(item, longer[idx]));
      const isSuffix = shorter.every((item, idx) => deepEqual(item, longer[idx + 1]));
      if (isPrefix || isSuffix) {
        return {
          kind: 'off-by-one',
          title: 'Array Length Off-by-One (±1 Element)',
          explanation: `Returned ${actual.length} element(s) instead of ${expected.length}; elements match except at the ${isPrefix ? 'end' : 'start'} boundary.`,
          suggestion:
            'Check slice bounds (`slice(start, end)` excludes `end`), loop termination, or fencepost logic.',
        };
      }
    }
  }

  // 5. Type mismatch (e.g. "42" vs 42)
  if (typeof actual !== typeof expected) {
    if (String(actual) === String(expected)) {
      return {
        kind: 'type-mismatch',
        title: `Return Type Mismatch (\`${typeof actual}\` instead of \`${typeof expected}\`)`,
        explanation: `Returned \`${JSON.stringify(actual)}\` (${typeof actual}), whereas \`${JSON.stringify(expected)}\` (${typeof expected}) was expected.`,
        suggestion:
          'Convert the return value explicitly (`Number(...)`, `String(...)`, or check function return type).',
      };
    }
  }

  return {
    kind: 'general-mismatch',
    title: 'Output Does Not Match Expected Result',
    explanation: `Expected ${ formatValueCompact(expected) }, but received ${ formatValueCompact(actual) }.`,
    suggestion:
      'Trace your logic on this test case input or test intermediate values in the Custom Input / Playground tab.',
  };
}

export function formatValueCompact(value: unknown): string {
  if (value === undefined) return 'undefined';
  try {
    const str = JSON.stringify(value);
    if (str.length <= 160) return str;
    return `${str.slice(0, 157)}...`;
  } catch {
    return String(value);
  }
}
