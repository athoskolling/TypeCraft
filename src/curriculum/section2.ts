import type { Section } from '../types/curriculum';

export const section2: Section = {
  id: 'section-2',
  number: 2,
  slug: 'functions-strings-arrays',
  title: 'Functions, Strings & Arrays',
  subtitle: 'Higher-order functions, text parsing, immutable pipelines, sliding windows, and 2D matrices',
  accentColor: '#8cc265',
  description:
    'Master composable TypeScript functions, string normalization and structured log parsing, strictly immutable array pipelines (`map`, `filter`, `reduce`, copy-before-sort), linear-time two-pointer and sliding-window techniques, and 2D matrix transformations.',
  phases: [
    {
      id: 's2-p1',
      number: 1,
      title: 'Typed Functions, Optional/Default Params & Rest Tuples',
      subtitle: 'Default parameters, rest arguments, generic higher-order combinators, and signature types',
      conceptSummary: `Functions are first-class values in TypeScript—giving callbacks, rest parameters, and return values precise types unlocks safe composition.

- **Default & Rest Parameters:** \`function build(base: string, version: number = 1, ...parts: string[]): string\` handles omitted defaults (including \`undefined\`) and variable-arity arguments cleanly.
- **Higher-Order Functions:** Parameterize predicate filters and transform pipelines with \`<T>\` so callers keep full type inference without \`any\`.
- **Signature Introspection:** Conditional \`infer\` patterns extract return and parameter types directly from function types.`,
      challenges: [
        {
          id: 's2-p1-c1',
          title: 'Configurable Endpoint URL Builder',
          style: 'leetcode',
          difficulty: 'beginner',
          description: `### Problem

Implement \`buildEndpointUrl(baseUrl, version = 1, ...segments)\`:

1. Strip all trailing \`'/'\` characters from \`baseUrl\`.
2. Format the API version segment as \`v\${version}\` (defaulting \`version\` to \`1\` when omitted or \`undefined\`).
3. For each string in \`...segments\`, strip leading and trailing \`'/'\` characters and discard any segment that becomes empty \`""\`.
4. Join the cleaned base URL, \`v\${version}\`, and non-empty segments with \`'/'\`.

### Examples

- \`buildEndpointUrl('https://api.typecraft.dev/', 2, 'users', '42')\`  
  → \`"https://api.typecraft.dev/v2/users/42"\`
- \`buildEndpointUrl('https://api.typecraft.dev')\`  
  → \`"https://api.typecraft.dev/v1"\``,
          tags: ['Default Params', 'Rest Parameters', 'String Joining'],
          hints: [
            'Use `baseUrl.replace(/\\/+$/, "")` to strip trailing slashes from the host.',
            'Clean each path segment via `seg.replace(/^\\/+|\\/+$/g, "")` and keep only segments with `length > 0`.',
          ],
          entryFunction: 'buildEndpointUrl',
          playgroundInput: '["https://api.typecraft.dev/", 2, "users", "42", "profile"]',
          starterCode: `export function buildEndpointUrl(
  baseUrl: string,
  version: number = 1,
  ...segments: string[]
): string {
  void version;
  void segments;
  return baseUrl;
}
`,
          referenceSolution: `export function buildEndpointUrl(
  baseUrl: string,
  version: number = 1,
  ...segments: string[]
): string {
  const cleanBase = baseUrl.replace(/\\/+$/, '');
  const cleanSegments = segments
    .map((seg) => seg.replace(/^\\/+|\\/+$/g, ''))
    .filter((seg) => seg.length > 0);

  return [cleanBase, \`v\${version}\`, ...cleanSegments].join('/');
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Version 2 with three path segments',
              args: ['https://api.typecraft.dev/', 2, 'users', '42', 'profile'],
              expected: 'https://api.typecraft.dev/v2/users/42/profile',
            },
            {
              id: 'tc-2',
              name: 'Uses default version = 1 and zero segments',
              args: ['https://api.typecraft.dev'],
              expected: 'https://api.typecraft.dev/v1',
            },
            {
              id: 'tc-3',
              name: 'Normalizes redundant slashes and skips empty segments',
              args: ['http://localhost:3000///', 1, '/health/', '', '//ready//'],
              expected: 'http://localhost:3000/v1/health/ready',
            },
            {
              id: 'tc-4',
              name: 'Clean single resource segment',
              args: ['https://svc.io', 3, 'items'],
              expected: 'https://svc.io/v3/items',
            },
            {
              id: 'tc-5',
              name: 'Explicit undefined triggers default version 1',
              args: ['https://svc.io/', undefined, 'docs'],
              expected: 'https://svc.io/v1/docs',
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Slash-only segments are discarded cleanly',
              args: ['https://svc.io', 4, '/', '///'],
              expected: 'https://svc.io/v4',
              hidden: true,
            },
          ],
        },
        {
          id: 's2-p1-c2',
          title: 'Generic Multi-Predicate Filter',
          style: 'leetcode',
          difficulty: 'easy',
          description: `### Problem

Implement a generic higher-order filter \`filterByAllPredicates<T>(items, ...predicates)\`:

- \`Predicate<T>\` has signature \`(item: T, index: number) => boolean\`.
- Return a **new array** containing every element \`item\` at \`index\` for which **all** functions in \`predicates\` return \`true\`.
- If zero predicates are provided, return a shallow copy \`[...items]\` (never return the exact input reference).

### Example

\`\`\`ts
filterByAllPredicates([1, 2, 3, 4, 5, 6], (n) => n % 2 === 0, (n) => n > 2);
// => [4, 6]
\`\`\``,
          tags: ['Higher-Order Functions', 'Generics', 'Callbacks'],
          hints: [
            'Use `items.filter((item, index) => predicates.every((pred) => pred(item, index)))`.',
            '`Array.prototype.filter` always allocates a fresh array, even when `predicates` is empty!',
          ],
          entryFunction: 'filterByAllPredicates',
          astRules: { requireGenerics: true },
          starterCode: `export type Predicate<T> = (item: T, index: number) => boolean;

export function filterByAllPredicates<T>(
  items: readonly T[],
  ...predicates: Predicate<T>[]
): T[] {
  void items;
  void predicates;
  return [];
}
`,
          referenceSolution: `export type Predicate<T> = (item: T, index: number) => boolean;

export function filterByAllPredicates<T>(
  items: readonly T[],
  ...predicates: Predicate<T>[]
): T[] {
  return items.filter((item, index) => predicates.every((pred) => pred(item, index)));
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Combines even and threshold numeric predicates',
              harnessCode: `return exports.filterByAllPredicates(
                [1, 2, 3, 4, 5, 6, 7, 8],
                (n: number) => n % 2 === 0,
                (n: number) => n > 2
              );`,
              expected: [4, 6, 8],
            },
            {
              id: 'tc-2',
              name: 'Filters strings by prefix and minimum length',
              harnessCode: `return exports.filterByAllPredicates(
                ['ts', 'type', 'code', 'tuple', 'tar'],
                (s: string) => s.startsWith('t'),
                (s: string) => s.length >= 4
              );`,
              expected: ['type', 'tuple'],
            },
            {
              id: 'tc-3',
              name: 'Passes accurate element index to predicates',
              harnessCode: `return exports.filterByAllPredicates(
                ['a', 'b', 'c', 'd', 'e'],
                (_item: string, idx: number) => idx % 2 === 0,
                (item: string) => item !== 'c'
              );`,
              expected: ['a', 'e'],
            },
            {
              id: 'tc-4',
              name: 'Zero predicates returns a fresh shallow copy',
              harnessCode: `const src = [10, 20, 30];
              const out = exports.filterByAllPredicates(src);
              return { values: out, cloned: out !== src };`,
              expected: { values: [10, 20, 30], cloned: true },
            },
            {
              id: 'tc-5',
              name: 'Mutually exclusive predicates yield empty array',
              harnessCode: `return exports.filterByAllPredicates(
                [1, 2, 3, 4],
                (n: number) => n > 10,
                (n: number) => n < 5
              );`,
              expected: [],
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Works with typed objects',
              harnessCode: `return exports.filterByAllPredicates(
                [
                  { id: 1, active: true, score: 80 },
                  { id: 2, active: false, score: 95 },
                  { id: 3, active: true, score: 92 },
                ],
                (u: { active: boolean }) => u.active,
                (u: { score: number }) => u.score >= 90
              );`,
              expected: [{ id: 3, active: true, score: 92 }],
              hidden: true,
            },
          ],
        },
        {
          id: 's2-p1-c3',
          title: 'Left-to-Right Transform Pipe',
          style: 'leetcode',
          difficulty: 'easy',
          description: `### Problem

Implement \`pipeTransforms<T>(...steps)\` that composes any number of unary functions \`UnaryFn<T> = (value: T) => T\` **left-to-right** into a single reusable function:

- \`pipeTransforms(f, g, h)(x)\` evaluates \`h(g(f(x)))\`.
- \`pipeTransforms()(x)\` (zero steps) acts as the identity function and returns \`x\`.

### Example

\`\`\`ts
const normalize = pipeTransforms<string>(
  (s) => s.trim(),
  (s) => s.toLowerCase(),
  (s) => s.replace(/\\s+/g, '-')
);
normalize('  Hello World  '); // => 'hello-world'
\`\`\``,
          tags: ['Function Composition', 'Closures', 'Generics'],
          hints: [
            'Return a closure `(initial: T): T => ...` that iterates or reduces across `steps` starting from `initial`.',
            '`steps.reduce((acc, fn) => fn(acc), initial)` naturally returns `initial` when `steps` is empty.',
          ],
          entryFunction: 'pipeTransforms',
          astRules: { requireGenerics: true },
          starterCode: `export type UnaryFn<T> = (value: T) => T;

export function pipeTransforms<T>(...steps: UnaryFn<T>[]): UnaryFn<T> {
  void steps;
  return (initial: T): T => initial;
}
`,
          referenceSolution: `export type UnaryFn<T> = (value: T) => T;

export function pipeTransforms<T>(...steps: UnaryFn<T>[]): UnaryFn<T> {
  return (initial: T): T => steps.reduce((acc, step) => step(acc), initial);
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Executes arithmetic steps left-to-right',
              harnessCode: `const fn = exports.pipeTransforms(
                (n: number) => n + 2,
                (n: number) => n * 3,
                (n: number) => n - 1
              );
              return fn(4);`,
              expected: 17,
            },
            {
              id: 'tc-2',
              name: 'String cleanup pipeline',
              harnessCode: `const clean = exports.pipeTransforms(
                (s: string) => s.trim(),
                (s: string) => s.toLowerCase(),
                (s: string) => s.replace(/\\s+/g, '_')
              );
              return clean('  Type Safe Code  ');`,
              expected: 'type_safe_code',
            },
            {
              id: 'tc-3',
              name: 'Empty pipeline acts as identity',
              harnessCode: `const id = exports.pipeTransforms();
              return id(42);`,
              expected: 42,
            },
            {
              id: 'tc-4',
              name: 'Composed function can be called repeatedly without shared state bugs',
              harnessCode: `const doublePlusOne = exports.pipeTransforms(
                (n: number) => n * 2,
                (n: number) => n + 1
              );
              return [doublePlusOne(5), doublePlusOne(10)];`,
              expected: [11, 21],
            },
            {
              id: 'tc-5',
              name: 'Single step pipeline',
              harnessCode: `const shout = exports.pipeTransforms((s: string) => s + '!');
              return shout('go');`,
              expected: 'go!',
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Immutable array pipeline transform',
              harnessCode: `const proc = exports.pipeTransforms(
                (arr: number[]) => arr.filter((x) => x > 0),
                (arr: number[]) => arr.map((x) => x * 10)
              );
              return proc([-1, 2, 0, 5]);`,
              expected: [20, 50],
              hidden: true,
            },
          ],
        },
        {
          id: 's2-p1-c4',
          title: 'Function Return & First Parameter Types',
          style: 'type-challenge',
          difficulty: 'easy',
          description: `### Problem

Without using \`any\`, implement two type utilities for inspecting function signatures:

1. \`FnReturn<F extends (...args: never[]) => unknown>\`: extracts the return type of \`F\`.
2. \`FirstParam<F extends (...args: never[]) => unknown>\`: extracts the type of the first parameter of \`F\`, or \`never\` when \`F\` accepts zero parameters.

### Examples

\`\`\`ts
type R = FnReturn<(id: string, limit: number) => boolean>;   // boolean
type P = FirstParam<(id: string, limit: number) => boolean>; // string
type Z = FirstParam<() => number>;                           // never
\`\`\``,
          tags: ['Function Types', 'Conditional infer', 'Type Introspection'],
          hints: [
            'In strict mode without `any`, `(...args: never[]) => unknown` is the supertype of all functions because parameters are contravariant.',
            'Infer the parameter tuple via `F extends (...args: infer Args) => unknown` and check `Args extends [infer First, ...unknown[]] ? First : never`.',
          ],
          astRules: { requireGenerics: true },
          starterCode: `export type FnReturn<F extends (...args: never[]) => unknown> = unknown;

export type FirstParam<F extends (...args: never[]) => unknown> = unknown;
`,
          referenceSolution: `export type FnReturn<F extends (...args: never[]) => unknown> =
  F extends (...args: never[]) => infer R ? R : never;

export type FirstParam<F extends (...args: never[]) => unknown> =
  F extends (...args: infer Args) => unknown
    ? Args extends [infer First, ...unknown[]]
      ? First
      : never
    : never;
`,
          typeAssertionPrelude: `import type { FnReturn, FirstParam } from './solution';`,
          typeAssertions: [
            {
              id: 'ta-1',
              name: 'FnReturn extracts boolean return type',
              assertion: `Expect<Equal<FnReturn<(id: string, count: number) => boolean>, boolean>>`,
            },
            {
              id: 'ta-2',
              name: 'FnReturn extracts Promise return type',
              assertion: `Expect<Equal<FnReturn<() => Promise<string[]>>, Promise<string[]>>>`,
            },
            {
              id: 'ta-3',
              name: 'FirstParam extracts first argument type',
              assertion: `Expect<Equal<FirstParam<(id: string, count: number) => boolean>, string>>`,
            },
            {
              id: 'ta-4',
              name: 'FirstParam of zero-arg function is never',
              assertion: `Expect<Equal<FirstParam<() => void>, never>>`,
            },
            {
              id: 'ta-5',
              name: 'FirstParam preserves readonly tuple argument',
              assertion: `Expect<Equal<FirstParam<(coords: readonly [number, number]) => number>, readonly [number, number]>>`,
              hidden: true,
            },
            {
              id: 'ta-6',
              name: 'FnReturn preserves literal union return type',
              assertion: `Expect<Equal<FnReturn<(flag: boolean) => 'ok' | 'err'>, 'ok' | 'err'>>`,
              hidden: true,
            },
          ],
          testCases: [],
        },
      ],
    },
    {
      id: 's2-p2',
      number: 2,
      title: 'String Manipulation, Tokenizing & Normalization',
      subtitle: 'Unicode slug normalization, run-length encoding, identifier casing, and structured key-value logs',
      conceptSummary: `Clean text processing pipelines break messy input into predictable stages: normalize encoding/case, tokenize or replace patterns, and validate edge boundaries.

- **Unicode Diacritics:** \`str.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')\` decomposes accented characters like \`'é'\` into \`'e' + accent\` and strips the combining marks.
- **Key-Value Tokenizing:** When log fields can appear in any order, split by whitespace and parse \`key=value\` pairs into a lookup object or \`Map\`.`,
      challenges: [
        {
          id: 's2-p2-c1',
          title: 'URL Slug Normalizer',
          style: 'leetcode',
          difficulty: 'beginner',
          description: `### Problem

Convert an article \`title\` into a clean URL slug with optional \`maxLength\` truncation:

1. Strip diacritics via \`title.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')\` and convert to lowercase.
2. Replace every contiguous sequence of non-alphanumeric characters (\`[^a-z0-9]+\`) with a single hyphen \`'-'\`.
3. Remove leading and trailing \`'-'\` characters.
4. If \`maxLength !== undefined\`:
   - If \`maxLength <= 0\`, return \`""\`.
   - If \`slug.length > maxLength\`, slice \`slug.slice(0, maxLength)\` and remove any trailing \`'-'\` left at the cut boundary.

### Examples

- \`toUrlSlug('  Café & Crème Brûlée! ')\` → \`"cafe-creme-brulee"\`
- \`toUrlSlug('Clean Architecture Guide', 6)\` → \`"clean"\``,
          tags: ['Strings', 'Regex', 'Unicode Normalization'],
          hints: [
            'Chain `.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase()` before replacing `[^a-z0-9]+` with `"-"`.',
            'After slicing to `maxLength`, run `.replace(/-+$/g, "")` so you never leave a dangling hyphen.',
          ],
          entryFunction: 'toUrlSlug',
          playgroundInput: '["  Café & Crème Brûlée! ", 20]',
          starterCode: `export function toUrlSlug(title: string, maxLength?: number): string {
  void maxLength;
  return title;
}
`,
          referenceSolution: `export function toUrlSlug(title: string, maxLength?: number): string {
  if (maxLength !== undefined && maxLength <= 0) {
    return '';
  }

  let slug = title
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (maxLength !== undefined && slug.length > maxLength) {
    slug = slug.slice(0, maxLength).replace(/-+$/g, '');
  }

  return slug;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Punctuation and extra spaces collapse cleanly',
              args: ['  Hello, TypeScript World! 2026  '],
              expected: 'hello-typescript-world-2026',
            },
            {
              id: 'tc-2',
              name: 'Accented Latin characters normalize to ASCII',
              args: ['Café & Crème Brûlée'],
              expected: 'cafe-creme-brulee',
            },
            {
              id: 'tc-3',
              name: 'Exact boundary slice without trailing hyphen',
              args: ['Clean---Architecture___Guide', 18],
              expected: 'clean-architecture',
            },
            {
              id: 'tc-4',
              name: 'Truncation strips dangling trailing hyphen',
              args: ['Clean Architecture Guide', 6],
              expected: 'clean',
            },
            {
              id: 'tc-5',
              name: 'Symbols-only string produces empty slug',
              args: ['!!!@@@###'],
              expected: '',
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Zero maxLength returns empty string',
              args: ['TypeScript', 0],
              expected: '',
              hidden: true,
            },
          ],
        },
        {
          id: 's2-p2-c2',
          title: 'Compact Run-Length Encoder',
          style: 'leetcode',
          difficulty: 'easy',
          description: `### Problem

Compress consecutive identical characters in \`input\` using **compact run-length encoding**:

- A run of \`count > 1\` identical characters becomes \`"<char><count>"\` (case-sensitive).
- A single character (\`count === 1\`) stays \`"<char>"\` with no \`1\` suffix.
- An empty string returns \`""\`.

### Examples

- \`encodeRunLength('aaabbcdddd')\` → \`"a3b2cd4"\`
- \`encodeRunLength('abcdef')\` → \`"abcdef"\``,
          tags: ['String Scanning', 'Compression', 'Edge Cases'],
          hints: [
            'Track the current character and `count = 1`; whenever `input[i] !== input[i - 1]` (or `i === input.length`), append `char + (count > 1 ? String(count) : "")`.',
            'Handle `input.length === 0` upfront.',
          ],
          entryFunction: 'encodeRunLength',
          playgroundInput: '["aaabbcdddd"]',
          starterCode: `export function encodeRunLength(input: string): string {
  return input;
}
`,
          referenceSolution: `export function encodeRunLength(input: string): string {
  if (input.length === 0) {
    return '';
  }

  let result = '';
  let currentChar = input[0];
  let count = 1;

  for (let i = 1; i < input.length; i++) {
    const ch = input[i];
    if (ch === currentChar) {
      count++;
    } else {
      result += count > 1 ? \`\${currentChar}\${count}\` : currentChar;
      currentChar = ch;
      count = 1;
    }
  }

  result += count > 1 ? \`\${currentChar}\${count}\` : currentChar;
  return result;
}
`,
          testCases: [
            { id: 'tc-1', name: 'Mixed multi-char and single-char runs', args: ['aaabbcdddd'], expected: 'a3b2cd4' },
            { id: 'tc-2', name: 'All unique characters remain unchanged', args: ['abcdef'], expected: 'abcdef' },
            { id: 'tc-3', name: 'Empty string returns empty', args: [''], expected: '' },
            { id: 'tc-4', name: 'Double-digit run count (10 z characters)', args: ['zzzzzzzzzz'], expected: 'z10' },
            { id: 'tc-5', name: 'Case-sensitive runs stay separate', args: ['AAaaBB'], expected: 'A2a2B2', hidden: true },
            { id: 'tc-6', name: 'Single character string', args: ['x'], expected: 'x', hidden: true },
          ],
        },
        {
          id: 's2-p2-c3',
          title: 'Acronym-Safe Snake Case Converter',
          style: 'leetcode',
          difficulty: 'easy',
          description: `### Problem

Convert \`camelCase\`, \`PascalCase\`, or hyphen/space-separated identifiers—including uppercase acronyms like \`HTTP\` or \`ID\`—into lowercase \`snake_case\`:

- \`'getUserProfile'\` → \`'get_user_profile'\`
- \`'parseHTTPResponse'\` → \`'parse_http_response'\`
- \`'SimpleXMLParser'\` → \`'simple_xml_parser'\`
- \`'v2TokenID'\` → \`'v2_token_id'\`

Trim surrounding whitespace first; if empty, return \`""\`.`,
          tags: ['Regex', 'Identifier Casing', 'Tokenizing'],
          hints: [
            'Split acronym-to-word transitions first with `.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")` (turns `HTTPResponse` into `HTTP_Response`).',
            'Then split lowercase/digit-to-uppercase transitions with `.replace(/([a-z0-9])([A-Z])/g, "$1_$2")`, collapse `[\\s\\-_]+` to `"_"`, and `.toLowerCase()`.',
          ],
          entryFunction: 'camelToSnakeCase',
          playgroundInput: '["parseHTTPResponse"]',
          starterCode: `export function camelToSnakeCase(identifier: string): string {
  return identifier;
}
`,
          referenceSolution: `export function camelToSnakeCase(identifier: string): string {
  const trimmed = identifier.trim();
  if (trimmed.length === 0) {
    return '';
  }

  return trimmed
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\\s\\-_]+/g, '_')
    .toLowerCase();
}
`,
          testCases: [
            { id: 'tc-1', name: 'Standard camelCase identifier', args: ['getUserProfile'], expected: 'get_user_profile' },
            { id: 'tc-2', name: 'Embedded uppercase acronym HTTP', args: ['parseHTTPResponse'], expected: 'parse_http_response' },
            { id: 'tc-3', name: 'PascalCase with XML acronym', args: ['SimpleXMLParser'], expected: 'simple_xml_parser' },
            { id: 'tc-4', name: 'Already snake_case stays clean', args: ['already_snake_case'], expected: 'already_snake_case' },
            { id: 'tc-5', name: 'Digit boundary and trailing acronym ID', args: ['v2TokenID'], expected: 'v2_token_id', hidden: true },
            { id: 'tc-6', name: 'Empty/whitespace string returns empty', args: ['   '], expected: '', hidden: true },
          ],
        },
        {
          id: 's2-p2-c4',
          title: 'Structured Key-Value Log Parser',
          style: 'beecrowd',
          difficulty: 'medium',
          description: `### Problem

Parse a multi-line structured log stream where each line starts with \`[INFO]\`, \`[WARN]\`, or \`[ERROR]\` followed by \`service=<name>\`, \`status=<code>\`, and \`ms=<latency>\` **in any order**:

\`\`\`
[INFO] service=gateway status=200 ms=18
[ERROR] ms=142 service=auth status=503
[WARN] status=200 ms=1250 service=search
\`\`\`

An entry is flagged as an **incident** if **any** of the following hold:
- \`level === 'ERROR'\`
- \`status >= 500\`
- \`ms > 1000\` (strictly greater than \`1000\`)

### Output Format

\`\`\`
COUNTS = INFO:<iCount> WARN:<wCount> ERROR:<eCount>
INCIDENTS = <comma-separated <service>:<ms>ms in input order, or NONE>
\`\`\``,
          tags: ['Structured Logs', 'Key-Value Parsing', 'Beecrowd I/O'],
          hints: [
            'Strip brackets from the first token (`token.slice(1, -1)`) to read the level, then split each remaining token on `"="` to populate `service`, `status`, and `ms`.',
            'Pay attention to the strict inequality `ms > 1000` (`ms=1000` alone is not an incident unless `ERROR` or `status >= 500`).',
          ],
          entryFunction: 'solve',
          playgroundInput:
            '[INFO] service=gateway status=200 ms=18\n[ERROR] ms=142 service=auth status=503\n[WARN] status=200 ms=1250 service=search',
          starterCode: `export function solve(input: string): string {
  return '';
}
`,
          referenceSolution: `export function solve(input: string): string {
  const lines = input.trim().split(/\\r?\\n/);
  let infoCount = 0;
  let warnCount = 0;
  let errorCount = 0;
  const incidents: string[] = [];

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    const tokens = trimmed.split(/\\s+/);
    const level = tokens[0].slice(1, -1);

    if (level === 'INFO') infoCount++;
    else if (level === 'WARN') warnCount++;
    else if (level === 'ERROR') errorCount++;

    let service = '';
    let status = 0;
    let ms = 0;

    for (let i = 1; i < tokens.length; i++) {
      const [key, val] = tokens[i].split('=');
      if (key === 'service') service = val;
      else if (key === 'status') status = Number(val);
      else if (key === 'ms') ms = Number(val);
    }

    if (level === 'ERROR' || status >= 500 || ms > 1000) {
      incidents.push(\`\${service}:\${ms}ms\`);
    }
  }

  const incidentStr = incidents.length > 0 ? incidents.join(',') : 'NONE';
  return \`COUNTS = INFO:\${infoCount} WARN:\${warnCount} ERROR:\${errorCount}\\nINCIDENTS = \${incidentStr}\`;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Scrambled key order with ERROR and slow WARN incidents',
              args: [
                '[INFO] service=gateway status=200 ms=18\n[ERROR] ms=142 service=auth status=503\n[WARN] status=200 ms=1250 service=search',
              ],
              expected: 'COUNTS = INFO:1 WARN:1 ERROR:1\nINCIDENTS = auth:142ms,search:1250ms',
            },
            {
              id: 'tc-2',
              name: 'Healthy traffic produces NONE incidents',
              args: ['[INFO] service=web status=200 ms=45\n[INFO] ms=12 status=204 service=cache'],
              expected: 'COUNTS = INFO:2 WARN:0 ERROR:0\nINCIDENTS = NONE',
            },
            {
              id: 'tc-3',
              name: 'WARN with 502 status triggers incident',
              args: ['[WARN] service=billing status=502 ms=80'],
              expected: 'COUNTS = INFO:0 WARN:1 ERROR:0\nINCIDENTS = billing:80ms',
            },
            {
              id: 'tc-4',
              name: 'Exact ms=1000 boundary is not > 1000',
              args: ['[ERROR] service=db status=500 ms=2500\r\n[INFO] service=api status=200 ms=1000'],
              expected: 'COUNTS = INFO:1 WARN:0 ERROR:1\nINCIDENTS = db:2500ms',
            },
            {
              id: 'tc-5',
              name: 'WARN 429 fast response is not an incident',
              args: ['[WARN] service=queue status=429 ms=300'],
              expected: 'COUNTS = INFO:0 WARN:1 ERROR:0\nINCIDENTS = NONE',
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'INFO at 1001ms and ERROR at 400 status both trigger',
              args: ['[INFO] service=edge status=200 ms=1001\n[ERROR] service=worker status=400 ms=15'],
              expected: 'COUNTS = INFO:1 WARN:0 ERROR:1\nINCIDENTS = edge:1001ms,worker:15ms',
              hidden: true,
            },
          ],
        },
      ],
    },
    {
      id: 's2-p3',
      number: 3,
      title: 'Immutable Array Pipelines (map, filter, reduce)',
      subtitle: 'Non-mutating filtering, windowed averages, grouped reductions, and multi-key tie-breakers',
      conceptSummary: `In TypeScript, typing input arrays as \`readonly T[]\` lets the compiler guard against accidental in-place mutations like \`.sort()\`, \`.reverse()\`, or \`.splice()\`.

- **Copy Before Sorting:** Always clone with \`[...items].sort(...)\` so caller state remains untouched.
- **Immutability Checks:** Every test in this phase verifies at runtime that input arguments were not mutated in place!`,
      challenges: [
        {
          id: 's2-p3-c1',
          title: 'Top-K Qualified Scores',
          style: 'leetcode',
          difficulty: 'easy',
          description: `### Problem

Given \`scores: readonly number[]\`, \`minScore\`, and \`k\`:

1. Keep only scores \`>= minScore\`.
2. Sort qualifying scores in **descending** order.
3. Return at most the top \`k\` scores (\`k <= 0\` returns \`[]\`).
4. **Never mutate** the input \`scores\` array.

### Example

- \`topQualifiedScores([72, 95, 88, 60, 95, 81], 80, 3)\` → \`[95, 95, 88]\``,
          tags: ['Immutable Arrays', 'filter', 'Copy-Before-Sort'],
          hints: [
            'Guard `if (k <= 0) return [];`.',
            '`scores.filter((s) => s >= minScore)` creates a fresh array that you can safely `.sort((a, b) => b - a)` and `.slice(0, k)`.',
          ],
          entryFunction: 'topQualifiedScores',
          playgroundInput: '[[72, 95, 88, 60, 95, 81], 80, 3]',
          starterCode: `export function topQualifiedScores(
  scores: readonly number[],
  minScore: number,
  k: number
): number[] {
  void scores;
  void minScore;
  void k;
  return [];
}
`,
          referenceSolution: `export function topQualifiedScores(
  scores: readonly number[],
  minScore: number,
  k: number
): number[] {
  if (k <= 0) {
    return [];
  }

  return scores
    .filter((score) => score >= minScore)
    .sort((a, b) => b - a)
    .slice(0, k);
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Top 3 qualifying scores with duplicate max',
              args: [[72, 95, 88, 60, 95, 81], 80, 3],
              expected: [95, 95, 88],
              checkImmutability: true,
            },
            {
              id: 'tc-2',
              name: 'Fewer qualified items than k returns all qualified',
              args: [[50, 82, 40, 90], 75, 5],
              expected: [90, 82],
              checkImmutability: true,
            },
            {
              id: 'tc-3',
              name: 'Zero k returns empty array',
              args: [[99, 100], 50, 0],
              expected: [],
              checkImmutability: true,
            },
            {
              id: 'tc-4',
              name: 'Numeric sort handles multi-digit numbers (100 > 20)',
              args: [[20, 100, 9, 85], 5, 3],
              expected: [100, 85, 20],
              checkImmutability: true,
            },
            {
              id: 'tc-5',
              name: 'No scores meet threshold',
              args: [[10, 20, 30], 50, 2],
              expected: [],
              checkImmutability: true,
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Negative scores sorted descending',
              args: [[-10, -3, -25, -1], -15, 2],
              expected: [-1, -3],
              checkImmutability: true,
              hidden: true,
            },
          ],
        },
        {
          id: 's2-p3-c2',
          title: 'Simple Moving Average Pipeline',
          style: 'leetcode',
          difficulty: 'easy',
          description: `### Problem

Compute the simple moving average over \`values: readonly number[]\` with window length \`windowSize\`:

- If \`windowSize <= 0\` or \`values.length < windowSize\`, return \`[]\`.
- Otherwise return an array of length \`values.length - windowSize + 1\`, where entry \`i\` is the arithmetic mean of \`values[i .. i + windowSize - 1]\` rounded to **2 decimal places** (\`Math.round(avg * 100) / 100\`).
- Do not mutate \`values\`.

### Example

- \`movingAverage([10, 20, 30, 40, 50], 3)\` → \`[20, 30, 40]\``,
          tags: ['Immutable Arrays', 'Windowed Reduce', 'Precision'],
          hints: [
            'Check `windowSize <= 0 || values.length < windowSize` first.',
            'You can compute the initial window sum and slide it in O(n), or map over window start indices cleanly.',
          ],
          entryFunction: 'movingAverage',
          playgroundInput: '[[10, 20, 30, 40, 50], 3]',
          starterCode: `export function movingAverage(
  values: readonly number[],
  windowSize: number
): number[] {
  void values;
  void windowSize;
  return [];
}
`,
          referenceSolution: `export function movingAverage(
  values: readonly number[],
  windowSize: number
): number[] {
  if (windowSize <= 0 || values.length < windowSize) {
    return [];
  }

  const result: number[] = [];
  let windowSum = 0;

  for (let i = 0; i < windowSize; i++) {
    windowSum += values[i];
  }
  result.push(Math.round((windowSum / windowSize) * 100) / 100);

  for (let i = windowSize; i < values.length; i++) {
    windowSum += values[i] - values[i - windowSize];
    result.push(Math.round((windowSum / windowSize) * 100) / 100);
  }

  return result;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: '3-element window over 5 values',
              args: [[10, 20, 30, 40, 50], 3],
              expected: [20, 30, 40],
              checkImmutability: true,
            },
            {
              id: 'tc-2',
              name: '2-element window with half steps',
              args: [[1, 2, 4], 2],
              expected: [1.5, 3],
              checkImmutability: true,
            },
            {
              id: 'tc-3',
              name: 'Repeating decimal rounds to 2 places',
              args: [[1, 2, 2], 3],
              expected: [1.67],
              checkImmutability: true,
            },
            {
              id: 'tc-4',
              name: 'Window larger than input returns empty array',
              args: [[5, 10], 3],
              expected: [],
              checkImmutability: true,
            },
            {
              id: 'tc-5',
              name: 'Non-positive window size returns empty array',
              args: [[10, 20, 30], 0],
              expected: [],
              checkImmutability: true,
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Signed values cancel accurately',
              args: [[-5, 5, 15, -5], 2],
              expected: [0, 10, 5],
              checkImmutability: true,
              hidden: true,
            },
          ],
        },
        {
          id: 's2-p3-c3',
          title: 'Category Revenue Rollup',
          style: 'leetcode',
          difficulty: 'easy',
          description: `### Problem

Aggregate net revenue per category from \`sales: readonly SaleRecord[]\`:

- Ignore any sale where \`refunded === true\` or \`amountCents <= 0\`.
- Sum \`amountCents\` grouped by \`category\` into a \`Record<string, number>\`.
- Categories with zero qualifying sales must **not** appear as keys in the returned object.
- Do not mutate \`sales\` or its objects.

### Example

\`\`\`ts
rollupCategoryTotals([
  { category: 'books', amountCents: 1500 },
  { category: 'books', amountCents: 2000, refunded: true },
  { category: 'tools', amountCents: 3200 },
]);
// => { books: 1500, tools: 3200 }
\`\`\``,
          tags: ['Array.reduce', 'Record<K, V>', 'Immutability'],
          hints: [
            'Filter valid sales (`!s.refunded && s.amountCents > 0`) and reduce into `acc: Record<string, number>`.',
            'Update each category total with `acc[sale.category] = (acc[sale.category] ?? 0) + sale.amountCents`.',
          ],
          entryFunction: 'rollupCategoryTotals',
          playgroundInput:
            '[[{"category":"books","amountCents":1500},{"category":"books","amountCents":2000,"refunded":true},{"category":"tools","amountCents":3200}]]',
          starterCode: `export interface SaleRecord {
  readonly category: string;
  readonly amountCents: number;
  readonly refunded?: boolean;
}

export function rollupCategoryTotals(
  sales: readonly SaleRecord[]
): Record<string, number> {
  void sales;
  return {};
}
`,
          referenceSolution: `export interface SaleRecord {
  readonly category: string;
  readonly amountCents: number;
  readonly refunded?: boolean;
}

export function rollupCategoryTotals(
  sales: readonly SaleRecord[]
): Record<string, number> {
  return sales.reduce<Record<string, number>>((acc, sale) => {
    if (sale.refunded || sale.amountCents <= 0) {
      return acc;
    }
    acc[sale.category] = (acc[sale.category] ?? 0) + sale.amountCents;
    return acc;
  }, {});
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Sums active sales and skips refunded items',
              args: [
                [
                  { category: 'books', amountCents: 1500 },
                  { category: 'books', amountCents: 2000, refunded: true },
                  { category: 'tools', amountCents: 3200 },
                  { category: 'books', amountCents: 500 },
                ],
              ],
              expected: { books: 2000, tools: 3200 },
              checkImmutability: true,
            },
            {
              id: 'tc-2',
              name: 'Category with only refunded items is omitted',
              args: [
                [
                  { category: 'audio', amountCents: 9900, refunded: true },
                  { category: 'cables', amountCents: 1200, refunded: false },
                ],
              ],
              expected: { cables: 1200 },
              checkImmutability: true,
            },
            {
              id: 'tc-3',
              name: 'Empty sales list returns empty object',
              args: [[]],
              expected: {},
              checkImmutability: true,
            },
            {
              id: 'tc-4',
              name: 'Zero and negative amounts are ignored',
              args: [
                [
                  { category: 'promo', amountCents: 0 },
                  { category: 'adj', amountCents: -500 },
                  { category: 'cloud', amountCents: 4500 },
                ],
              ],
              expected: { cloud: 4500 },
              checkImmutability: true,
            },
            {
              id: 'tc-5',
              name: 'Multiple categories accumulate accurately',
              args: [
                [
                  { category: 'a', amountCents: 100 },
                  { category: 'b', amountCents: 200 },
                  { category: 'a', amountCents: 300 },
                  { category: 'b', amountCents: 400 },
                ],
              ],
              expected: { a: 400, b: 600 },
              checkImmutability: true,
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'All refunded returns empty object',
              args: [[{ category: 'x', amountCents: 1000, refunded: true }]],
              expected: {},
              checkImmutability: true,
              hidden: true,
            },
          ],
        },
        {
          id: 's2-p3-c4',
          title: 'Immutable Multi-Key Task Sorter',
          style: 'leetcode',
          difficulty: 'medium',
          description: `### Problem

Return a **new** sorted array of \`TaskItem\` objects without mutating \`tasks\`:

1. **Primary key:** \`priority\` ascending (\`1\` = highest urgency comes before \`2\`, then \`3\`).
2. **First tie-breaker:** \`estimateMinutes\` ascending (shorter tasks first).
3. **Second tie-breaker:** \`id\` ascending in standard lexicographical code-point order (\`a.id < b.id ? -1 : a.id > b.id ? 1 : 0\`).

### Example

- Priority \`1\` (30m) comes before Priority \`2\` (5m); two Priority \`1\` (15m) tasks sort by \`id\` (\`'T-01'\` before \`'T-02'\`).`,
          tags: ['Multi-Key Sort', 'Immutability', 'Comparators'],
          hints: [
            'Clone first via `[...tasks].sort((a, b) => ...)` so `tasks` is never mutated.',
            'Chain comparator differences: `if (a.priority !== b.priority) return a.priority - b.priority;` and so on.',
          ],
          entryFunction: 'sortTasksImmutably',
          playgroundInput:
            '[[{"id":"T-02","priority":1,"estimateMinutes":15},{"id":"T-01","priority":1,"estimateMinutes":15},{"id":"T-03","priority":2,"estimateMinutes":5}]]',
          starterCode: `export interface TaskItem {
  readonly id: string;
  readonly priority: 1 | 2 | 3;
  readonly estimateMinutes: number;
}

export function sortTasksImmutably(tasks: readonly TaskItem[]): TaskItem[] {
  void tasks;
  return [];
}
`,
          referenceSolution: `export interface TaskItem {
  readonly id: string;
  readonly priority: 1 | 2 | 3;
  readonly estimateMinutes: number;
}

export function sortTasksImmutably(tasks: readonly TaskItem[]): TaskItem[] {
  return [...tasks].sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    if (a.estimateMinutes !== b.estimateMinutes) {
      return a.estimateMinutes - b.estimateMinutes;
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Orders by priority, then estimate, then id',
              args: [
                [
                  { id: 'T-02', priority: 1, estimateMinutes: 15 },
                  { id: 'T-04', priority: 2, estimateMinutes: 5 },
                  { id: 'T-01', priority: 1, estimateMinutes: 15 },
                  { id: 'T-03', priority: 1, estimateMinutes: 10 },
                ],
              ],
              expected: [
                { id: 'T-03', priority: 1, estimateMinutes: 10 },
                { id: 'T-01', priority: 1, estimateMinutes: 15 },
                { id: 'T-02', priority: 1, estimateMinutes: 15 },
                { id: 'T-04', priority: 2, estimateMinutes: 5 },
              ],
              checkImmutability: true,
            },
            {
              id: 'tc-2',
              name: 'All three priority levels',
              args: [
                [
                  { id: 'C', priority: 3, estimateMinutes: 1 },
                  { id: 'B', priority: 2, estimateMinutes: 1 },
                  { id: 'A', priority: 1, estimateMinutes: 1 },
                ],
              ],
              expected: [
                { id: 'A', priority: 1, estimateMinutes: 1 },
                { id: 'B', priority: 2, estimateMinutes: 1 },
                { id: 'C', priority: 3, estimateMinutes: 1 },
              ],
              checkImmutability: true,
            },
            {
              id: 'tc-3',
              name: 'Empty input returns empty array',
              args: [[]],
              expected: [],
              checkImmutability: true,
            },
            {
              id: 'tc-4',
              name: 'Same priority sorts shorter estimates first',
              args: [
                [
                  { id: 'A', priority: 2, estimateMinutes: 60 },
                  { id: 'B', priority: 2, estimateMinutes: 20 },
                  { id: 'C', priority: 2, estimateMinutes: 45 },
                ],
              ],
              expected: [
                { id: 'B', priority: 2, estimateMinutes: 20 },
                { id: 'C', priority: 2, estimateMinutes: 45 },
                { id: 'A', priority: 2, estimateMinutes: 60 },
              ],
              checkImmutability: true,
            },
            {
              id: 'tc-5',
              name: 'Lexicographical ID tie-breaker across four tied tasks',
              args: [
                [
                  { id: 'task-d', priority: 3, estimateMinutes: 30 },
                  { id: 'task-a', priority: 3, estimateMinutes: 30 },
                  { id: 'task-c', priority: 3, estimateMinutes: 30 },
                  { id: 'task-b', priority: 3, estimateMinutes: 30 },
                ],
              ],
              expected: [
                { id: 'task-a', priority: 3, estimateMinutes: 30 },
                { id: 'task-b', priority: 3, estimateMinutes: 30 },
                { id: 'task-c', priority: 3, estimateMinutes: 30 },
                { id: 'task-d', priority: 3, estimateMinutes: 30 },
              ],
              checkImmutability: true,
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Single task returns fresh array copy',
              args: [[{ id: 'SOLO', priority: 1, estimateMinutes: 5 }]],
              expected: [{ id: 'SOLO', priority: 1, estimateMinutes: 5 }],
              checkImmutability: true,
              hidden: true,
            },
          ],
        },
      ],
    },
    {
      id: 's2-p4',
      number: 4,
      title: 'Two Pointers & Sliding Window on Typed Arrays',
      subtitle: 'Linear-time window expansion/contraction, opposite-end pointers, and O(n + m) stream merging',
      conceptSummary: `Two-pointer and sliding-window techniques turn naive \`O(n^2)\` nested subarray scans into crisp \`O(n)\` passes.

- **Dynamic Sliding Window:** Advance \`right\` each step to grow the window, and advance \`left\` inside a \`while\` loop whenever the window invariant is violated.
- **Sorted Two Pointers:** Exploit sorted order from opposite ends (\`left = 0, right = n - 1\`) or across two sorted streams (\`i\`, \`j\`).`,
      challenges: [
        {
          id: 's2-p4-c1',
          title: 'Longest Distinct Event Window',
          style: 'leetcode',
          difficulty: 'medium',
          description: `### Problem

Given \`events: readonly string[]\`, return the length of the **longest contiguous subarray** containing no duplicate event strings.

### Examples

- \`longestDistinctWindow(['login', 'view', 'cart', 'view', 'checkout', 'logout'])\` → \`4\` (\`['cart', 'view', 'checkout', 'logout']\`)
- \`longestDistinctWindow(['ping', 'ping', 'ping'])\` → \`1\``,
          tags: ['Sliding Window', 'Map / Set', 'Linear Time'],
          hints: [
            'Maintain `left = 0` and a `Map<string, number>` storing the most recent index of each event.',
            'When `lastSeen.get(ev)` is `>= left`, jump `left = prevIdx + 1` and update `best = Math.max(best, right - left + 1)`.',
          ],
          entryFunction: 'longestDistinctWindow',
          playgroundInput: '[["login", "view", "cart", "view", "checkout", "logout"]]',
          starterCode: `export function longestDistinctWindow(events: readonly string[]): number {
  void events;
  return 0;
}
`,
          referenceSolution: `export function longestDistinctWindow(events: readonly string[]): number {
  const lastSeen = new Map<string, number>();
  let left = 0;
  let best = 0;

  for (let right = 0; right < events.length; right++) {
    const ev = events[right];
    const prevIdx = lastSeen.get(ev);
    if (prevIdx !== undefined && prevIdx >= left) {
      left = prevIdx + 1;
    }
    lastSeen.set(ev, right);
    const len = right - left + 1;
    if (len > best) {
      best = len;
    }
  }

  return best;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Session trace with repeated view event',
              args: [['login', 'view', 'cart', 'view', 'checkout', 'logout']],
              expected: 4,
              checkImmutability: true,
            },
            {
              id: 'tc-2',
              name: 'All identical events have window length 1',
              args: [['ping', 'ping', 'ping']],
              expected: 1,
              checkImmutability: true,
            },
            {
              id: 'tc-3',
              name: 'Empty array returns 0',
              args: [[]],
              expected: 0,
              checkImmutability: true,
            },
            {
              id: 'tc-4',
              name: 'All unique events returns full length',
              args: [['a', 'b', 'c', 'd']],
              expected: 4,
              checkImmutability: true,
            },
            {
              id: 'tc-5',
              name: 'Repeated cycles with 4-unique peak',
              args: [['a', 'b', 'c', 'a', 'b', 'c', 'd', 'b']],
              expected: 4,
              checkImmutability: true,
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Stale duplicate before left pointer does not shrink window backward',
              args: [['x', 'y', 'y', 'x', 'z']],
              expected: 3,
              checkImmutability: true,
              hidden: true,
            },
          ],
        },
        {
          id: 's2-p4-c2',
          title: 'Sorted Pair Target Indices',
          style: 'leetcode',
          difficulty: 'easy',
          description: `### Problem

Given a non-decreasing array \`sortedNums: readonly number[]\` and \`target: number\`, use inward two pointers (\`left = 0\`, \`right = sortedNums.length - 1\`) to find a pair of indices \`[left, right]\` (\`left < right\`) such that \`sortedNums[left] + sortedNums[right] === target\`.

Return \`null\` if no such pair exists.

### Examples

- \`findSortedPairSum([2, 5, 9, 14, 21], 19)\` → \`[1, 3]\` (\`5 + 14 = 19\`)
- \`findSortedPairSum([1, 3, 6, 10], 20)\` → \`null\``,
          tags: ['Two Pointers', 'Sorted Arrays', 'Tuples'],
          hints: [
            'While `left < right`, compare `sum = sortedNums[left] + sortedNums[right]` to `target`.',
            'If `sum < target`, increment `left`; if `sum > target`, decrement `right`.',
          ],
          entryFunction: 'findSortedPairSum',
          playgroundInput: '[[2, 5, 9, 14, 21], 19]',
          starterCode: `export function findSortedPairSum(
  sortedNums: readonly number[],
  target: number
): [number, number] | null {
  void sortedNums;
  void target;
  return null;
}
`,
          referenceSolution: `export function findSortedPairSum(
  sortedNums: readonly number[],
  target: number
): [number, number] | null {
  let left = 0;
  let right = sortedNums.length - 1;

  while (left < right) {
    const sum = sortedNums[left] + sortedNums[right];
    if (sum === target) {
      return [left, right];
    }
    if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return null;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Finds interior pair [1, 3]',
              args: [[2, 5, 9, 14, 21], 19],
              expected: [1, 3],
              checkImmutability: true,
            },
            {
              id: 'tc-2',
              name: 'Handles negative numbers across zero',
              args: [[-8, -3, 0, 4, 11], 3],
              expected: [0, 4],
              checkImmutability: true,
            },
            {
              id: 'tc-3',
              name: 'Returns null when target is unreachable',
              args: [[1, 3, 6, 10], 20],
              expected: null,
              checkImmutability: true,
            },
            {
              id: 'tc-4',
              name: 'Duplicate values summing to target',
              args: [[5, 5], 10],
              expected: [0, 1],
              checkImmutability: true,
            },
            {
              id: 'tc-5',
              name: 'Single element cannot pair with itself',
              args: [[4], 8],
              expected: null,
              checkImmutability: true,
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Negative target sum',
              args: [[-10, -5, -2, 1, 7], -7],
              expected: [1, 2],
              checkImmutability: true,
              hidden: true,
            },
          ],
        },
        {
          id: 's2-p4-c3',
          title: 'Max Consecutive Days Within Budget',
          style: 'leetcode',
          difficulty: 'medium',
          description: `### Problem

Given an array of non-negative \`dailyCosts: readonly number[]\` and a non-negative \`maxBudget: number\`, return the maximum length of a contiguous subarray of days whose total cost is \`<= maxBudget\`.

### Examples

- \`maxDaysWithinBudget([4, 1, 2, 1, 3, 6], 8)\` → \`4\` (\`[4, 1, 2, 1]\` costs \`8\`)
- \`maxDaysWithinBudget([10, 12, 15], 5)\` → \`0\``,
          tags: ['Sliding Window', 'Subarray Sum', 'Optimization'],
          hints: [
            'Since all `dailyCosts` are non-negative, adding `dailyCosts[right]` grows `windowSum` monotonically and subtracting `dailyCosts[left++]` shrinks it.',
            'Shrink `while (windowSum > maxBudget && left <= right)` before recording `right - left + 1`.',
          ],
          entryFunction: 'maxDaysWithinBudget',
          playgroundInput: '[[4, 1, 2, 1, 3, 6], 8]',
          starterCode: `export function maxDaysWithinBudget(
  dailyCosts: readonly number[],
  maxBudget: number
): number {
  void dailyCosts;
  void maxBudget;
  return 0;
}
`,
          referenceSolution: `export function maxDaysWithinBudget(
  dailyCosts: readonly number[],
  maxBudget: number
): number {
  let left = 0;
  let windowSum = 0;
  let maxLen = 0;

  for (let right = 0; right < dailyCosts.length; right++) {
    windowSum += dailyCosts[right];
    while (windowSum > maxBudget && left <= right) {
      windowSum -= dailyCosts[left];
      left++;
    }
    const len = right - left + 1;
    if (len > maxLen) {
      maxLen = len;
    }
  }

  return maxLen;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Finds 4-day window summing to exact budget 8',
              args: [[4, 1, 2, 1, 3, 6], 8],
              expected: 4,
              checkImmutability: true,
            },
            {
              id: 'tc-2',
              name: 'Every single day exceeds budget -> 0',
              args: [[10, 12, 15], 5],
              expected: 0,
              checkImmutability: true,
            },
            {
              id: 'tc-3',
              name: 'Entire array fits within budget',
              args: [[2, 2, 2, 2], 10],
              expected: 4,
              checkImmutability: true,
            },
            {
              id: 'tc-4',
              name: 'Empty cost array returns 0',
              args: [[], 100],
              expected: 0,
              checkImmutability: true,
            },
            {
              id: 'tc-5',
              name: 'Zero-cost free-tier days fit zero budget',
              args: [[0, 0, 5, 0], 0],
              expected: 2,
              checkImmutability: true,
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Cheap valley flanked by expensive spikes',
              args: [[8, 1, 1, 1, 1, 8], 5],
              expected: 4,
              checkImmutability: true,
              hidden: true,
            },
          ],
        },
        {
          id: 's2-p4-c4',
          title: 'Deduplicated Sorted Stream Merge',
          style: 'leetcode',
          difficulty: 'easy',
          description: `### Problem

Merge two ascending-sorted timestamp arrays \`streamA\` and \`streamB\` into a single ascending-sorted array with **all duplicates removed** in \`O(n + m)\` time.

> **Constraint:** Calling built-in \`.sort()\` is forbidden by AST verification—use two pointers!

### Example

- \`mergeTimestampStreams([100, 200, 400], [150, 200, 500])\` → \`[100, 150, 200, 400, 500]\``,
          tags: ['Two Pointers', 'Merge Step', 'Deduplication'],
          hints: [
            'Advance pointers `i` and `j` by picking `val = Math.min(streamA[i], streamB[j])` while both streams have elements remaining.',
            'Before pushing `val` onto `merged`, check `merged.length === 0 || merged[merged.length - 1] !== val` to deduplicate both within-stream and cross-stream duplicates.',
          ],
          entryFunction: 'mergeTimestampStreams',
          astRules: { forbidArraySort: true },
          playgroundInput: '[[100, 200, 400], [150, 200, 500]]',
          starterCode: `export function mergeTimestampStreams(
  streamA: readonly number[],
  streamB: readonly number[]
): number[] {
  void streamA;
  void streamB;
  return [];
}
`,
          referenceSolution: `export function mergeTimestampStreams(
  streamA: readonly number[],
  streamB: readonly number[]
): number[] {
  const merged: number[] = [];
  let i = 0;
  let j = 0;

  const pushUnique = (val: number): void => {
    if (merged.length === 0 || merged[merged.length - 1] !== val) {
      merged.push(val);
    }
  };

  while (i < streamA.length && j < streamB.length) {
    if (streamA[i] <= streamB[j]) {
      pushUnique(streamA[i]);
      i++;
    } else {
      pushUnique(streamB[j]);
      j++;
    }
  }

  while (i < streamA.length) {
    pushUnique(streamA[i]);
    i++;
  }

  while (j < streamB.length) {
    pushUnique(streamB[j]);
    j++;
  }

  return merged;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Interleaves and deduplicates shared timestamp 200',
              args: [[100, 200, 400], [150, 200, 500]],
              expected: [100, 150, 200, 400, 500],
              checkImmutability: true,
            },
            {
              id: 'tc-2',
              name: 'Collapses intra-stream and cross-stream duplicates',
              args: [[10, 10, 20], [10, 30, 30]],
              expected: [10, 20, 30],
              checkImmutability: true,
            },
            {
              id: 'tc-3',
              name: 'First stream empty',
              args: [[], [5, 8, 8]],
              expected: [5, 8],
              checkImmutability: true,
            },
            {
              id: 'tc-4',
              name: 'Second stream empty',
              args: [[1, 2, 3], []],
              expected: [1, 2, 3],
              checkImmutability: true,
            },
            {
              id: 'tc-5',
              name: 'Both streams empty',
              args: [[], []],
              expected: [],
              checkImmutability: true,
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Negative and positive timestamps',
              args: [[-20, 0, 15], [-20, -5, 15, 25]],
              expected: [-20, -5, 0, 15, 25],
              checkImmutability: true,
              hidden: true,
            },
          ],
        },
      ],
    },
    {
      id: 's2-p5',
      number: 5,
      title: '2D Grids, Matrices & Multi-Key Sorting',
      subtitle: 'Rectangular matrix rotation, orthogonal grid neighbors, competition ranking, and indexed array types',
      conceptSummary: `2D grids are typed as \`readonly (readonly T[])[]\` when treated immutably.

- **Coordinate Mapping:** Rotating an \`R x C\` matrix 90° clockwise produces a \`C x R\` matrix where \`rotated[c][R - 1 - r] = matrix[r][c]\`.
- **4-Connected Neighbors:** Use direction deltas \`const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]] as const\` to inspect orthogonal neighbors cleanly without copy-pasted bounds checks.
- **Indexed Element Types:** \`T[number]\` extracts the element union of any array or tuple type.`,
      challenges: [
        {
          id: 's2-p5-c1',
          title: '90-Degree Clockwise Matrix Rotation',
          style: 'leetcode',
          difficulty: 'medium',
          description: `### Problem

Rotate any rectangular \`R x C\` numeric \`matrix\` **90 degrees clockwise** and return a new \`C x R\` 2D array without mutating \`matrix\`.

If \`matrix.length === 0\` or \`matrix[0].length === 0\`, return \`[]\`.

### Example

\`\`\`ts
rotateMatrixClockwise([
  [1, 2, 3],
  [4, 5, 6],
]);
// => [[4, 1], [5, 2], [6, 3]]
\`\`\``,
          tags: ['2D Matrices', 'Coordinate Mapping', 'Immutability'],
          hints: [
            'Let `rows = matrix.length` and `cols = matrix[0].length`; the output has `cols` rows and `rows` columns.',
            'Cell `matrix[r][c]` lands at `out[c][rows - 1 - r]`.',
          ],
          entryFunction: 'rotateMatrixClockwise',
          playgroundInput: '[[[1, 2, 3], [4, 5, 6]]]',
          starterCode: `export function rotateMatrixClockwise(
  matrix: readonly (readonly number[])[]
): number[][] {
  void matrix;
  return [];
}
`,
          referenceSolution: `export function rotateMatrixClockwise(
  matrix: readonly (readonly number[])[]
): number[][] {
  const rows = matrix.length;
  if (rows === 0) return [];
  const cols = matrix[0].length;
  if (cols === 0) return [];

  const rotated: number[][] = Array.from({ length: cols }, () =>
    new Array<number>(rows)
  );

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = matrix[r][c];
    }
  }

  return rotated;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: '3x3 square matrix',
              args: [
                [
                  [1, 2, 3],
                  [4, 5, 6],
                  [7, 8, 9],
                ],
              ],
              expected: [
                [7, 4, 1],
                [8, 5, 2],
                [9, 6, 3],
              ],
              checkImmutability: true,
            },
            {
              id: 'tc-2',
              name: '2x3 rectangular matrix becomes 3x2',
              args: [
                [
                  [1, 2, 3],
                  [4, 5, 6],
                ],
              ],
              expected: [
                [4, 1],
                [5, 2],
                [6, 3],
              ],
              checkImmutability: true,
            },
            {
              id: 'tc-3',
              name: '1x1 singleton matrix',
              args: [[[42]]],
              expected: [[42]],
              checkImmutability: true,
            },
            {
              id: 'tc-4',
              name: 'Empty matrix returns empty array',
              args: [[]],
              expected: [],
              checkImmutability: true,
            },
            {
              id: 'tc-5',
              name: '1x4 row vector rotates into 4x1 column vector',
              args: [[[10, 20, 30, 40]]],
              expected: [[10], [20], [30], [40]],
              checkImmutability: true,
              hidden: true,
            },
            {
              id: 'tc-6',
              name: '2x2 matrix',
              args: [
                [
                  [1, 2],
                  [3, 4],
                ],
              ],
              expected: [
                [3, 1],
                [4, 2],
              ],
              checkImmutability: true,
              hidden: true,
            },
          ],
        },
        {
          id: 's2-p5-c2',
          title: 'Reef Grid Area & Coastline Perimeter',
          style: 'beecrowd',
          difficulty: 'medium',
          description: `### Problem

Given a 2D reef map of \`R\` rows and \`C\` columns where \`'#'\` is reef land and \`'.'\` is open water:

- **Line 1:** \`"R C"\`
- **Next \`R\` lines:** \`C\`-character strings of \`'#'\` and \`'.'\`.

Compute:
- \`AREA\`: total count of \`'#'\` cells.
- \`PERIMETER\`: total count of orthogonal cell edges of \`'#'\` cells that border either \`'.'\` or the outer boundary of the grid.

### Output Format

\`\`\`
AREA = <area>
PERIMETER = <perimeter>
\`\`\`

### Example

**Input:**
\`\`\`
3 4
.##.
.###
..#.
\`\`\`
**Output:**
\`\`\`
AREA = 6
PERIMETER = 12
\`\`\``,
          tags: ['2D Grid', 'Orthogonal Neighbors', 'Beecrowd I/O'],
          hints: [
            'Each `#` cell starts with 4 sides; subtract 1 for each orthogonal neighbor `(nr, nc)` in bounds that is also `#`.',
            'Use a constant delta tuple array `const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]] as const`.',
          ],
          entryFunction: 'solve',
          playgroundInput: '3 4\n.##.\n.###\n..#.',
          starterCode: `export function solve(input: string): string {
  return '';
}
`,
          referenceSolution: `const DIRS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
] as const;

export function solve(input: string): string {
  const lines = input.trim().split(/\\r?\\n/);
  const [rawR, rawC] = lines[0].trim().split(/\\s+/);
  const rows = Number(rawR);
  const cols = Number(rawC);
  const grid = lines.slice(1, 1 + rows).map((l) => l.trim());

  let area = 0;
  let perimeter = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== '#') continue;
      area++;
      let exposed = 4;
      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === '#') {
          exposed--;
        }
      }
      perimeter += exposed;
    }
  }

  return \`AREA = \${area}\\nPERIMETER = \${perimeter}\`;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: '6-cell reef cluster',
              args: ['3 4\n.##.\n.###\n..#.'],
              expected: 'AREA = 6\nPERIMETER = 12',
            },
            {
              id: 'tc-2',
              name: 'Single land cell has perimeter 4',
              args: ['1 1\n#'],
              expected: 'AREA = 1\nPERIMETER = 4',
            },
            {
              id: 'tc-3',
              name: 'All water grid',
              args: ['2 2\n..\n..'],
              expected: 'AREA = 0\nPERIMETER = 0',
            },
            {
              id: 'tc-4',
              name: 'Solid 2x2 block',
              args: ['2 2\n##\n##'],
              expected: 'AREA = 4\nPERIMETER = 8',
            },
            {
              id: 'tc-5',
              name: 'Disconnected islands on single row',
              args: ['1 4\n#.##'],
              expected: 'AREA = 3\nPERIMETER = 10',
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Atoll ring counts inner lagoon coastline too',
              args: ['3 3\n###\n#.#\n###'],
              expected: 'AREA = 8\nPERIMETER = 16',
              hidden: true,
            },
          ],
        },
        {
          id: 's2-p5-c3',
          title: 'Tournament Leaderboard Ranker',
          style: 'leetcode',
          difficulty: 'medium',
          description: `### Problem

Sort competitors immutably and assign **standard competition ranks** (\`1, 2, 2, 4\`):

1. Sort order:
   - \`solved\` **descending**
   - \`penaltyMinutes\` **ascending**
   - \`handle\` **ascending** (\`a.handle < b.handle ? -1 : a.handle > b.handle ? 1 : 0\`)
2. Rank assignment (1-based):
   - Index \`0\` gets \`rank: 1\`.
   - At sorted index \`i > 0\`, if \`solved\` and \`penaltyMinutes\` both equal the previous competitor's \`solved\` and \`penaltyMinutes\`, reuse the previous competitor's \`rank\`; otherwise assign \`rank: i + 1\`.
3. Do not mutate \`entries\`.`,
          tags: ['Multi-Criteria Sort', 'Competition Ranking', 'Immutability'],
          hints: [
            'Clone and sort first (`const sorted = [...entries].sort(...)`), then map/loop to attach `rank`.',
            'Tied competitors differ only in `handle`, so compare `solved` and `penaltyMinutes` against `sorted[i - 1]` when computing `rank`.',
          ],
          entryFunction: 'rankLeaderboard',
          playgroundInput:
            '[[{"handle":"nova","solved":5,"penaltyMinutes":120},{"handle":"ace","solved":5,"penaltyMinutes":120},{"handle":"zen","solved":4,"penaltyMinutes":80}]]',
          starterCode: `export interface CompetitorStats {
  readonly handle: string;
  readonly solved: number;
  readonly penaltyMinutes: number;
}

export interface RankedCompetitor extends CompetitorStats {
  readonly rank: number;
}

export function rankLeaderboard(
  entries: readonly CompetitorStats[]
): RankedCompetitor[] {
  void entries;
  return [];
}
`,
          referenceSolution: `export interface CompetitorStats {
  readonly handle: string;
  readonly solved: number;
  readonly penaltyMinutes: number;
}

export interface RankedCompetitor extends CompetitorStats {
  readonly rank: number;
}

export function rankLeaderboard(
  entries: readonly CompetitorStats[]
): RankedCompetitor[] {
  const sorted = [...entries].sort((a, b) => {
    if (a.solved !== b.solved) {
      return b.solved - a.solved;
    }
    if (a.penaltyMinutes !== b.penaltyMinutes) {
      return a.penaltyMinutes - b.penaltyMinutes;
    }
    return a.handle < b.handle ? -1 : a.handle > b.handle ? 1 : 0;
  });

  const ranked: RankedCompetitor[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const curr = sorted[i];
    const prev = i > 0 ? ranked[i - 1] : undefined;
    const rank =
      prev &&
      prev.solved === curr.solved &&
      prev.penaltyMinutes === curr.penaltyMinutes
        ? prev.rank
        : i + 1;
    ranked.push({ ...curr, rank });
  }

  return ranked;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Shared rank 1 skips rank 2 to rank 3',
              args: [
                [
                  { handle: 'nova', solved: 5, penaltyMinutes: 120 },
                  { handle: 'ace', solved: 5, penaltyMinutes: 120 },
                  { handle: 'zen', solved: 4, penaltyMinutes: 80 },
                ],
              ],
              expected: [
                { handle: 'ace', solved: 5, penaltyMinutes: 120, rank: 1 },
                { handle: 'nova', solved: 5, penaltyMinutes: 120, rank: 1 },
                { handle: 'zen', solved: 4, penaltyMinutes: 80, rank: 3 },
              ],
              checkImmutability: true,
            },
            {
              id: 'tc-2',
              name: 'Same solved count breaks ties by lower penalty',
              args: [
                [
                  { handle: 'bob', solved: 3, penaltyMinutes: 95 },
                  { handle: 'ada', solved: 3, penaltyMinutes: 60 },
                  { handle: 'kai', solved: 3, penaltyMinutes: 75 },
                ],
              ],
              expected: [
                { handle: 'ada', solved: 3, penaltyMinutes: 60, rank: 1 },
                { handle: 'kai', solved: 3, penaltyMinutes: 75, rank: 2 },
                { handle: 'bob', solved: 3, penaltyMinutes: 95, rank: 3 },
              ],
              checkImmutability: true,
            },
            {
              id: 'tc-3',
              name: 'Empty leaderboard',
              args: [[]],
              expected: [],
              checkImmutability: true,
            },
            {
              id: 'tc-4',
              name: 'Mid-table tie produces 1, 2, 2, 4',
              args: [
                [
                  { handle: 'd', solved: 2, penaltyMinutes: 50 },
                  { handle: 'c', solved: 4, penaltyMinutes: 100 },
                  { handle: 'b', solved: 4, penaltyMinutes: 100 },
                  { handle: 'a', solved: 6, penaltyMinutes: 200 },
                ],
              ],
              expected: [
                { handle: 'a', solved: 6, penaltyMinutes: 200, rank: 1 },
                { handle: 'b', solved: 4, penaltyMinutes: 100, rank: 2 },
                { handle: 'c', solved: 4, penaltyMinutes: 100, rank: 2 },
                { handle: 'd', solved: 2, penaltyMinutes: 50, rank: 4 },
              ],
              checkImmutability: true,
            },
            {
              id: 'tc-5',
              name: 'Three-way tie at rank 1 followed by rank 4',
              args: [
                [
                  { handle: 'z', solved: 1, penaltyMinutes: 10 },
                  { handle: 'm', solved: 5, penaltyMinutes: 50 },
                  { handle: 'a', solved: 5, penaltyMinutes: 50 },
                  { handle: 'k', solved: 5, penaltyMinutes: 50 },
                ],
              ],
              expected: [
                { handle: 'a', solved: 5, penaltyMinutes: 50, rank: 1 },
                { handle: 'k', solved: 5, penaltyMinutes: 50, rank: 1 },
                { handle: 'm', solved: 5, penaltyMinutes: 50, rank: 1 },
                { handle: 'z', solved: 1, penaltyMinutes: 10, rank: 4 },
              ],
              checkImmutability: true,
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Zero-solved competitors still sort by penalty and handle',
              args: [
                [
                  { handle: 'beta', solved: 0, penaltyMinutes: 0 },
                  { handle: 'alpha', solved: 0, penaltyMinutes: 0 },
                ],
              ],
              expected: [
                { handle: 'alpha', solved: 0, penaltyMinutes: 0, rank: 1 },
                { handle: 'beta', solved: 0, penaltyMinutes: 0, rank: 1 },
              ],
              checkImmutability: true,
              hidden: true,
            },
          ],
        },
        {
          id: 's2-p5-c4',
          title: 'Array & Matrix Element Type Queries',
          style: 'type-challenge',
          difficulty: 'easy',
          description: `### Problem

Implement two generic indexed-access helper types:

1. \`ElementOf<A extends readonly unknown[]>\`: extracts the element union type of any mutable or \`readonly\` array/tuple \`A\`.
2. \`MatrixCell<M extends readonly (readonly unknown[])[]>\`: extracts the inner cell type of a 2D array or matrix \`M\`.

### Examples

\`\`\`ts
type E = ElementOf<readonly ['N', 'S', 'E', 'W']>; // 'N' | 'S' | 'E' | 'W'
type C = MatrixCell<readonly (readonly ('#' | '.')[])[]>; // '#' | '.'
\`\`\``,
          tags: ['Indexed Access Types', 'Arrays', '2D Matrices'],
          hints: [
            'Indexing an array or tuple type with `number` (`A[number]`) yields the union of its element types.',
            'Chain two numeric index lookups (`M[number][number]`) for 2D matrices.',
          ],
          astRules: { requireGenerics: true },
          starterCode: `export type ElementOf<A extends readonly unknown[]> = unknown;

export type MatrixCell<M extends readonly (readonly unknown[])[]> = unknown;
`,
          referenceSolution: `export type ElementOf<A extends readonly unknown[]> = A[number];

export type MatrixCell<M extends readonly (readonly unknown[])[]> = M[number][number];
`,
          typeAssertionPrelude: `import type { ElementOf, MatrixCell } from './solution';`,
          typeAssertions: [
            {
              id: 'ta-1',
              name: 'ElementOf extracts string[] element type',
              assertion: `Expect<Equal<ElementOf<string[]>, string>>`,
            },
            {
              id: 'ta-2',
              name: 'ElementOf extracts union of tuple literals',
              assertion: `Expect<Equal<ElementOf<readonly [1, 'two', true]>, 1 | 'two' | true>>`,
            },
            {
              id: 'ta-3',
              name: 'MatrixCell extracts number from number[][]',
              assertion: `Expect<Equal<MatrixCell<number[][]>, number>>`,
            },
            {
              id: 'ta-4',
              name: 'MatrixCell extracts literal union from readonly grid',
              assertion: `Expect<Equal<MatrixCell<readonly (readonly ('#' | '.')[])[]>, '#' | '.'>>`,
            },
            {
              id: 'ta-5',
              name: 'ElementOf of empty tuple is never',
              assertion: `Expect<Equal<ElementOf<[]>, never>>`,
              hidden: true,
            },
            {
              id: 'ta-6',
              name: 'MatrixCell works on heterogeneous tuple matrix',
              assertion: `Expect<Equal<MatrixCell<[[1, 2], ['a', 'b']]>, 1 | 2 | 'a' | 'b'>>`,
              hidden: true,
            },
          ],
          testCases: [],
        },
      ],
    },
  ],
  miniProject: {
    id: 's2-mp',
    title: 'Server Log Analyzer & CSV Pipeline',
    subtitle: '4-module access-log parser, fault-tolerant sanitizer, per-endpoint aggregator, and CSV exporter',
    difficulty: 'medium',
    description: `### Mini-Project Overview

Build a 4-file **Server Log Analyzer & CSV Pipeline** that ingests raw HTTP access logs, discards malformed records without crashing, normalizes endpoint paths, computes latency and status-bucket metrics per endpoint, and outputs a deterministic CSV report.

### Specification

1. **Path Normalization (\`parser.ts → normalizeEndpoint\`):**
   - Strip any query string (\`?...\`).
   - Collapse consecutive slashes (\`/+\` → \`'/'\`).
   - Strip a trailing \`'/'\` unless the entire path is \`'/'\` (e.g. \`'/api//orders/?limit=10'\` → \`'/api/orders'\`, \`'///?ping=1'\` → \`'/'\`).
2. **Safe Log Parsing (\`parser.ts → parseLogLine\`):**
   - Expected 5 whitespace-separated tokens: \`"<TIMESTAMP> <METHOD> <RAW_PATH> <STATUS> <LATENCY>ms"\`.
   - Valid \`METHOD\`: \`'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'\`.
   - \`RAW_PATH\` must start with \`'/'\`.
   - \`STATUS\` must parse as an integer in \`100..599\`.
   - Latency token must end with \`'ms'\` (case-sensitive) and its numeric prefix must be a finite number \`>= 0\`.
   - Return \`null\` on **any** malformed line.
3. **Endpoint Aggregation (\`aggregator.ts → summarizeByEndpoint\`):**
   - Group valid entries by normalized \`endpoint\`.
   - Compute \`requests\`, \`avgLatencyMs\` (\`Math.round((sum / requests) * 100) / 100\`), \`maxLatencyMs\`, \`status2xx\` (\`200..299\`), \`status4xx\` (\`400..499\`), \`status5xx\` (\`500..599\`), \`errorCount\` (count of \`status >= 500\`), and \`errorRatePct\` (\`Math.round((errorCount / requests) * 10000) / 100\`).
   - Sort summaries by \`requests\` **descending**, then \`endpoint\` **ascending** (\`a.endpoint < b.endpoint ? -1 : a.endpoint > b.endpoint ? 1 : 0\`).
4. **CSV Export (\`pipeline.ts → analyzeServerLogs\`):**
   - Header line: \`endpoint,requests,avg_ms,max_ms,error_rate_pct,2xx,4xx,5xx\`
   - Format \`avg_ms\` and \`error_rate_pct\` with \`.toFixed(2)\`.
   - If there are zero valid log entries, return just the header line.`,
    architectureNotes: `- \`types.ts\`: \`HttpMethod\`, \`AccessLogEntry\`, and \`EndpointSummary\` contracts.
- \`parser.ts\`: Pure URL path normalizer and fault-tolerant line parser returning \`AccessLogEntry | null\`.
- \`aggregator.ts\`: Grouping, bucket counting, percentage math, and deterministic multi-key sorting.
- \`pipeline.ts\`: End-to-end string-to-CSV pipeline exported via \`analyzeServerLogs\`.`,
    tags: ['Log Parsing', 'Data Aggregation', 'CSV Export', 'Fault Tolerance'],
    hints: [
      'In `parseLogLine`, validate token count (`tokens.length === 5`) first, then check method membership, `rawPath.startsWith("/")`, `Number.isInteger(status)`, and `latencyToken.endsWith("ms")`.',
      'Be careful with `Number("") === 0`: verify the latency prefix before `"ms"` is non-empty before calling `Number(prefix)`!',
      'In `pipeline.ts`, always start the output line array with the CSV header so empty logs naturally return the header line.',
    ],
    entryFile: 'pipeline.ts',
    entryFunction: 'analyzeServerLogs',
    playgroundInput: [
      '2026-03-01T10:00:01Z GET /api/orders?limit=10 200 40ms',
      '2026-03-01T10:00:02Z POST /api/orders/ 500 160ms',
      'MALFORMED LINE',
      '2026-03-01T10:00:03Z GET /health 200 10ms',
    ].join('\n'),
    files: [
      {
        path: 'types.ts',
        description: 'HTTP access log and per-endpoint summary data models',
        starterCode: `export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface AccessLogEntry {
  readonly timestamp: string;
  readonly method: HttpMethod;
  readonly endpoint: string;
  readonly status: number;
  readonly latencyMs: number;
}

export interface EndpointSummary {
  readonly endpoint: string;
  readonly requests: number;
  readonly avgLatencyMs: number;
  readonly maxLatencyMs: number;
  readonly errorCount: number;
  readonly errorRatePct: number;
  readonly status2xx: number;
  readonly status4xx: number;
  readonly status5xx: number;
}
`,
        referenceSolution: `export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface AccessLogEntry {
  readonly timestamp: string;
  readonly method: HttpMethod;
  readonly endpoint: string;
  readonly status: number;
  readonly latencyMs: number;
}

export interface EndpointSummary {
  readonly endpoint: string;
  readonly requests: number;
  readonly avgLatencyMs: number;
  readonly maxLatencyMs: number;
  readonly errorCount: number;
  readonly errorRatePct: number;
  readonly status2xx: number;
  readonly status4xx: number;
  readonly status5xx: number;
}
`,
      },
      {
        path: 'parser.ts',
        description: 'Endpoint path normalizer and resilient single-line log parser',
        starterCode: `import type { AccessLogEntry, HttpMethod } from './types';

const VALID_METHODS: readonly HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export function normalizeEndpoint(rawPath: string): string {
  void VALID_METHODS;
  return rawPath;
}

export function parseLogLine(line: string): AccessLogEntry | null {
  void line;
  return null;
}
`,
        referenceSolution: `import type { AccessLogEntry, HttpMethod } from './types';

const VALID_METHODS: readonly HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

function isHttpMethod(value: string): value is HttpMethod {
  return (VALID_METHODS as readonly string[]).includes(value);
}

export function normalizeEndpoint(rawPath: string): string {
  const withoutQuery = rawPath.split('?')[0];
  const collapsed = withoutQuery.replace(/\\/+$/g, '').replace(/\\/+/g, '/');
  return collapsed.length === 0 ? '/' : collapsed;
}

export function parseLogLine(line: string): AccessLogEntry | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const tokens = trimmed.split(/\\s+/);
  if (tokens.length !== 5) return null;

  const [timestamp, rawMethod, rawPath, rawStatus, rawLatency] = tokens;

  if (!timestamp || !isHttpMethod(rawMethod)) {
    return null;
  }

  if (!rawPath.startsWith('/')) {
    return null;
  }

  const status = Number(rawStatus);
  if (!Number.isInteger(status) || status < 100 || status > 599) {
    return null;
  }

  if (!rawLatency.endsWith('ms')) {
    return null;
  }
  const numPart = rawLatency.slice(0, -2);
  if (numPart.length === 0) {
    return null;
  }
  const latencyMs = Number(numPart);
  if (!Number.isFinite(latencyMs) || latencyMs < 0) {
    return null;
  }

  return {
    timestamp,
    method: rawMethod,
    endpoint: normalizeEndpoint(rawPath),
    status,
    latencyMs,
  };
}
`,
      },
      {
        path: 'aggregator.ts',
        description: 'Groups parsed entries per endpoint and computes sorted metrics',
        starterCode: `import type { AccessLogEntry, EndpointSummary } from './types';

export function summarizeByEndpoint(
  entries: readonly AccessLogEntry[]
): EndpointSummary[] {
  void entries;
  return [];
}
`,
        referenceSolution: `import type { AccessLogEntry, EndpointSummary } from './types';

interface MutableBucket {
  requests: number;
  sumLatency: number;
  maxLatencyMs: number;
  errorCount: number;
  status2xx: number;
  status4xx: number;
  status5xx: number;
}

export function summarizeByEndpoint(
  entries: readonly AccessLogEntry[]
): EndpointSummary[] {
  const map = new Map<string, MutableBucket>();

  for (const entry of entries) {
    let bucket = map.get(entry.endpoint);
    if (!bucket) {
      bucket = {
        requests: 0,
        sumLatency: 0,
        maxLatencyMs: 0,
        errorCount: 0,
        status2xx: 0,
        status4xx: 0,
        status5xx: 0,
      };
      map.set(entry.endpoint, bucket);
    }

    bucket.requests++;
    bucket.sumLatency += entry.latencyMs;
    if (entry.latencyMs > bucket.maxLatencyMs) {
      bucket.maxLatencyMs = entry.latencyMs;
    }
    if (entry.status >= 200 && entry.status < 300) {
      bucket.status2xx++;
    } else if (entry.status >= 400 && entry.status < 500) {
      bucket.status4xx++;
    } else if (entry.status >= 500 && entry.status < 600) {
      bucket.status5xx++;
    }
    if (entry.status >= 500) {
      bucket.errorCount++;
    }
  }

  const summaries: EndpointSummary[] = [];
  for (const [endpoint, b] of map.entries()) {
    summaries.push({
      endpoint,
      requests: b.requests,
      avgLatencyMs: Math.round((b.sumLatency / b.requests) * 100) / 100,
      maxLatencyMs: b.maxLatencyMs,
      errorCount: b.errorCount,
      errorRatePct: Math.round((b.errorCount / b.requests) * 10000) / 100,
      status2xx: b.status2xx,
      status4xx: b.status4xx,
      status5xx: b.status5xx,
    });
  }

  return summaries.sort((a, b) => {
    if (a.requests !== b.requests) {
      return b.requests - a.requests;
    }
    return a.endpoint < b.endpoint ? -1 : a.endpoint > b.endpoint ? 1 : 0;
  });
}
`,
      },
      {
        path: 'pipeline.ts',
        description: 'Orchestrates log parsing, aggregation, and CSV serialization',
        starterCode: `import { parseLogLine } from './parser';
import { summarizeByEndpoint } from './aggregator';

export const CSV_HEADER =
  'endpoint,requests,avg_ms,max_ms,error_rate_pct,2xx,4xx,5xx';

export function analyzeServerLogs(rawLogText: string): string {
  void parseLogLine;
  void summarizeByEndpoint;
  void rawLogText;
  return '';
}
`,
        referenceSolution: `import type { AccessLogEntry } from './types';
import { parseLogLine } from './parser';
import { summarizeByEndpoint } from './aggregator';

export const CSV_HEADER =
  'endpoint,requests,avg_ms,max_ms,error_rate_pct,2xx,4xx,5xx';

export function analyzeServerLogs(rawLogText: string): string {
  const rawLines = rawLogText.split(/\\r?\\n/);
  const validEntries: AccessLogEntry[] = [];

  for (const line of rawLines) {
    const parsed = parseLogLine(line);
    if (parsed !== null) {
      validEntries.push(parsed);
    }
  }

  const summaries = summarizeByEndpoint(validEntries);
  const rows = [CSV_HEADER];

  for (const s of summaries) {
    rows.push(
      [
        s.endpoint,
        String(s.requests),
        s.avgLatencyMs.toFixed(2),
        String(s.maxLatencyMs),
        s.errorRatePct.toFixed(2),
        String(s.status2xx),
        String(s.status4xx),
        String(s.status5xx),
      ].join(',')
    );
  }

  return rows.join('\\n');
}
`,
      },
    ],
    testCases: [
      {
        id: 'mp-tc-1',
        name: 'Normalizes query strings and trailing slashes across endpoints',
        args: [
          [
            '2026-03-01T10:00:01Z GET /api/orders?limit=10 200 40ms',
            '2026-03-01T10:00:02Z POST /api/orders/ 500 160ms',
            '2026-03-01T10:00:03Z GET /health 200 10ms',
          ].join('\n'),
        ],
        expected: [
          'endpoint,requests,avg_ms,max_ms,error_rate_pct,2xx,4xx,5xx',
          '/api/orders,2,100.00,160,50.00,1,0,1',
          '/health,1,10.00,10,0.00,1,0,0',
        ].join('\n'),
      },
      {
        id: 'mp-tc-2',
        name: 'Skips malformed lines safely and treats 4xx separately from 5xx errors',
        args: [
          [
            '2026-03-01T10:00:01Z GET /users 200 25ms',
            'CORRUPTED LINE HERE',
            '2026-03-01T10:00:02Z TRACE /users 200 20ms',
            '2026-03-01T10:00:03Z GET /users 404 15ms',
            '2026-03-01T10:00:04Z DELETE /users 999 10ms',
            '2026-03-01T10:00:05Z PUT /users 200 -5ms',
            '2026-03-01T10:00:06Z PUT users 200 10ms',
            '2026-03-01T10:00:07Z PUT /users 200 ms',
          ].join('\n'),
        ],
        expected: [
          'endpoint,requests,avg_ms,max_ms,error_rate_pct,2xx,4xx,5xx',
          '/users,2,20.00,25,0.00,1,1,0',
        ].join('\n'),
      },
      {
        id: 'mp-tc-3',
        name: 'Tie-breaks equal request counts alphabetically and preserves root /',
        args: [
          [
            '2026-03-01T10:00:01Z GET /metrics 200 12ms',
            '2026-03-01T10:00:02Z GET ///?ping=1 200 5ms',
            '2026-03-01T10:00:03Z POST /auth/login/ 401 30ms',
          ].join('\n'),
        ],
        expected: [
          'endpoint,requests,avg_ms,max_ms,error_rate_pct,2xx,4xx,5xx',
          '/,1,5.00,5,0.00,1,0,0',
          '/auth/login,1,30.00,30,0.00,0,1,0',
          '/metrics,1,12.00,12,0.00,1,0,0',
        ].join('\n'),
      },
      {
        id: 'mp-tc-4',
        name: 'Empty or all-invalid log batch outputs CSV header only',
        args: ['   \nINVALID LOG ENTRY\n'],
        expected: 'endpoint,requests,avg_ms,max_ms,error_rate_pct,2xx,4xx,5xx',
      },
      {
        id: 'mp-tc-5',
        name: 'Rounds fractional avg latency and error rate to 2 decimal places',
        args: [
          [
            '2026-03-01T11:00:01Z GET /search?q=ts 200 10ms',
            '2026-03-01T11:00:02Z GET /search?q=go 503 20ms',
            '2026-03-01T11:00:03Z GET /search?q=rs 200 25ms',
          ].join('\n'),
        ],
        expected: [
          'endpoint,requests,avg_ms,max_ms,error_rate_pct,2xx,4xx,5xx',
          '/search,3,18.33,25,33.33,2,0,1',
        ].join('\n'),
        hidden: true,
      },
      {
        id: 'mp-tc-6',
        name: 'Handles CRLF, PATCH verb, and collapsed internal slashes',
        args: [
          [
            '2026-03-01T12:00:01Z PATCH //v1//items/// 204 14ms',
            '2026-03-01T12:00:02Z DELETE /v1/items?id=9 502 46ms',
          ].join('\r\n'),
        ],
        expected: [
          'endpoint,requests,avg_ms,max_ms,error_rate_pct,2xx,4xx,5xx',
          '/v1/items,2,30.00,46,50.00,1,0,1',
        ].join('\n'),
        hidden: true,
      },
    ],
  },
  exam: {
    id: 's2-exam',
    title: 'Section 2 Cumulative Exam: Foundations, Functions, Strings & Arrays',
    subtitle: 'Integrate Section 1 I/O & precision formatting with Section 2 string parsing, immutable arrays, and sliding windows',
    coveredSections: [1, 2],
    passingScore: 1,
    description:
      'Pass all 4 cumulative tasks covering Sections 1 and 2 with hints disabled. Pay close attention to immutability, formatting precision, and boundary cases.',
    tasks: [
      {
        id: 's2-exam-t1',
        title: 'Tagged Telemetry Batch Filter',
        style: 'beecrowd',
        difficulty: 'medium',
        description: `### Problem

Filter and summarize a multi-line telemetry stream by tag:

- **Line 1:** Target tag (case-insensitive, trimmed, e.g. \`"prod"\`).
- **Remaining lines:** \`"<METRIC_NAME>|<COMMA_TAGS>|<VALUE>"\` (e.g. \`"cpu_load|prod, eu-west|72.4"\`).

A record matches if any tag in \`<COMMA_TAGS>\` (after trimming and lowercasing) equals the lowercased target tag.

### Output Format

If zero records match:
\`\`\`
MATCHED = 0
STATS = NONE
\`\`\`

Otherwise (with \`MIN\`, \`MAX\`, and \`AVG\` formatted to **2 decimal places**):
\`\`\`
MATCHED = <count>
STATS = MIN:<min> MAX:<max> AVG:<avg>
\`\`\``,
        tags: ['String Tokenizing', 'Beecrowd I/O', 'Formatted Stats'],
        hints: [],
        entryFunction: 'solve',
        playgroundInput: 'prod\ncpu_load|prod,eu-west|70.0\ncpu_load|staging,eu-west|20.0\nmem_pct|us-east,PROD|85.5',
        starterCode: `export function solve(input: string): string {
  return '';
}
`,
        referenceSolution: `export function solve(input: string): string {
  const lines = input.trim().split(/\\r?\\n/);
  const targetTag = lines[0].trim().toLowerCase();

  let matched = 0;
  let minVal = Infinity;
  let maxVal = -Infinity;
  let sumVal = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split('|');
    const tags = parts[1].split(',').map((t) => t.trim().toLowerCase());
    const val = Number(parts[2]);

    if (tags.includes(targetTag)) {
      matched++;
      sumVal += val;
      if (val < minVal) minVal = val;
      if (val > maxVal) maxVal = val;
    }
  }

  if (matched === 0) {
    return 'MATCHED = 0\\nSTATS = NONE';
  }

  const avg = sumVal / matched;
  return \`MATCHED = \${matched}\\nSTATS = MIN:\${minVal.toFixed(2)} MAX:\${maxVal.toFixed(2)} AVG:\${avg.toFixed(2)}\`;
}
`,
        testCases: [
          {
            id: 'tc-1',
            name: 'Case-insensitive tag matching across records',
            args: ['prod\ncpu_load|prod,eu-west|70.0\ncpu_load|staging,eu-west|20.0\nmem_pct|us-east,PROD|85.5'],
            expected: 'MATCHED = 2\nSTATS = MIN:70.00 MAX:85.50 AVG:77.75',
          },
          {
            id: 'tc-2',
            name: 'Exact tag token match does not match substring prod-eu',
            args: ['prod\nlatency|prod-eu,canary|42.0'],
            expected: 'MATCHED = 0\nSTATS = NONE',
          },
          {
            id: 'tc-3',
            name: 'Handles spaces around tags and negative values',
            args: ['edge\ntemp| edge , north |-5.5\ntemp|south, edge|4.5'],
            expected: 'MATCHED = 2\nSTATS = MIN:-5.50 MAX:4.50 AVG:-0.50',
          },
          {
            id: 'tc-4',
            name: 'Single matching record',
            args: ['db\niops|primary,db|120'],
            expected: 'MATCHED = 1\nSTATS = MIN:120.00 MAX:120.00 AVG:120.00',
          },
          {
            id: 'tc-5',
            name: 'Header only with zero records',
            args: ['prod'],
            expected: 'MATCHED = 0\nSTATS = NONE',
            hidden: true,
          },
          {
            id: 'tc-6',
            name: 'CRLF input with three matches',
            args: ['gpu\r\nu1|gpu|10\r\nu2|gpu,ml|20\r\nu3|cpu|99\r\nu4|ml,GPU|30'],
            expected: 'MATCHED = 3\nSTATS = MIN:10.00 MAX:30.00 AVG:20.00',
            hidden: true,
          },
        ],
      },
      {
        id: 's2-exam-t2',
        title: 'Immutable Customer Spend Leaderboard',
        style: 'leetcode',
        difficulty: 'medium',
        description: `### Problem

Given \`purchases: readonly RawPurchase[]\` and \`minTotalCents: number\`:

1. Ignore purchases where \`cancelled === true\` or \`cents <= 0\`.
2. Normalize each \`customer\` handle via \`customer.trim().toLowerCase()\` and sum valid \`cents\` per customer.
3. Keep only customers whose total spend is \`>= minTotalCents\`.
4. Sort qualifying customers by total spend **descending**, breaking ties by normalized handle **ascending**.
5. Format each entry as \`"<handle>: $<(totalCents / 100).toFixed(2)>"\`.
6. Do not mutate \`purchases\`.`,
        tags: ['Immutable Pipeline', 'Grouping & Sorting', 'Currency Formatting'],
        hints: [],
        entryFunction: 'topCustomerSummaries',
        playgroundInput:
          '[[{"customer":"Ada","cents":4500},{"customer":"bob","cents":7000},{"customer":" ada ","cents":3000}], 5000]',
        starterCode: `export interface RawPurchase {
  readonly customer: string;
  readonly cents: number;
  readonly cancelled?: boolean;
}

export function topCustomerSummaries(
  purchases: readonly RawPurchase[],
  minTotalCents: number
): string[] {
  void purchases;
  void minTotalCents;
  return [];
}
`,
        referenceSolution: `export interface RawPurchase {
  readonly customer: string;
  readonly cents: number;
  readonly cancelled?: boolean;
}

export function topCustomerSummaries(
  purchases: readonly RawPurchase[],
  minTotalCents: number
): string[] {
  const totals = new Map<string, number>();

  for (const item of purchases) {
    if (item.cancelled || item.cents <= 0) continue;
    const handle = item.customer.trim().toLowerCase();
    if (!handle) continue;
    totals.set(handle, (totals.get(handle) ?? 0) + item.cents);
  }

  return Array.from(totals.entries())
    .filter(([, total]) => total >= minTotalCents)
    .sort((a, b) => {
      if (a[1] !== b[1]) return b[1] - a[1];
      return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
    })
    .map(([handle, total]) => \`\${handle}: $\${(total / 100).toFixed(2)}\`);
}
`,
        testCases: [
          {
            id: 'tc-1',
            name: 'Normalizes handles, aggregates, and sorts descending',
            args: [
              [
                { customer: 'Ada', cents: 4500 },
                { customer: 'bob', cents: 7000 },
                { customer: ' ada ', cents: 3000 },
                { customer: 'bob', cents: 2000, cancelled: true },
              ],
              5000,
            ],
            expected: ['ada: $75.00', 'bob: $70.00'],
            checkImmutability: true,
          },
          {
            id: 'tc-2',
            name: 'Breaks equal-spend ties alphabetically',
            args: [
              [
                { customer: 'zoe', cents: 5000 },
                { customer: 'mia', cents: 5000 },
              ],
              5000,
            ],
            expected: ['mia: $50.00', 'zoe: $50.00'],
            checkImmutability: true,
          },
          {
            id: 'tc-3',
            name: 'Filters out customers below threshold',
            args: [
              [
                { customer: 'leo', cents: 1999 },
                { customer: 'kai', cents: 2000 },
              ],
              2000,
            ],
            expected: ['kai: $20.00'],
            checkImmutability: true,
          },
          {
            id: 'tc-4',
            name: 'Empty input returns empty array',
            args: [[], 100],
            expected: [],
            checkImmutability: true,
          },
          {
            id: 'tc-5',
            name: 'Cancelled and non-positive purchases ignored',
            args: [
              [
                { customer: 'eva', cents: 9000, cancelled: true },
                { customer: 'eva', cents: -500 },
                { customer: 'eva', cents: 1250 },
              ],
              1000,
            ],
            expected: ['eva: $12.50'],
            checkImmutability: true,
            hidden: true,
          },
          {
            id: 'tc-6',
            name: 'Sub-dollar precision formatting',
            args: [[{ customer: 'sam', cents: 5 }], 1],
            expected: ['sam: $0.05'],
            checkImmutability: true,
            hidden: true,
          },
        ],
      },
      {
        id: 's2-exam-t3',
        title: 'Minimum Alert Burst Window',
        style: 'leetcode',
        difficulty: 'medium',
        description: `### Problem

Given an array of non-negative integers \`errorsPerMinute: readonly number[]\` and a positive threshold \`targetErrors: number\`, return the **minimum length** of a contiguous subarray whose sum is \`>= targetErrors\`.

If no contiguous subarray reaches \`targetErrors\`, return \`0\`.

### Examples

- \`minBurstLength([2, 3, 1, 2, 4, 3], 7)\` → \`2\` (\`[4, 3]\` sums to \`7\`)
- \`minBurstLength([1, 1, 1], 10)\` → \`0\``,
        tags: ['Sliding Window', 'Minimum Subarray', 'Immutability'],
        hints: [],
        entryFunction: 'minBurstLength',
        playgroundInput: '[[2, 3, 1, 2, 4, 3], 7]',
        starterCode: `export function minBurstLength(
  errorsPerMinute: readonly number[],
  targetErrors: number
): number {
  void errorsPerMinute;
  void targetErrors;
  return 0;
}
`,
        referenceSolution: `export function minBurstLength(
  errorsPerMinute: readonly number[],
  targetErrors: number
): number {
  let left = 0;
  let windowSum = 0;
  let best = Infinity;

  for (let right = 0; right < errorsPerMinute.length; right++) {
    windowSum += errorsPerMinute[right];
    while (windowSum >= targetErrors && left <= right) {
      const len = right - left + 1;
      if (len < best) {
        best = len;
      }
      windowSum -= errorsPerMinute[left];
      left++;
    }
  }

  return best === Infinity ? 0 : best;
}
`,
        testCases: [
          {
            id: 'tc-1',
            name: 'Shortest burst of length 2 at tail',
            args: [[2, 3, 1, 2, 4, 3], 7],
            expected: 2,
            checkImmutability: true,
          },
          {
            id: 'tc-2',
            name: 'Single spike satisfies threshold in length 1',
            args: [[1, 4, 12, 2], 10],
            expected: 1,
            checkImmutability: true,
          },
          {
            id: 'tc-3',
            name: 'Total sum below threshold returns 0',
            args: [[1, 1, 1], 10],
            expected: 0,
            checkImmutability: true,
          },
          {
            id: 'tc-4',
            name: 'Requires entire array to reach threshold',
            args: [[2, 2, 2, 2], 8],
            expected: 4,
            checkImmutability: true,
          },
          {
            id: 'tc-5',
            name: 'Empty array returns 0',
            args: [[], 5],
            expected: 0,
            checkImmutability: true,
            hidden: true,
          },
          {
            id: 'tc-6',
            name: 'Zero-error minutes interleaved with burst',
            args: [[0, 3, 0, 4, 8, 0], 11],
            expected: 2,
            checkImmutability: true,
            hidden: true,
          },
        ],
      },
      {
        id: 's2-exam-t4',
        title: 'Tuple Tail & Predicate Target Types',
        style: 'type-challenge',
        difficulty: 'medium',
        description: `### Problem

Implement two generic type utilities combining tuple variadic inference and callback parameter inference (without \`any\`):

1. \`LastOfTuple<T extends readonly unknown[]>\`: extracts the type of the **last** element of tuple \`T\`, or \`never\` when \`T\` is empty \`[]\`.
2. \`PredicateTarget<P>\`: if \`P\` matches \`(item: infer T) => boolean\`, extracts \`T\`; otherwise \`never\`.`,
        tags: ['Variadic Tuples', 'Callback Inference', 'Type Challenges'],
        hints: [],
        astRules: { requireGenerics: true },
        starterCode: `export type LastOfTuple<T extends readonly unknown[]> = unknown;

export type PredicateTarget<P> = unknown;
`,
        referenceSolution: `export type LastOfTuple<T extends readonly unknown[]> =
  T extends readonly [...unknown[], infer Last] ? Last : never;

export type PredicateTarget<P> =
  P extends (item: infer T) => boolean ? T : never;
`,
        typeAssertionPrelude: `import type { LastOfTuple, PredicateTarget } from './solution';`,
        typeAssertions: [
          {
            id: 'ta-1',
            name: 'LastOfTuple extracts final element of 3-tuple',
            assertion: `Expect<Equal<LastOfTuple<[string, number, boolean]>, boolean>>`,
          },
          {
            id: 'ta-2',
            name: 'LastOfTuple works on readonly singleton tuple',
            assertion: `Expect<Equal<LastOfTuple<readonly [42]>, 42>>`,
          },
          {
            id: 'ta-3',
            name: 'LastOfTuple of empty tuple is never',
            assertion: `Expect<Equal<LastOfTuple<[]>, never>>`,
          },
          {
            id: 'ta-4',
            name: 'PredicateTarget extracts item type from predicate',
            assertion: `Expect<Equal<PredicateTarget<(user: { id: string }) => boolean>, { id: string }>>`,
          },
          {
            id: 'ta-5',
            name: 'PredicateTarget returns never for non-boolean return function',
            assertion: `Expect<Equal<PredicateTarget<(x: number) => string>, never>>`,
            hidden: true,
          },
          {
            id: 'ta-6',
            name: 'PredicateTarget returns never for primitive non-function',
            assertion: `Expect<Equal<PredicateTarget<string>, never>>`,
            hidden: true,
          },
        ],
        testCases: [],
      },
    ],
  },
};
