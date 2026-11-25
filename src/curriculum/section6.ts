import type { Section } from '../types/curriculum';

export const section6: Section = {
  id: 'section-6',
  number: 6,
  slug: 'advanced-type-level-algorithms',
  title: 'Advanced Type-Level TS & Algorithms',
  subtitle: 'Conditional Inference, Template Literal Parsers, Recursive Types, DP & Graphs',
  accentColor: '#e06c75',
  description:
    'Conquer the summit of TypeScript engineering: distributive conditional types, infer extraction, compile-time URL/query-string parsers, recursive mapped key transformations, dynamic programming, tries, graphs, and a full type-inferring schema validator.',
  phases: [
    {
      id: 's6-p1',
      number: 1,
      title: 'Conditional Types, Distributive Unions & infer',
      subtitle: 'Deconstructing tuples, function signatures, discriminated unions, and nullability at compile time',
      conceptSummary: `### Conditional Types & Distribution Control

TypeScript's type system forms a functional meta-language driven by conditional types \`T extends U ? X : Y\`:

- **Variadic Tuple Recursion**: Pattern-matching \`T extends readonly [infer Head, ...infer Tail]\` lets you walk and transform tuple types element by element.
- **\`infer\` Extraction**: Captures unknown type variables directly inside function parameters, return positions, or nested object properties.
- **Distributive vs Tuple-Wrapped Conditionals**: When \`T\` is a naked type parameter, \`T extends U\` distributes across each union member individually. Wrapping \`[T] extends [U]\` disables distribution so you can inspect the union as a whole (for example in \`IsUnion<T>\`).`,
      challenges: [
        {
          id: 's6-p1-c1',
          title: 'Single-Level Tuple Flattener (FlattenOnce<T>)',
          style: 'type-challenge',
          difficulty: 'medium',
          description: `Implement \`FlattenOnce<T extends readonly unknown[]>\` that flattens array/tuple elements by **at most one nesting level** while preserving exact tuple order and literal element types:

- \`FlattenOnce<[1, [2, 3], [[4]], []]>\` $\\rightarrow$ \`[1, 2, 3, [4]]\`
- Works on \`readonly\` outer and inner tuples, always returning a mutable tuple.`,
          tags: ['Type Challenge', 'Conditional Types', 'Variadic Tuples', 'infer'],
          hints: [
            'Match `T extends readonly [infer Head, ...infer Tail]` recursively.',
            'If `Head extends readonly unknown[]`, spread `[...Head, ...FlattenOnce<Tail>]`; otherwise `[Head, ...FlattenOnce<Tail>]`.',
          ],
          starterCode: `export type FlattenOnce<T extends readonly unknown[]> = T;
`,
          referenceSolution: `export type FlattenOnce<T extends readonly unknown[]> =
  T extends readonly [infer Head, ...infer Tail]
    ? Head extends readonly unknown[]
      ? [...Head, ...FlattenOnce<Tail>]
      : [Head, ...FlattenOnce<Tail>]
    : [];
`,
          astRules: { requireGenerics: true },
          typeAssertionPrelude: `import type { FlattenOnce } from './solution';`,
          typeAssertions: [
            {
              id: 's6-p1-c1-a1',
              name: 'Flattens nested tuples by exactly one level',
              assertion: `Expect<Equal<FlattenOnce<[1, [2, 3], [[4]], []]>, [1, 2, 3, [4]]>>`,
            },
            {
              id: 's6-p1-c1-a2',
              name: 'Preserves already-flat tuples',
              assertion: `Expect<Equal<FlattenOnce<['a', 'b', 'c']>, ['a', 'b', 'c']>>`,
            },
            {
              id: 's6-p1-c1-a3',
              name: 'Handles empty outer tuple and tuples of empty tuples',
              assertion: `Expect<Equal<[FlattenOnce<[]>, FlattenOnce<[[], [], []]>], [[], []]>>`,
            },
            {
              id: 's6-p1-c1-a4',
              name: 'Accepts readonly outer and inner tuples',
              assertion: `Expect<Equal<FlattenOnce<readonly [readonly ['x', 'y'], 'z']>, ['x', 'y', 'z']>>`,
            },
            {
              id: 's6-p1-c1-a5',
              name: 'Hidden: Preserves union element types without flattening non-array objects',
              hidden: true,
              assertion: `Expect<Equal<FlattenOnce<[{ a: 1 }, [true | false]]>, [{ a: 1 }, true | false]>>`,
            },
            {
              id: 's6-p1-c1-a6',
              name: 'Hidden: Deeply nested singleton [[[99]]] unwraps one layer to [[99]]',
              hidden: true,
              assertion: `Expect<Equal<FlattenOnce<[[[99]]]>, [[99]]>>`,
            },
          ],
          testCases: [],
        },
        {
          id: 's6-p1-c2',
          title: 'Signature Deconstructor (FunctionParamsAndReturn<F>)',
          style: 'type-challenge',
          difficulty: 'medium',
          description: `Implement \`FunctionParamsAndReturn<F>\` for any function signature \`F extends (...args: never) => unknown\` (without \`any\`):

- Extracts \`{ params: P; returnType: R; arity: P['length'] }\`.
- Distributes over unions of function types cleanly!`,
          tags: ['Type Challenge', 'infer', 'Function Signatures', 'Distributive Unions'],
          hints: [
            'Constrain F with `F extends (...args: never) => unknown`.',
            'Use a naked conditional `F extends (...args: infer P) => infer R ? { params: P; returnType: R; arity: P["length"] } : never`.',
          ],
          starterCode: `export type FunctionParamsAndReturn<F> = unknown;
`,
          referenceSolution: `export type FunctionParamsAndReturn<F extends (...args: never) => unknown> =
  F extends (...args: infer P) => infer R
    ? {
        params: P;
        returnType: R;
        arity: P['length'];
      }
    : never;
`,
          astRules: { requireGenerics: true },
          typeAssertionPrelude: `import type { FunctionParamsAndReturn } from './solution';

type AddFn = (a: number, b: number) => number;
type GreetFn = (name: string, title?: string) => string;
type ThunkFn = () => void;`,
          typeAssertions: [
            {
              id: 's6-p1-c2-a1',
              name: 'Extracts parameter tuple, returnType, and exact numeric arity',
              assertion: `Expect<Equal<FunctionParamsAndReturn<AddFn>, { params: [a: number, b: number]; returnType: number; arity: 2 }>>`,
            },
            {
              id: 's6-p1-c2-a2',
              name: 'Reflects optional parameters as union arity (1 | 2)',
              assertion: `Expect<Equal<FunctionParamsAndReturn<GreetFn>, { params: [name: string, title?: string]; returnType: string; arity: 1 | 2 }>>`,
            },
            {
              id: 's6-p1-c2-a3',
              name: 'Handles zero-argument void thunks',
              assertion: `Expect<Equal<FunctionParamsAndReturn<ThunkFn>, { params: []; returnType: void; arity: 0 }>>`,
            },
            {
              id: 's6-p1-c2-a4',
              name: 'Distributes across unions of function signatures',
              assertion: `Expect<Equal<
                FunctionParamsAndReturn<(() => boolean) | ((id: string) => number)>,
                | { params: []; returnType: boolean; arity: 0 }
                | { params: [id: string]; returnType: number; arity: 1 }
              >>`,
            },
            {
              id: 's6-p1-c2-a5',
              name: 'Hidden: Handles variadic rest parameters with number arity',
              hidden: true,
              assertion: `Expect<Equal<FunctionParamsAndReturn<(...nums: number[]) => bigint>, { params: number[]; returnType: bigint; arity: number }>>`,
            },
          ],
          testCases: [],
        },
        {
          id: 's6-p1-c3',
          title: 'Distributive Result Unpacker & Union Detector (UnpackResult & IsUnion)',
          style: 'type-challenge',
          difficulty: 'hard',
          description: `Master both **distributive** and **non-distributive** conditional types by implementing:

1. \`UnpackResult<T>\`: distributes across \`T\`:
   - If a union member matches \`{ ok: true; data: infer D }\`, produce \`D\`.
   - If a union member matches \`{ ok: false; error: unknown }\`, filter it out (\`never\`).
   - Otherwise preserve the member unchanged.
2. \`IsUnion<T>\`: evaluates to \`true\` if \`T\` is a multi-member union (such as \`'a' | 'b'\` or \`boolean\`), and \`false\` for single types and \`never\`.`,
          tags: ['Type Challenge', 'Distributive Unions', 'IsUnion', 'never'],
          hints: [
            'In IsUnion<T, Copy = T>, check `[T] extends [never] ? false : ...` first so `never` returns `false` instead of `never`.',
            'Distribute `T extends Copy` and compare `[Copy] extends [T]`: if `T` was a union, `T` inside the branch is a single member while `Copy` is the full union, so `[Copy] extends [T]` is `false`!',
          ],
          starterCode: `export type UnpackResult<T> = T;

export type IsUnion<T> = false;
`,
          referenceSolution: `export type UnpackResult<T> = T extends { ok: true; data: infer D }
  ? D
  : T extends { ok: false; error: unknown }
    ? never
    : T;

export type IsUnion<T, Copy = T> = [T] extends [never]
  ? false
  : T extends Copy
    ? [Copy] extends [T]
      ? false
      : true
    : never;
`,
          astRules: { requireGenerics: true },
          typeAssertionPrelude: `import type { UnpackResult, IsUnion } from './solution';

type ApiRes =
  | { ok: true; data: { userId: string } }
  | { ok: true; data: number }
  | { ok: false; error: Error };`,
          typeAssertions: [
            {
              id: 's6-p1-c3-a1',
              name: 'UnpackResult extracts ok payloads and filters out error branches',
              assertion: `Expect<Equal<UnpackResult<ApiRes>, { userId: string } | number>>`,
            },
            {
              id: 's6-p1-c3-a2',
              name: 'UnpackResult preserves raw non-Result union members',
              assertion: `Expect<Equal<UnpackResult<{ ok: false; error: string } | 'raw'>, 'raw'>>`,
            },
            {
              id: 's6-p1-c3-a3',
              name: 'IsUnion detects string/number unions and boolean (true | false)',
              assertion: `Expect<Equal<[IsUnion<'a' | 'b'>, IsUnion<boolean>, IsUnion<string | number>], [true, true, true]>>`,
            },
            {
              id: 's6-p1-c3-a4',
              name: 'IsUnion returns false for singletons, tuples, and objects',
              assertion: `Expect<Equal<[IsUnion<string>, IsUnion<[1, 2]>, IsUnion<{ a: string | number }>], [false, false, false]>>`,
            },
            {
              id: 's6-p1-c3-a5',
              name: 'Hidden: IsUnion<never> returns false instead of never',
              hidden: true,
              assertion: `Expect<Equal<IsUnion<never>, false>>`,
            },
            {
              id: 's6-p1-c3-a6',
              name: 'Hidden: UnpackResult on pure error result produces never',
              hidden: true,
              assertion: `Expect<Equal<UnpackResult<{ ok: false; error: 'ENOENT' }>, never>>`,
            },
          ],
          testCases: [],
        },
        {
          id: 's6-p1-c4',
          title: 'Strict Non-Nullable Property Utilities (NonNullableKeys & NonNullableProps)',
          style: 'type-challenge',
          difficulty: 'medium',
          description: `Implement two null-safety utilities:

1. \`NonNullableKeys<T>\`: union of keys \`K extends keyof T\` whose type \`T[K]\` excludes **both** \`null\` and \`undefined\` (optional properties \`prop?: string\` allow \`undefined\`, so they must **not** appear in \`NonNullableKeys<T>\`!).
2. \`NonNullableProps<T>\`: mapped type making every property of \`T\` required (\`-?\`) and stripping \`null | undefined\` from every value via \`NonNullable<T[K]>\`.`,
          tags: ['Type Challenge', 'Nullability', 'Mapped Modifiers', 'keyof'],
          hints: [
            'Use `-?` on the helper mapped type `{ [K in keyof T]-?: ... }[keyof T]` so optional keys do not inject `undefined` when indexing `[keyof T]`.',
            'Test whether `null extends T[K]` or `undefined extends T[K]` before keeping `K`.',
          ],
          starterCode: `export type NonNullableKeys<T> = keyof T;

export type NonNullableProps<T> = T;
`,
          referenceSolution: `export type NonNullableKeys<T> = {
  [K in keyof T]-?: null extends T[K]
    ? never
    : undefined extends T[K]
      ? never
      : K;
}[keyof T];

export type NonNullableProps<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};
`,
          astRules: { requireGenerics: true },
          typeAssertionPrelude: `import type { NonNullableKeys, NonNullableProps } from './solution';

interface AccountProfile {
  id: string;
  age: number;
  nickname?: string;
  deletedAt: Date | null;
  verified: boolean | undefined;
}`,
          typeAssertions: [
            {
              id: 's6-p1-c4-a1',
              name: 'NonNullableKeys keeps only strictly present non-null keys',
              assertion: `Expect<Equal<NonNullableKeys<AccountProfile>, 'id' | 'age'>>`,
            },
            {
              id: 's6-p1-c4-a2',
              name: 'NonNullableProps removes optionality and null/undefined from all fields',
              assertion: `Expect<Equal<NonNullableProps<AccountProfile>, {
                id: string;
                age: number;
                nickname: string;
                deletedAt: Date;
                verified: boolean;
              }>>`,
            },
            {
              id: 's6-p1-c4-a3',
              name: 'Returns never when all keys are nullable or optional',
              assertion: `Expect<Equal<NonNullableKeys<{ a?: number; b: string | null }>, never>>`,
            },
            {
              id: 's6-p1-c4-a4',
              name: 'Preserves readonly modifiers in NonNullableProps',
              assertion: `Expect<Equal<NonNullableProps<{ readonly key?: string | null }>, { readonly key: string }>>`,
            },
            {
              id: 's6-p1-c4-a5',
              name: 'Hidden: Empty interface yields never keys and {} props',
              hidden: true,
              assertion: `Expect<Equal<[NonNullableKeys<{}>, NonNullableProps<{}>], [never, {}]>>`,
            },
          ],
          testCases: [],
        },
      ],
    },
    {
      id: 's6-p2',
      number: 2,
      title: 'Template Literal Types & Compile-Time Parsers',
      subtitle: 'String pattern matching, route parameter extraction, query-string ASTs, and hybrid route builders',
      conceptSummary: `### Compile-Time String Parsing

Template literal types (\`\\\`\${infer Left}-\${infer Right}\\\`\`) turn TypeScript's type checker into a recursive-descent string parser:

- **Case Transformations**: Splitting on delimiters like \`'-'\` or \`'_'\` and applying intrinsic \`Capitalize<S>\` / \`Uncapitalize<S>\` converts identifier conventions statically.
- **Route & Query Parsers**: Frameworks like Express, Hono, and Next.js extract \`:param\` and \`?key=value\` shapes directly from string literals so typos fail at compile time.
- **Hybrid Runtime + Static APIs**: Pairing a template-literal type utility \`RouteParams<Path>\` with a runtime \`buildRoute\` function gives zero-overhead developer ergonomics.`,
      challenges: [
        {
          id: 's6-p2-c1',
          title: 'Compile-Time Kebab-to-Camel Converter (KebabToCamel<S>)',
          style: 'type-challenge',
          difficulty: 'medium',
          description: `Implement \`KebabToCamel<S extends string>\` that converts hyphen-separated strings into \`camelCase\`:

- \`'user-profile-id'\` $\\rightarrow$ \`'userProfileId'\`
- Strips any leading, trailing, or repeated consecutive hyphens cleanly (\`'--data-test--id-'\` $\\rightarrow$ \`'dataTestId'\`).
- Leaves single words without hyphens unchanged (\`'health'\` $\\rightarrow$ \`'health'\`, \`''\` $\\rightarrow$ \`''\`).
- Distributes over string literal unions.`,
          tags: ['Type Challenge', 'Template Literals', 'Capitalize', 'String Parsing'],
          hints: [
            'First strip leading hyphens recursively: `S extends `-${infer Rest}` ? KebabToCamel<Rest> : ...`.',
            'Once the leading word `Head` is matched before `-`, write a helper `CamelAfterHyphen<Tail>` that skips extra `-` characters and capitalizes each subsequent segment.',
          ],
          starterCode: `export type KebabToCamel<S extends string> = S;
`,
          referenceSolution: `type CamelTail<S extends string> = S extends \`-\${infer Rest}\`
  ? CamelTail<Rest>
  : S extends ''
    ? ''
    : S extends \`\${infer Word}-\${infer Rest}\`
      ? \`\${Capitalize<Word>}\${CamelTail<Rest>}\`
      : Capitalize<S>;

export type KebabToCamel<S extends string> = S extends \`-\${infer Rest}\`
  ? KebabToCamel<Rest>
  : S extends \`\${infer First}-\${infer Rest}\`
    ? \`\${First}\${CamelTail<Rest>}\`
    : S;
`,
          astRules: { requireGenerics: true },
          typeAssertionPrelude: `import type { KebabToCamel } from './solution';`,
          typeAssertions: [
            {
              id: 's6-p2-c1-a1',
              name: 'Converts multi-segment kebab-case identifiers',
              assertion: `Expect<Equal<KebabToCamel<'user-profile-id'>, 'userProfileId'>>`,
            },
            {
              id: 's6-p2-c1-a2',
              name: 'Leaves unhyphenated and empty strings unchanged',
              assertion: `Expect<Equal<[KebabToCamel<'single'>, KebabToCamel<''>], ['single', '']>>`,
            },
            {
              id: 's6-p2-c1-a3',
              name: 'Normalizes leading, trailing, and consecutive hyphens',
              assertion: `Expect<Equal<KebabToCamel<'--data--test-id--'>, 'dataTestId'>>`,
            },
            {
              id: 's6-p2-c1-a4',
              name: 'Distributes across string literal unions',
              assertion: `Expect<Equal<KebabToCamel<'max-width' | 'font-size'>, 'maxWidth' | 'fontSize'>>`,
            },
            {
              id: 's6-p2-c1-a5',
              name: 'Hidden: String of only hyphens collapses to empty string',
              hidden: true,
              assertion: `Expect<Equal<KebabToCamel<'---'>, ''>>`,
            },
            {
              id: 's6-p2-c1-a6',
              name: 'Hidden: Handles numeric segments after hyphens',
              hidden: true,
              assertion: `Expect<Equal<KebabToCamel<'oauth-v2-token'>, 'oauthV2Token'>>`,
            },
          ],
          testCases: [],
        },
        {
          id: 's6-p2-c2',
          title: 'URL Route Parameter Extractor (ExtractRouteParams<Path>)',
          style: 'type-challenge',
          difficulty: 'hard',
          description: `Implement \`ExtractRouteParams<Path extends string>\` to parse dynamic URL path templates into a flat parameter object type:

- Required segments \`:param\` become \`{ param: string }\`.
- Optional segments \`:param?\` become \`{ param?: string }\`.
- Static segments (\`'orgs'\`, \`'repos'\`, \`''\`) produce no keys (\`{}\`).
- Example: \`ExtractRouteParams<'/orgs/:orgId/repos/:repoId/tab/:tab?'>\` $\\rightarrow$ \`{ orgId: string; repoId: string; tab?: string }\`.`,
          tags: ['Type Challenge', 'Template Literals', 'Routing', 'Mapped Types'],
          hints: [
            'Split Path on `/` via `Path extends `${infer Seg}/${infer Rest}` ? SegmentToObj<Seg> & Parse<Rest> : SegmentToObj<Path>`.',
            'Check `Seg extends `:${infer Name}?`` BEFORE `Seg extends `:${infer Name}`` so optional `?` is not swallowed into `Name`! Flatten the intersection with `{ [K in keyof T]: T[K] }`.',
          ],
          starterCode: `export type ExtractRouteParams<Path extends string> = {};
`,
          referenceSolution: `type FlattenObj<T> = {
  [K in keyof T]: T[K];
};

type SegmentToParam<Seg extends string> = Seg extends \`:\${infer Name}?\`
  ? Name extends ''
    ? {}
    : { [K in Name]?: string }
  : Seg extends \`:\${infer Name}\`
    ? Name extends ''
      ? {}
      : { [K in Name]: string }
    : {};

type ParsePathSegments<Path extends string> =
  Path extends \`\${infer Seg}/\${infer Rest}\`
    ? SegmentToParam<Seg> & ParsePathSegments<Rest>
    : SegmentToParam<Path>;

export type ExtractRouteParams<Path extends string> = FlattenObj<ParsePathSegments<Path>>;
`,
          astRules: { requireGenerics: true },
          typeAssertionPrelude: `import type { ExtractRouteParams } from './solution';`,
          typeAssertions: [
            {
              id: 's6-p2-c2-a1',
              name: 'Extracts multiple required dynamic route parameters',
              assertion: `Expect<Alike<ExtractRouteParams<'/orgs/:orgId/repos/:repoId'>, { orgId: string; repoId: string }>>`,
            },
            {
              id: 's6-p2-c2-a2',
              name: 'Supports mixed required and optional (:param?) segments',
              assertion: `Expect<Alike<ExtractRouteParams<'/users/:userId/settings/:section?'>, { userId: string; section?: string }>>`,
            },
            {
              id: 's6-p2-c2-a3',
              name: 'Static routes without colons produce {}',
              assertion: `Expect<Equal<ExtractRouteParams<'/api/v1/health'>, {}>>`,
            },
            {
              id: 's6-p2-c2-a4',
              name: 'Handles single root parameter ":slug" without leading slash',
              assertion: `Expect<Equal<ExtractRouteParams<':slug'>, { slug: string }>>`,
            },
            {
              id: 's6-p2-c2-a5',
              name: 'Hidden: Handles trailing slash after dynamic parameter',
              hidden: true,
              assertion: `Expect<Equal<ExtractRouteParams<'/posts/:postId/'>, { postId: string }>>`,
            },
            {
              id: 's6-p2-c2-a6',
              name: 'Hidden: All-optional parameter route produces optional keys',
              hidden: true,
              assertion: `Expect<Equal<ExtractRouteParams<'/:lang?/:region?'>, { lang?: string; region?: string }>>`,
            },
          ],
          testCases: [],
        },
        {
          id: 's6-p2-c3',
          title: 'Compile-Time Query String Parser (ParseQueryString<S>)',
          style: 'type-challenge',
          difficulty: 'master',
          description: `Implement \`ParseQueryString<S extends string>\` that parses an HTTP query string (without a leading \`?\`) into a typed dictionary:

- \`'k=v'\` $\\rightarrow$ \`{ k: 'v' }\`.
- Bare flag \`'debug'\` (no \`=\`) $\\rightarrow$ \`{ debug: true }\`.
- Empty value \`'filter='\` $\\rightarrow$ \`{ filter: '' }\`.
- Repeated keys accumulate values in encounter order into a tuple: \`'tag=ts&tag=strict'\` $\\rightarrow$ \`{ tag: ['ts', 'strict'] }\` (and 3+ occurrences append onto that tuple!).
- Empty string \`''\` (or skipped empty \`&&\` segments) $\\rightarrow$ \`{}\`.`,
          tags: ['Type Challenge', 'Template Literals', 'Parser', 'Recursive Types'],
          hints: [
            'Maintain an accumulator `Acc = {}` as you split `S` on `&`: `S extends `${infer Pair}&${infer Rest}` ? ParseQueryString<Rest, ApplyPair<Acc, Pair>> : ApplyPair<Acc, S>`.',
            'In MergeKey<Acc, K, V>, iterate `[P in keyof Acc | K]`: if `P` is already in `Acc` and equals `K`, append `V` to `Acc[P]` if `Acc[P] extends unknown[]` or form `[Acc[P], V]`.',
          ],
          starterCode: `export type ParseQueryString<S extends string> = {};
`,
          referenceSolution: `type MergeQueryValue<Acc, K extends string, V> = {
  [P in keyof Acc | K]: P extends keyof Acc
    ? P extends K
      ? Acc[P] extends unknown[]
        ? [...Acc[P], V]
        : [Acc[P], V]
      : Acc[P]
    : V;
};

type ApplyQueryPair<Acc, Pair extends string> = Pair extends ''
  ? Acc
  : Pair extends \`\${infer K}=\${infer V}\`
    ? K extends ''
      ? Acc
      : MergeQueryValue<Acc, K, V>
    : MergeQueryValue<Acc, Pair, true>;

export type ParseQueryString<
  S extends string,
  Acc = {},
> = S extends \`\${infer Pair}&\${infer Rest}\`
  ? ParseQueryString<Rest, ApplyQueryPair<Acc, Pair>>
  : ApplyQueryPair<Acc, S>;
`,
          astRules: { requireGenerics: true },
          typeAssertionPrelude: `import type { ParseQueryString } from './solution';`,
          typeAssertions: [
            {
              id: 's6-p2-c3-a1',
              name: 'Parses key=value pairs and boolean flags',
              assertion: `Expect<Alike<ParseQueryString<'page=1&sort=asc&verbose'>, { page: '1'; sort: 'asc'; verbose: true }>>`,
            },
            {
              id: 's6-p2-c3-a2',
              name: 'Collects repeated keys into ordered tuples of 2 and 3+ items',
              assertion: `Expect<Alike<ParseQueryString<'tag=ts&tag=node&tag=strict'>, { tag: ['ts', 'node', 'strict'] }>>`,
            },
            {
              id: 's6-p2-c3-a3',
              name: 'Handles empty query string as {}',
              assertion: `Expect<Equal<ParseQueryString<''>, {}>>`,
            },
            {
              id: 's6-p2-c3-a4',
              name: 'Preserves empty string values after "="',
              assertion: `Expect<Alike<ParseQueryString<'q=&active'>, { q: ''; active: true }>>`,
            },
            {
              id: 's6-p2-c3-a5',
              name: 'Hidden: Merges mixed boolean flag and key=value on same repeated key',
              hidden: true,
              assertion: `Expect<Alike<ParseQueryString<'mode&mode=fast'>, { mode: [true, 'fast'] }>>`,
            },
            {
              id: 's6-p2-c3-a6',
              name: 'Hidden: Ignores stray redundant ampersands',
              hidden: true,
              assertion: `Expect<Alike<ParseQueryString<'a=1&&b=2&'>, { a: '1'; b: '2' }>>`,
            },
          ],
          testCases: [],
        },
        {
          id: 's6-p2-c4',
          title: 'Type-Safe Runtime Route Builder (buildRoute)',
          style: 'leetcode',
          difficulty: 'hard',
          entryFunction: 'buildRoute',
          description: `Build a hybrid compile-time + runtime URL builder \`buildRoute\`:

1. \`export type RouteParams<Path extends string>\`: maps every \`:param\` segment in \`Path\` to \`string | number\` (or \`{}\` when \`Path\` has no \`:param\` segments).
2. \`export function buildRoute<Path extends string>(pattern: Path, ...args)\`:
   - When \`Path\` has **no** dynamic parameters (e.g. \`'/health'\`), \`params\` is optional!
   - When \`Path\` has dynamic parameters (e.g. \`'/teams/:teamId/users/:userId'\`), \`params: RouteParams<Path>\` is **required** at compile time.
   - At runtime, replace every \`:param\` segment with \`encodeURIComponent(String(params[key]))\`. Throw an \`Error\` if a required parameter is missing or \`undefined\`.`,
          tags: ['Template Literals', 'Hybrid Challenge', 'Routing', 'Generics'],
          hints: [
            'Extract parameter names via `Path extends `${infer Seg}/${infer Rest}` ? ParamName<Seg> | ExtractNames<Rest> : ParamName<Path>`.',
            'Type rest args as `...[params]: [ExtractNames<Path>] extends [never] ? [params?: Record<string, never>] : [params: RouteParams<Path>]`.',
          ],
          starterCode: `export type RouteParams<Path extends string> = Record<string, string | number>;

export function buildRoute<Path extends string>(
  pattern: Path,
  _params?: RouteParams<Path>
): string {
  return pattern;
}
`,
          referenceSolution: `type SegmentParamName<Seg extends string> = Seg extends \`:\${infer Name}\`
  ? Name extends ''
    ? never
    : Name
  : never;

type ExtractParamNames<Path extends string> =
  Path extends \`\${infer Seg}/\${infer Rest}\`
    ? SegmentParamName<Seg> | ExtractParamNames<Rest>
    : SegmentParamName<Path>;

export type RouteParams<Path extends string> = {
  [K in ExtractParamNames<Path>]: string | number;
};

type BuilderRestArgs<Path extends string> = [ExtractParamNames<Path>] extends [never]
  ? [params?: Record<string, never>]
  : [params: RouteParams<Path>];

export function buildRoute<Path extends string>(
  pattern: Path,
  ...args: BuilderRestArgs<Path>
): string {
  const params = (args[0] ?? {}) as Record<string, string | number | undefined>;
  return pattern
    .split('/')
    .map((segment) => {
      if (!segment.startsWith(':') || segment.length === 1) {
        return segment;
      }
      const key = segment.slice(1);
      const val = params[key];
      if (val === undefined) {
        throw new Error(\`Missing route parameter: \${key}\`);
      }
      return encodeURIComponent(String(val));
    })
    .join('/');
}
`,
          astRules: { requireGenerics: true },
          typeAssertionPrelude: `import { buildRoute } from './solution';
import type { RouteParams } from './solution';

const staticPath = buildRoute('/status/live');
const dynamicPath = buildRoute('/orgs/:org/members/:id', { org: 'acme', id: 7 });`,
          typeAssertions: [
            {
              id: 's6-p2-c4-a1',
              name: 'RouteParams extracts exact keys typed as string | number',
              assertion: `Expect<Equal<RouteParams<'/orgs/:org/members/:id'>, { org: string | number; id: string | number }>>`,
            },
            {
              id: 's6-p2-c4-a2',
              name: 'Static route allows omitting second argument and returns string',
              assertion: `Expect<Equal<[RouteParams<'/status/live'>, typeof staticPath, typeof dynamicPath], [{}, string, string]>>`,
            },
          ],
          testCases: [
            {
              id: 's6-p2-c4-t1',
              name: 'Substitutes string and numeric parameters into path segments',
              args: ['/orgs/:org/repos/:repoId', { org: 'typecraft', repoId: 42 }],
              expected: '/orgs/typecraft/repos/42',
            },
            {
              id: 's6-p2-c4-t2',
              name: 'URL-encodes special characters in parameter values',
              args: ['/search/:query', { query: 'ts & generics/v5' }],
              expected: '/search/ts%20%26%20generics%2Fv5',
            },
            {
              id: 's6-p2-c4-t3',
              name: 'Builds static paths with no second argument',
              args: ['/api/health'],
              expected: '/api/health',
            },
            {
              id: 's6-p2-c4-t4',
              name: 'Hidden: Supports numeric 0 without treating it as missing',
              hidden: true,
              args: ['/pages/:index', { index: 0 }],
              expected: '/pages/0',
            },
            {
              id: 's6-p2-c4-t5',
              name: 'Hidden: Throws Error at runtime if a parameter is missing',
              hidden: true,
              harnessCode: `
                const { buildRoute } = exports as { buildRoute: any };
                try {
                  buildRoute('/users/:id', {});
                  return false;
                } catch {
                  return true;
                }
              `,
              expected: true,
            },
          ],
        },
      ],
    },
    {
      id: 's6-p3',
      number: 3,
      title: 'Mapped Key Remapping (as) & Recursive Deep Types',
      subtitle: 'Deep partiality, mutability modifiers, dot-path type resolution, and value-driven key filtering',
      conceptSummary: `### Recursive Mapped Types & Key Remapping

Combining mapped modifiers (\`?\`, \`-?\`, \`-readonly\`), key remapping (\`as\`), and recursion lets you reshape arbitrarily nested domain models:

- **Base-Case Guards**: Always check function types (\`(...args: never) => unknown\`) before \`object\` in recursive types—otherwise \`{ [K in keyof Fn]: ... }\` strips callability and turns functions into \`{}\`!
- **Modifier Removal (\`-readonly\`)**: Homomorphic mapped types strip \`readonly\` across objects, arrays, and tuples alike.
- **Dot-Path Indexing**: Template literals split \`'user.profile.email'\` into head/tail steps while propagating optional \`undefined\` unions safely.`,
      challenges: [
        {
          id: 's6-p3-c1',
          title: 'Recursive DeepPartial<T>',
          style: 'type-challenge',
          difficulty: 'medium',
          description: `Implement \`DeepPartial<T>\` with the following exact rules:

1. **Functions** (\`T extends (...args: never) => unknown\`) remain **unchanged** (\`T\`).
2. **Mutable Arrays** (\`T extends Array<infer U>\`) become \`Array<DeepPartial<U>>\`.
3. **Readonly Arrays** (\`T extends ReadonlyArray<infer U>\`) become \`ReadonlyArray<DeepPartial<U>>\`.
4. **Plain Objects** (\`T extends object\`) map every property to optional: \`{ [K in keyof T]?: DeepPartial<T[K]> }\`.
5. **Primitives** (\`string\`, \`number\`, \`boolean\`, \`null\`, \`undefined\`, etc.) remain \`T\`.`,
          tags: ['Type Challenge', 'Recursive Types', 'Mapped Types', 'DeepPartial'],
          hints: [
            'Order matters! Check `(...args: never) => unknown` FIRST (functions extend `object`), then `Array<infer U>` BEFORE `ReadonlyArray<infer U>` (`U[]` extends `readonly U[]`), then `object`.',
          ],
          starterCode: `export type DeepPartial<T> = Partial<T>;
`,
          referenceSolution: `export type DeepPartial<T> = T extends (...args: never) => unknown
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : T extends object
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : T;
`,
          astRules: { requireGenerics: true },
          typeAssertionPrelude: `import type { DeepPartial } from './solution';

interface AppConfig {
  env: 'dev' | 'prod';
  db: {
    host: string;
    port: number;
    tls: { ca: string };
  };
  plugins: Array<{ name: string; enabled: boolean }>;
  onError: (err: Error) => void;
}`,
          typeAssertions: [
            {
              id: 's6-p3-c1-a1',
              name: 'Recursively marks nested objects and array item fields optional while preserving functions',
              assertion: `Expect<Equal<DeepPartial<AppConfig>, {
                env?: 'dev' | 'prod';
                db?: {
                  host?: string;
                  port?: number;
                  tls?: { ca?: string };
                };
                plugins?: Array<{ name?: string; enabled?: boolean }>;
                onError?: (err: Error) => void;
              }>>`,
            },
            {
              id: 's6-p3-c1-a2',
              name: 'Preserves ReadonlyArray wrapper while making item properties DeepPartial',
              assertion: `Expect<Equal<DeepPartial<ReadonlyArray<{ id: number }>>, ReadonlyArray<{ id?: number }>>>`,
            },
            {
              id: 's6-p3-c1-a3',
              name: 'Leaves primitives and standalone functions untouched',
              assertion: `Expect<Equal<[DeepPartial<number>, DeepPartial<(x: string) => boolean>], [number, (x: string) => boolean]>>`,
            },
            {
              id: 's6-p3-c1-a4',
              name: 'Preserves readonly modifiers on nested object properties',
              assertion: `Expect<Equal<DeepPartial<{ readonly meta: { readonly version: number } }>, { readonly meta?: { readonly version?: number } }>>`,
            },
            {
              id: 's6-p3-c1-a5',
              name: 'Hidden: Distributes over union of object shapes',
              hidden: true,
              assertion: `Expect<Equal<DeepPartial<{ a: { x: number } } | { b: string }>, { a?: { x?: number } } | { b?: string }>>`,
            },
          ],
          testCases: [],
        },
        {
          id: 's6-p3-c2',
          title: 'Shallow & Recursive Mutability (Mutable<T> & DeepMutable<T>)',
          style: 'type-challenge',
          difficulty: 'medium',
          description: `Implement two \`readonly\`-stripping type transformations:

1. \`Mutable<T>\`: removes \`readonly\` from top-level properties/elements of \`T\` without recursing into nested objects.
2. \`DeepMutable<T>\`: recursively removes \`readonly\` from all nested objects, \`readonly\` arrays, and \`readonly\` tuples while keeping functions (\`(...args: never) => unknown\`) intact!`,
          tags: ['Type Challenge', 'Mapped Modifiers', '-readonly', 'Recursive Types'],
          hints: [
            'Use `-readonly [K in keyof T]` in both types.',
            'In DeepMutable<T>, guard `T extends (...args: never) => unknown ? T : T extends object ? { -readonly [K in keyof T]: DeepMutable<T[K]> } : T` — homomorphic mapped types automatically convert `readonly` tuples and arrays into mutable ones!',
          ],
          starterCode: `export type Mutable<T> = T;

export type DeepMutable<T> = T;
`,
          referenceSolution: `export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

export type DeepMutable<T> = T extends (...args: never) => unknown
  ? T
  : T extends object
    ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
    : T;
`,
          astRules: { requireGenerics: true },
          typeAssertionPrelude: `import type { Mutable, DeepMutable } from './solution';

interface FrozenDoc {
  readonly id: string;
  readonly author: {
    readonly name: string;
    readonly roles: readonly string[];
  };
  readonly coords: readonly [number, readonly [number, number]];
  readonly render: () => string;
}`,
          typeAssertions: [
            {
              id: 's6-p3-c2-a1',
              name: 'Mutable strips top-level readonly while leaving nested objects readonly',
              assertion: `Expect<Equal<Mutable<{ readonly a: number; readonly nested: { readonly b: string } }>, { a: number; nested: { readonly b: string } }>>`,
            },
            {
              id: 's6-p3-c2-a2',
              name: 'DeepMutable strips readonly across nested objects, arrays, and tuples while keeping functions',
              assertion: `Expect<Equal<DeepMutable<FrozenDoc>, {
                id: string;
                author: {
                  name: string;
                  roles: string[];
                };
                coords: [number, [number, number]];
                render: () => string;
              }>>`,
            },
            {
              id: 's6-p3-c2-a3',
              name: 'Mutable converts readonly tuple to mutable tuple',
              assertion: `Expect<Equal<Mutable<readonly [1, 'two', true]>, [1, 'two', true]>>`,
            },
            {
              id: 's6-p3-c2-a4',
              name: 'Preserves optional "?" modifiers during DeepMutable',
              assertion: `Expect<Equal<DeepMutable<{ readonly note?: { readonly text?: string } }>, { note?: { text?: string } }>>`,
            },
            {
              id: 's6-p3-c2-a5',
              name: 'Hidden: Leaves primitives untouched in DeepMutable',
              hidden: true,
              assertion: `Expect<Equal<DeepMutable<'literal' | 42>, 'literal' | 42>>`,
            },
          ],
          testCases: [],
        },
        {
          id: 's6-p3-c3',
          title: 'Type-Safe Dot-Path Lookup (GetByDotPath<T, Path>)',
          style: 'type-challenge',
          difficulty: 'hard',
          description: `Implement \`GetByDotPath<T, Path extends string>\` to resolve nested property and tuple-index types from dot-delimited paths:

- \`GetByDotPath<State, 'user.profile.email'>\` $\\rightarrow$ \`string\`.
- Supports tuple string indices like \`'coords.1'\`.
- If an intermediate object is optional or \`| undefined\` (e.g. \`profile?: { email: string }\`), propagate \`| undefined\` to the final resolved type (\`string | undefined\`).
- If any segment key does **not** exist on \`NonNullable<Current>\`, evaluate to \`never\`.`,
          tags: ['Type Challenge', 'Template Literals', 'Indexed Access', 'Recursive Types'],
          hints: [
            'Let Base = NonNullable<T> and OptionalFlag = undefined extends T ? undefined : never.',
            'Check `Head extends keyof Base`: if false, return `never`; if true and `Tail` remains, return `GetByDotPath<Base[Head], Tail> | OptionalFlag`.',
          ],
          starterCode: `export type GetByDotPath<T, Path extends string> = unknown;
`,
          referenceSolution: `export type GetByDotPath<T, Path extends string> =
  Path extends \`\${infer Head}.\${infer Tail}\`
    ? Head extends keyof NonNullable<T>
      ? GetByDotPath<NonNullable<T>[Head], Tail> | (undefined extends T ? undefined : never)
      : never
    : Path extends keyof NonNullable<T>
      ? NonNullable<T>[Path] | (undefined extends T ? undefined : never)
      : never;
`,
          astRules: { requireGenerics: true },
          typeAssertionPrelude: `import type { GetByDotPath } from './solution';

interface StoreState {
  user: {
    id: number;
    profile?: {
      email: string;
      theme: 'light' | 'dark';
    };
  };
  matrix: readonly [string, { score: number }];
}`,
          typeAssertions: [
            {
              id: 's6-p3-c3-a1',
              name: 'Resolves deeply nested required object properties',
              assertion: `Expect<Equal<GetByDotPath<StoreState, 'user.id'>, number>>`,
            },
            {
              id: 's6-p3-c3-a2',
              name: 'Propagates undefined across optional intermediate objects',
              assertion: `Expect<Equal<GetByDotPath<StoreState, 'user.profile.theme'>, 'light' | 'dark' | undefined>>`,
            },
            {
              id: 's6-p3-c3-a3',
              name: 'Indexes into tuples and nested objects inside tuples',
              assertion: `Expect<Equal<[GetByDotPath<StoreState, 'matrix.0'>, GetByDotPath<StoreState, 'matrix.1.score'>], [string, number]>>`,
            },
            {
              id: 's6-p3-c3-a4',
              name: 'Returns never when path references a non-existent key',
              assertion: `Expect<Equal<[GetByDotPath<StoreState, 'user.unknown'>, GetByDotPath<StoreState, 'user.profile.missing'>], [never, never]>>`,
            },
            {
              id: 's6-p3-c3-a5',
              name: 'Hidden: Top-level single-segment lookup works directly',
              hidden: true,
              assertion: `Expect<Equal<GetByDotPath<{ token: string }, 'token'>, string>>`,
            },
            {
              id: 's6-p3-c3-a6',
              name: 'Hidden: Empty string path returns never unless "" is an explicit key',
              hidden: true,
              assertion: `Expect<Equal<[GetByDotPath<StoreState, ''>, GetByDotPath<{ '': 99 }, ''>], [never, 99]>>`,
            },
          ],
          testCases: [],
        },
        {
          id: 's6-p3-c4',
          title: 'Key Remapping Filter (PickByValueType & OmitByValueType)',
          style: 'type-challenge',
          difficulty: 'medium',
          description: `Use mapped key remapping (\`as\`) to filter object properties by value assignability:

1. \`PickByValueType<T, ValueType>\`: keeps only properties \`K\` of \`T\` where \`[T[K]] extends [ValueType]\` (preserving \`readonly\` and \`?\` modifiers).
2. \`OmitByValueType<T, ValueType>\`: keeps only properties \`K\` of \`T\` where \`[T[K]] extends [ValueType]\` is **false**.`,
          tags: ['Type Challenge', 'Key Remapping', 'Mapped Types'],
          hints: [
            'Use `[K in keyof T as [T[K]] extends [ValueType] ? K : never]: T[K]`.',
            'Wrapping `[T[K]] extends [ValueType]` ensures even `never`-valued properties behave predictably without unexpected distribution.',
          ],
          starterCode: `export type PickByValueType<T, ValueType> = T;

export type OmitByValueType<T, ValueType> = T;
`,
          referenceSolution: `export type PickByValueType<T, ValueType> = {
  [K in keyof T as [T[K]] extends [ValueType] ? K : never]: T[K];
};

export type OmitByValueType<T, ValueType> = {
  [K in keyof T as [T[K]] extends [ValueType] ? never : K]: T[K];
};
`,
          astRules: { requireGenerics: true },
          typeAssertionPrelude: `import type { PickByValueType, OmitByValueType } from './solution';

interface MetricsRecord {
  readonly host: string;
  region: string;
  cpuPct: number;
  memMb: number;
  healthy: boolean;
  note?: string;
}`,
          typeAssertions: [
            {
              id: 's6-p3-c4-a1',
              name: 'PickByValueType selects exact string properties and preserves readonly',
              assertion: `Expect<Equal<PickByValueType<MetricsRecord, string>, { readonly host: string; region: string }>>`,
            },
            {
              id: 's6-p3-c4-a2',
              name: 'PickByValueType matches optional properties when undefined is included in ValueType',
              assertion: `Expect<Equal<PickByValueType<MetricsRecord, string | undefined>, { readonly host: string; region: string; note?: string }>>`,
            },
            {
              id: 's6-p3-c4-a3',
              name: 'OmitByValueType removes numeric fields cleanly',
              assertion: `Expect<Equal<OmitByValueType<MetricsRecord, number>, { readonly host: string; region: string; healthy: boolean; note?: string }>>`,
            },
            {
              id: 's6-p3-c4-a4',
              name: 'Returns {} when no property matches ValueType',
              assertion: `Expect<Equal<PickByValueType<MetricsRecord, symbol>, {}>>`,
            },
            {
              id: 's6-p3-c4-a5',
              name: 'Hidden: Filters callable methods from data properties',
              hidden: true,
              assertion: `Expect<Equal<PickByValueType<{ id: number; save: () => void; reset: (hard: boolean) => boolean }, (...args: never) => unknown>, { save: () => void; reset: (hard: boolean) => boolean }>>`,
            },
          ],
          testCases: [],
        },
      ],
    },
    {
      id: 's6-p4',
      number: 4,
      title: 'Dynamic Programming & Memoization in TypeScript',
      subtitle: 'Optimal substructure, state transitions, patience binary search, knapsack I/O, and interval DP',
      conceptSummary: `### Dynamic Programming Patterns

Dynamic Programming turns exponential brute-force searches into polynomial-time recurrences by tabulating overlapping subproblems:

- **1D Unbounded Knapsack (\`minCoins\`)**: \`dp[x] = min(dp[x], dp[x - coin] + 1)\` solves change-making where greedy largest-first fails (e.g. \`[1, 3, 4]\` for \`6\`).
- **Patience Sorting (\`lengthOfLIS\`)**: Maintaining the smallest possible tail value for each subsequence length via binary search lowers $O(n^2)$ DP to $O(n \\log n)$.
- **0/1 Knapsack with Tie-Breaking**: Tracking both best value and minimum weight per capacity guarantees unique optimal answers.
- **Weighted Interval Scheduling**: Sorting by \`end\` time + binary searching the latest non-overlapping predecessor unlocks $O(n \\log n)$ scheduling.`,
      challenges: [
        {
          id: 's6-p4-c1',
          title: 'Minimum Coin Change (minCoins)',
          style: 'leetcode',
          difficulty: 'medium',
          entryFunction: 'minCoins',
          description: `Given positive integer denominations \`coins: readonly number[]\` and a target \`amount: number\`, return the **minimum number of coins** needed to sum to \`amount\` (assuming an infinite supply of each denomination), or \`-1\` if \`amount\` cannot be formed.

- \`amount === 0\` requires \`0\` coins.
- Do not mutate \`coins\`.`,
          tags: ['Dynamic Programming', 'Tabulation', 'Algorithms'],
          hints: [
            'Allocate `dp = new Array<number>(amount + 1).fill(amount + 1)` with `dp[0] = 0`.',
            'For each `a` from `1` to `amount` and each `c` of `coins`, if `c <= a`, set `dp[a] = Math.min(dp[a], dp[a - c] + 1)`.',
          ],
          starterCode: `export function minCoins(_coins: readonly number[], _amount: number): number {
  return -1;
}
`,
          referenceSolution: `export function minCoins(coins: readonly number[], amount: number): number {
  if (amount < 0) return -1;
  if (amount === 0) return 0;

  const inf = amount + 1;
  const dp = new Array<number>(amount + 1).fill(inf);
  dp[0] = 0;

  for (let curr = 1; curr <= amount; curr++) {
    for (const coin of coins) {
      if (coin > 0 && coin <= curr) {
        const candidate = dp[curr - coin] + 1;
        if (candidate < dp[curr]) {
          dp[curr] = candidate;
        }
      }
    }
  }

  return dp[amount] > amount ? -1 : dp[amount];
}
`,
          testCases: [
            {
              id: 's6-p4-c1-t1',
              name: 'Beats greedy trap ([1, 3, 4] for 6 -> 3+3 = 2 coins)',
              args: [[1, 3, 4], 6],
              expected: 2,
              checkImmutability: true,
            },
            {
              id: 's6-p4-c1-t2',
              name: 'Standard US/Euro denominations',
              args: [[1, 2, 5], 11],
              expected: 3,
              checkImmutability: true,
            },
            {
              id: 's6-p4-c1-t3',
              name: 'Unreachable amount returns -1',
              args: [[2, 4], 7],
              expected: -1,
            },
            {
              id: 's6-p4-c1-t4',
              name: 'Zero amount returns 0',
              args: [[1, 5, 10], 0],
              expected: 0,
            },
            {
              id: 's6-p4-c1-t5',
              name: 'Hidden: Unsorted coins with larger optimal combination',
              hidden: true,
              args: [[7, 5, 1], 15],
              expected: 3,
              checkImmutability: true,
            },
            {
              id: 's6-p4-c1-t6',
              name: 'Hidden: Empty coins array on positive amount returns -1',
              hidden: true,
              args: [[], 5],
              expected: -1,
            },
          ],
        },
        {
          id: 's6-p4-c2',
          title: 'Longest Strictly Increasing Subsequence (lengthOfLIS)',
          style: 'leetcode',
          difficulty: 'medium',
          entryFunction: 'lengthOfLIS',
          description: `Given an integer array \`nums: readonly number[]\`, return the length of the **longest strictly increasing subsequence** ($a_{i_1} < a_{i_2} < \\dots < a_{i_k}$).

- Aim for $O(n \\log n)$ time using binary search over minimal subsequence tails.
- Do not mutate \`nums\`.`,
          tags: ['Dynamic Programming', 'Binary Search', 'Subsequence'],
          hints: [
            'Maintain `tails: number[]` where `tails[len - 1]` is the smallest ending element of any increasing subsequence of length `len`.',
            'For each `x` in `nums`, binary-search the first index `lo` where `tails[lo] >= x` (strictly increasing requires `>=`, not `>`!) and set `tails[lo] = x`.',
          ],
          starterCode: `export function lengthOfLIS(_nums: readonly number[]): number {
  return 0;
}
`,
          referenceSolution: `export function lengthOfLIS(nums: readonly number[]): number {
  const tails: number[] = [];

  for (const x of nums) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (tails[mid] < x) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    tails[lo] = x;
  }

  return tails.length;
}
`,
          testCases: [
            {
              id: 's6-p4-c2-t1',
              name: 'Classic mixed sequence [10, 9, 2, 5, 3, 7, 101, 18]',
              args: [[10, 9, 2, 5, 3, 7, 101, 18]],
              expected: 4,
              checkImmutability: true,
            },
            {
              id: 's6-p4-c2-t2',
              name: 'All duplicate elements yield length 1 (strict inequality)',
              args: [[7, 7, 7, 7, 7]],
              expected: 1,
              checkImmutability: true,
            },
            {
              id: 's6-p4-c2-t3',
              name: 'Empty array returns 0',
              args: [[]],
              expected: 0,
            },
            {
              id: 's6-p4-c2-t4',
              name: 'Interleaved resets [0, 1, 0, 3, 2, 3]',
              args: [[0, 1, 0, 3, 2, 3]],
              expected: 4,
              checkImmutability: true,
            },
            {
              id: 's6-p4-c2-t5',
              name: 'Hidden: Strictly decreasing sequence with negatives',
              hidden: true,
              args: [[9, 5, 0, -3, -10]],
              expected: 1,
              checkImmutability: true,
            },
            {
              id: 's6-p4-c2-t6',
              name: 'Hidden: Longer sequence replacing intermediate tails',
              hidden: true,
              args: [[4, 10, 4, 3, 8, 9, 1, 2, 3, 4, 5]],
              expected: 5,
              checkImmutability: true,
            },
          ],
        },
        {
          id: 's6-p4-c3',
          title: '0/1 Cargo Knapsack Optimizer',
          style: 'beecrowd',
          difficulty: 'hard',
          entryFunction: 'solve',
          description: `You are loading a cargo shuttle with capacity \`W\` kg from \`N\` indivisible crates (each crate can be chosen at most once).

### Input Format
- Line 1: \`N W\` (\`0 <= N <= 200\`, \`0 <= W <= 2000\`).
- Next \`N\` lines: \`<label> <weight> <value>\` (integers \`weight >= 1\`, \`value >= 0\`).

### Output Format
Print a single line \`<maxValue> <minWeight>\` where:
- \`<maxValue>\` is the maximum total value achievable with total weight \`<= W\`.
- \`<minWeight>\` is the **smallest total weight** among all subsets that achieve \`<maxValue>\`.`,
          tags: ['Dynamic Programming', '0/1 Knapsack', 'Beecrowd'],
          hints: [
            'Maintain `dp[w]` = maximum value achievable with **exact** weight `w` (`-1` if unreachable, `dp[0] = 0`).',
            'Iterate each crate backwards `for (let w = W; w >= weight; w--)`. Afterward, scan `w = 0 .. W` and pick the first `w` achieving the highest `dp[w]`—scanning ascending automatically picks the smallest weight on ties!',
          ],
          playgroundInput: `4 10
food 4 40
water 6 50
meds 3 50
tent 5 30`,
          starterCode: `export function solve(input: string): string {
  void input;
  return '0 0';
}
`,
          referenceSolution: `export function solve(input: string): string {
  const lines = input.replace(/\\r/g, '').trim().split('\\n');
  if (lines.length === 0 || lines[0].trim() === '') return '0 0';

  const [nStr, wStr] = lines[0].trim().split(/\\s+/);
  const n = Number(nStr);
  const maxW = Number(wStr);

  const dp = new Array<number>(maxW + 1).fill(-1);
  dp[0] = 0;

  for (let i = 1; i <= n && i < lines.length; i++) {
    const parts = lines[i].trim().split(/\\s+/);
    const weight = Number(parts[1]);
    const value = Number(parts[2]);
    if (weight > maxW) continue;

    for (let w = maxW; w >= weight; w--) {
      if (dp[w - weight] !== -1) {
        const candidate = dp[w - weight] + value;
        if (candidate > dp[w]) {
          dp[w] = candidate;
        }
      }
    }
  }

  let bestVal = 0;
  let bestWeight = 0;
  for (let w = 0; w <= maxW; w++) {
    if (dp[w] > bestVal) {
      bestVal = dp[w];
      bestWeight = w;
    }
  }

  return \`\${bestVal} \${bestWeight}\`;
}
`,
          testCases: [
            {
              id: 's6-p4-c3-t1',
              name: 'Finds optimal crate combination (water + meds = 100 at 9kg)',
              args: [`4 10\nfood 4 40\nwater 6 50\nmeds 3 50\ntent 5 30`],
              expected: '100 9',
            },
            {
              id: 's6-p4-c3-t2',
              name: 'Breaks value ties by choosing lighter total weight',
              args: [`3 8\nheavy 7 60\nlightA 2 25\nlightB 3 35`],
              expected: '60 5',
            },
            {
              id: 's6-p4-c3-t3',
              name: 'All items heavier than capacity yields 0 0',
              args: [`2 4\nanvil 5 100\nsafe 9 250`],
              expected: '0 0',
            },
            {
              id: 's6-p4-c3-t4',
              name: 'Hidden: Zero-value items do not inflate minimum weight',
              hidden: true,
              args: [`3 10\nemptyBox 3 0\ngem 4 80\nsand 2 0`],
              expected: '80 4',
            },
            {
              id: 's6-p4-c3-t5',
              name: 'Hidden: Zero items or zero capacity',
              hidden: true,
              args: [`0 50`],
              expected: '0 0',
            },
          ],
        },
        {
          id: 's6-p4-c4',
          title: 'Weighted Interval Scheduling (maxIntervalProfit)',
          style: 'leetcode',
          difficulty: 'hard',
          entryFunction: 'maxIntervalProfit',
          description: `Given \`jobs: readonly IntervalJob[]\` where each job spans \`[start, end)\` with positive \`profit\`, return the **maximum total profit** of mutually non-overlapping jobs.

- Two jobs \`A\` and \`B\` do **not** overlap if \`A.end <= B.start\` or \`B.end <= A.start\`.
- Do not mutate the input \`jobs\` array.`,
          tags: ['Dynamic Programming', 'Binary Search', 'Interval Scheduling'],
          hints: [
            'Clone and sort jobs by `end` ascending.',
            'For job `i` (0-indexed), binary-search how many jobs `k` in `0 .. i - 1` satisfy `sorted[k].end <= sorted[i].start`, then `dp[i + 1] = Math.max(dp[i], dp[countCompatible] + sorted[i].profit)`.',
          ],
          starterCode: `export interface IntervalJob {
  readonly start: number;
  readonly end: number;
  readonly profit: number;
}

export function maxIntervalProfit(_jobs: readonly IntervalJob[]): number {
  return 0;
}
`,
          referenceSolution: `export interface IntervalJob {
  readonly start: number;
  readonly end: number;
  readonly profit: number;
}

export function maxIntervalProfit(jobs: readonly IntervalJob[]): number {
  if (jobs.length === 0) return 0;

  const sorted = [...jobs].sort((a, b) => a.end - b.end);
  const dp = new Array<number>(sorted.length + 1).fill(0);

  for (let i = 0; i < sorted.length; i++) {
    const targetStart = sorted[i].start;
    let lo = 0;
    let hi = i;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (sorted[mid].end <= targetStart) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    const take = dp[lo] + sorted[i].profit;
    dp[i + 1] = take > dp[i] ? take : dp[i];
  }

  return dp[sorted.length];
}
`,
          testCases: [
            {
              id: 's6-p4-c4-t1',
              name: 'Chains touching intervals (end === next.start)',
              args: [
                [
                  { start: 1, end: 3, profit: 50 },
                  { start: 3, end: 5, profit: 40 },
                  { start: 2, end: 6, profit: 70 },
                ],
              ],
              expected: 90,
              checkImmutability: true,
            },
            {
              id: 's6-p4-c4-t2',
              name: 'Chooses single high-profit span over multiple low-profit spans',
              args: [
                [
                  { start: 1, end: 10, profit: 200 },
                  { start: 1, end: 3, profit: 40 },
                  { start: 3, end: 6, profit: 50 },
                  { start: 6, end: 10, profit: 60 },
                ],
              ],
              expected: 200,
              checkImmutability: true,
            },
            {
              id: 's6-p4-c4-t3',
              name: 'Empty schedule returns 0',
              args: [[]],
              expected: 0,
            },
            {
              id: 's6-p4-c4-t4',
              name: 'Unsorted overlapping intervals with multiple equal end times',
              args: [
                [
                  { start: 4, end: 6, profit: 70 },
                  { start: 1, end: 4, profit: 30 },
                  { start: 2, end: 6, profit: 95 },
                  { start: 6, end: 9, profit: 60 },
                ],
              ],
              expected: 160,
              checkImmutability: true,
            },
            {
              id: 's6-p4-c4-t5',
              name: 'Hidden: Identical intervals picks the highest-profit one',
              hidden: true,
              args: [
                [
                  { start: 1, end: 5, profit: 25 },
                  { start: 1, end: 5, profit: 80 },
                  { start: 1, end: 5, profit: 40 },
                ],
              ],
              expected: 80,
              checkImmutability: true,
            },
            {
              id: 's6-p4-c4-t6',
              name: 'Hidden: Non-contiguous optimal chain skipping middle distractors',
              hidden: true,
              args: [
                [
                  { start: 0, end: 2, profit: 30 },
                  { start: 1, end: 8, profit: 50 },
                  { start: 5, end: 7, profit: 45 },
                  { start: 7, end: 10, profit: 55 },
                ],
              ],
              expected: 130,
              checkImmutability: true,
            },
          ],
        },
      ],
    },
    {
      id: 's6-p5',
      number: 5,
      title: 'Graphs, Trie & Shortest-Path Algorithms',
      subtitle: 'Prefix trees with ranked autocomplete, Dijkstra priority queues, immutable intervals, and Union-Find',
      conceptSummary: `### Trees, Graphs & Disjoint Sets

Mastering structural graph algorithms in strict TypeScript combines clean node representations with strong immutability guarantees:

- **Prefix \`AutocompleteTrie\`**: Stores character transitions in \`Map<string, TrieNode>\` and ranks subtree completions by frequency descending, then ASCII lexicographical order.
- **Dijkstra + Binary Min-Heap**: Relaxes non-negative weighted edges in $O((V + E) \\log V)$ while reconstructing the exact shortest node path via predecessor pointers.
- **Disjoint Set Union (Union-Find)**: Path compression + union-by-size answers dynamic connectivity and component size queries in inverse-Ackermann $O(\\alpha(N))$ time.`,
      challenges: [
        {
          id: 's6-p5-c1',
          title: 'Prefix Trie with Ranked Autocomplete (AutocompleteTrie)',
          style: 'leetcode',
          difficulty: 'hard',
          description: `Implement an \`AutocompleteTrie\` class supporting weighted frequency accumulation and top-$K$ prefix suggestions:

- \`insert(word: string, weight = 1): void\`: adds \`weight\` (\`> 0\`) to \`word\`'s cumulative score (ignore empty \`word === ''\`).
- \`search(word: string): number\`: returns \`word\`'s cumulative score, or \`0\` if \`word\` was never inserted.
- \`startsWith(prefix: string): boolean\`: returns \`true\` if at least one inserted word starts with \`prefix\`.
- \`suggest(prefix: string, k: number): string[]\`: returns up to \`k\` (\`k <= 0\` returns \`[]\`) inserted words starting with \`prefix\`, sorted by **score descending**, breaking ties by **ASCII lexicographical ascending** (\`a < b ? -1 : 1\`).`,
          tags: ['Trie', 'Autocomplete', 'Classes', 'Trees'],
          hints: [
            'Each TrieNode holds `children = new Map<string, TrieNode>()` and `score = 0` (`score > 0` marks a completed word).',
            'Walk down to the prefix node, collect `{ word, score }` via DFS over its subtree, sort by `b.score - a.score || (a.word < b.word ? -1 : 1)`, and slice `(0, k)`.',
          ],
          starterCode: `export class AutocompleteTrie {
  insert(_word: string, _weight = 1): void {}

  search(_word: string): number {
    return 0;
  }

  startsWith(_prefix: string): boolean {
    return false;
  }

  suggest(_prefix: string, _k: number): string[] {
    return [];
  }
}
`,
          referenceSolution: `class TrieNode {
  readonly children = new Map<string, TrieNode>();
  score = 0;
}

export class AutocompleteTrie {
  private readonly root = new TrieNode();
  private totalWords = 0;

  insert(word: string, weight = 1): void {
    if (word.length === 0 || weight <= 0) return;
    let curr = this.root;
    for (const ch of word) {
      let next = curr.children.get(ch);
      if (!next) {
        next = new TrieNode();
        curr.children.set(ch, next);
      }
      curr = next;
    }
    if (curr.score === 0) {
      this.totalWords++;
    }
    curr.score += weight;
  }

  private findNode(prefix: string): TrieNode | undefined {
    let curr: TrieNode | undefined = this.root;
    for (const ch of prefix) {
      curr = curr.children.get(ch);
      if (!curr) return undefined;
    }
    return curr;
  }

  search(word: string): number {
    if (word.length === 0) return 0;
    return this.findNode(word)?.score ?? 0;
  }

  startsWith(prefix: string): boolean {
    if (this.totalWords === 0) return false;
    return this.findNode(prefix) !== undefined;
  }

  suggest(prefix: string, k: number): string[] {
    if (k <= 0) return [];
    const startNode = this.findNode(prefix);
    if (!startNode) return [];

    const matches: Array<{ word: string; score: number }> = [];
    const dfs = (node: TrieNode, currentWord: string): void => {
      if (node.score > 0) {
        matches.push({ word: currentWord, score: node.score });
      }
      for (const [ch, child] of node.children) {
        dfs(child, currentWord + ch);
      }
    };

    dfs(startNode, prefix);
    matches.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.word < b.word ? -1 : a.word > b.word ? 1 : 0;
    });

    return matches.slice(0, k).map((m) => m.word);
  }
}
`,
          astRules: { requireClass: true },
          testCases: [
            {
              id: 's6-p5-c1-t1',
              name: 'Accumulates weights and ranks suggestions by score desc then ASCII asc',
              harnessCode: `
                const { AutocompleteTrie } = exports as { AutocompleteTrie: new () => any };
                const trie = new AutocompleteTrie();
                trie.insert('type', 3);
                trie.insert('typescript', 5);
                trie.insert('typed', 5);
                trie.insert('type', 4);
                trie.insert('tuple', 9);
                return {
                  typeScore: trie.search('type'),
                  typScore: trie.search('typ'),
                  hasTyp: trie.startsWith('typ'),
                  top2: trie.suggest('typ', 2),
                  topAll: trie.suggest('typ', 10),
                };
              `,
              expected: {
                typeScore: 7,
                typScore: 0,
                hasTyp: true,
                top2: ['type', 'typed'],
                topAll: ['type', 'typed', 'typescript'],
              },
            },
            {
              id: 's6-p5-c1-t2',
              name: 'Returns empty array on unmatched prefix or k <= 0',
              harnessCode: `
                const { AutocompleteTrie } = exports as { AutocompleteTrie: new () => any };
                const trie = new AutocompleteTrie();
                trie.insert('alpha', 2);
                return {
                  miss: trie.suggest('beta', 3),
                  zeroK: trie.suggest('a', 0),
                  hasBeta: trie.startsWith('beta'),
                };
              `,
              expected: { miss: [], zeroK: [], hasBeta: false },
            },
            {
              id: 's6-p5-c1-t3',
              name: 'Empty prefix suggests globally highest-ranked words',
              harnessCode: `
                const { AutocompleteTrie } = exports as { AutocompleteTrie: new () => any };
                const trie = new AutocompleteTrie();
                trie.insert('cat', 2);
                trie.insert('car', 2);
                trie.insert('dog', 5);
                return trie.suggest('', 2);
              `,
              expected: ['dog', 'car'],
            },
            {
              id: 's6-p5-c1-t4',
              name: 'Hidden: Empty trie startsWith("") is false',
              hidden: true,
              harnessCode: `
                const { AutocompleteTrie } = exports as { AutocompleteTrie: new () => any };
                const trie = new AutocompleteTrie();
                return { emptyStarts: trie.startsWith(''), searchA: trie.search('a') };
              `,
              expected: { emptyStarts: false, searchA: 0 },
            },
            {
              id: 's6-p5-c1-t5',
              name: 'Hidden: Exact word matches are included when word is also a prefix of longer words',
              hidden: true,
              harnessCode: `
                const { AutocompleteTrie } = exports as { AutocompleteTrie: new () => any };
                const trie = new AutocompleteTrie();
                trie.insert('go', 1);
                trie.insert('golang', 4);
                trie.insert('gopher', 2);
                return trie.suggest('go', 3);
              `,
              expected: ['golang', 'gopher', 'go'],
            },
          ],
        },
        {
          id: 's6-p5-c2',
          title: 'Dijkstra Weighted Shortest Path (shortestPath)',
          style: 'leetcode',
          difficulty: 'hard',
          entryFunction: 'shortestPath',
          description: `Given \`nodeCount\` vertices (\`0 .. nodeCount - 1\`), directed non-negative weighted edges \`edges: readonly (readonly [from: number, to: number, weight: number])[]\`, \`source\`, and \`target\`, return \`{ distance: number; path: number[] }\` for the shortest path from \`source\` to \`target\`, or \`null\` if \`target\` is unreachable.

- When \`source === target\` (and \`0 <= source < nodeCount\`), return \`{ distance: 0, path: [source] }\`.
- Do not mutate \`edges\`.`,
          tags: ['Graphs', 'Dijkstra', 'Min-Heap', 'Shortest Path'],
          hints: [
            'Build an adjacency list `adj: Array<Array<{ to: number; weight: number }>>` and implement a compact binary MinHeap keyed by tentative distance.',
            'Record `prev[next] = u` whenever `dist[u] + w < dist[next]`, then walk `prev` backwards from `target` to `source` and `.reverse()`.',
          ],
          starterCode: `export interface PathResult {
  readonly distance: number;
  readonly path: number[];
}

export function shortestPath(
  _nodeCount: number,
  _edges: readonly (readonly [number, number, number])[],
  _source: number,
  _target: number
): PathResult | null {
  return null;
}
`,
          referenceSolution: `export interface PathResult {
  readonly distance: number;
  readonly path: number[];
}

interface HeapNode {
  readonly vertex: number;
  readonly dist: number;
}

class MinHeap {
  private readonly data: HeapNode[] = [];

  get size(): number {
    return this.data.length;
  }

  push(item: HeapNode): void {
    this.data.push(item);
    let idx = this.data.length - 1;
    while (idx > 0) {
      const parent = (idx - 1) >>> 1;
      if (this.data[parent].dist <= this.data[idx].dist) break;
      const tmp = this.data[parent];
      this.data[parent] = this.data[idx];
      this.data[idx] = tmp;
      idx = parent;
    }
  }

  pop(): HeapNode | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop() as HeapNode;
    if (this.data.length > 0) {
      this.data[0] = last;
      let idx = 0;
      const len = this.data.length;
      for (;;) {
        const left = idx * 2 + 1;
        const right = left + 1;
        let smallest = idx;
        if (left < len && this.data[left].dist < this.data[smallest].dist) {
          smallest = left;
        }
        if (right < len && this.data[right].dist < this.data[smallest].dist) {
          smallest = right;
        }
        if (smallest === idx) break;
        const tmp = this.data[idx];
        this.data[idx] = this.data[smallest];
        this.data[smallest] = tmp;
        idx = smallest;
      }
    }
    return top;
  }
}

export function shortestPath(
  nodeCount: number,
  edges: readonly (readonly [number, number, number])[],
  source: number,
  target: number
): PathResult | null {
  if (source < 0 || source >= nodeCount || target < 0 || target >= nodeCount) {
    return null;
  }
  if (source === target) {
    return { distance: 0, path: [source] };
  }

  const adj: Array<Array<{ to: number; weight: number }>> = Array.from(
    { length: nodeCount },
    () => []
  );
  for (const [u, v, w] of edges) {
    adj[u].push({ to: v, weight: w });
  }

  const dist = new Array<number>(nodeCount).fill(Number.POSITIVE_INFINITY);
  const prev = new Array<number>(nodeCount).fill(-1);
  dist[source] = 0;

  const heap = new MinHeap();
  heap.push({ vertex: source, dist: 0 });

  while (heap.size > 0) {
    const current = heap.pop() as HeapNode;
    if (current.dist > dist[current.vertex]) continue;
    if (current.vertex === target) break;

    for (const edge of adj[current.vertex]) {
      const cand = current.dist + edge.weight;
      if (cand < dist[edge.to]) {
        dist[edge.to] = cand;
        prev[edge.to] = current.vertex;
        heap.push({ vertex: edge.to, dist: cand });
      }
    }
  }

  if (!Number.isFinite(dist[target])) {
    return null;
  }

  const path: number[] = [];
  for (let at = target; at !== -1; at = prev[at]) {
    path.push(at);
  }
  path.reverse();

  return { distance: dist[target], path };
}
`,
          testCases: [
            {
              id: 's6-p5-c2-t1',
              name: 'Finds multi-hop path cheaper than direct heavy edge',
              args: [
                4,
                [
                  [0, 3, 25],
                  [0, 1, 4],
                  [1, 2, 6],
                  [2, 3, 5],
                ],
                0,
                3,
              ],
              expected: { distance: 15, path: [0, 1, 2, 3] },
              checkImmutability: true,
            },
            {
              id: 's6-p5-c2-t2',
              name: 'Returns null when target is unreachable in directed graph',
              args: [
                4,
                [
                  [0, 1, 3],
                  [2, 3, 2],
                ],
                0,
                3,
              ],
              expected: null,
              checkImmutability: true,
            },
            {
              id: 's6-p5-c2-t3',
              name: 'Source equals target returns distance 0 and singleton path',
              args: [3, [[0, 1, 5]], 2, 2],
              expected: { distance: 0, path: [2] },
            },
            {
              id: 's6-p5-c2-t4',
              name: 'Handles cycles and zero-weight edges cleanly',
              args: [
                5,
                [
                  [0, 1, 2],
                  [1, 0, 1],
                  [1, 2, 0],
                  [2, 4, 7],
                  [0, 3, 10],
                  [3, 4, 1],
                ],
                0,
                4,
              ],
              expected: { distance: 9, path: [0, 1, 2, 4] },
              checkImmutability: true,
            },
            {
              id: 's6-p5-c2-t5',
              name: 'Hidden: Parallel duplicate edges pick lightest weight',
              hidden: true,
              args: [
                3,
                [
                  [0, 1, 10],
                  [0, 1, 3],
                  [1, 2, 4],
                ],
                0,
                2,
              ],
              expected: { distance: 7, path: [0, 1, 2] },
              checkImmutability: true,
            },
            {
              id: 's6-p5-c2-t6',
              name: 'Hidden: Out-of-bounds vertex index returns null safely',
              hidden: true,
              args: [2, [[0, 1, 1]], 0, 5],
              expected: null,
            },
          ],
        },
        {
          id: 's6-p5-c3',
          title: 'Immutable Interval Merger (mergeIntervals)',
          style: 'leetcode',
          difficulty: 'medium',
          entryFunction: 'mergeIntervals',
          description: `Given an array of closed intervals \`intervals: readonly (readonly [number, number])[]\` (\`start <= end\`), merge all overlapping or touching intervals (\`nextStart <= currentEnd\`) and return a new sorted array of \`[start, end]\` pairs.

- **Strict Immutability**: Neither the outer \`intervals\` array nor any inner \`[start, end]\` tuple may be mutated in place!`,
          tags: ['Intervals', 'Sorting', 'Immutability', 'Algorithms'],
          hints: [
            'Clone tuples `[s, e]` before sorting by `a[0] - b[0] || a[1] - b[1]` so the caller input remains untouched.',
            'Compare `nextStart <= lastMerged[1]`; if overlapping, update `lastMerged[1] = Math.max(lastMerged[1], nextEnd)` on your freshly created output tuple.',
          ],
          starterCode: `export function mergeIntervals(
  _intervals: readonly (readonly [number, number])[]
): Array<[number, number]> {
  return [];
}
`,
          referenceSolution: `export function mergeIntervals(
  intervals: readonly (readonly [number, number])[]
): Array<[number, number]> {
  if (intervals.length === 0) return [];

  const sorted: Array<[number, number]> = intervals
    .map(([s, e]): [number, number] => [s, e])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  const merged: Array<[number, number]> = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const [nextStart, nextEnd] = sorted[i];
    const current = merged[merged.length - 1];
    if (nextStart <= current[1]) {
      if (nextEnd > current[1]) {
        current[1] = nextEnd;
      }
    } else {
      merged.push([nextStart, nextEnd]);
    }
  }

  return merged;
}
`,
          testCases: [
            {
              id: 's6-p5-c3-t1',
              name: 'Merges unsorted overlapping and nested intervals without mutating input',
              args: [
                [
                  [8, 10],
                  [1, 3],
                  [2, 6],
                  [15, 18],
                ],
              ],
              expected: [
                [1, 6],
                [8, 10],
                [15, 18],
              ],
              checkImmutability: true,
            },
            {
              id: 's6-p5-c3-t2',
              name: 'Merges touching boundary intervals [1, 4] and [4, 5]',
              args: [
                [
                  [1, 4],
                  [4, 5],
                ],
              ],
              expected: [[1, 5]],
              checkImmutability: true,
            },
            {
              id: 's6-p5-c3-t3',
              name: 'Completely nested interval [2, 3] inside [1, 10]',
              args: [
                [
                  [1, 10],
                  [2, 3],
                  [4, 8],
                ],
              ],
              expected: [[1, 10]],
              checkImmutability: true,
            },
            {
              id: 's6-p5-c3-t4',
              name: 'Empty input returns empty array',
              args: [[]],
              expected: [],
              checkImmutability: true,
            },
            {
              id: 's6-p5-c3-t5',
              name: 'Hidden: Negative coordinates and point intervals [x, x]',
              hidden: true,
              args: [
                [
                  [-5, -2],
                  [-2, -2],
                  [0, 0],
                  [2, 4],
                ],
              ],
              expected: [
                [-5, -2],
                [0, 0],
                [2, 4],
              ],
              checkImmutability: true,
            },
            {
              id: 's6-p5-c3-t6',
              name: 'Hidden: Disjoint intervals sorted into ascending order',
              hidden: true,
              args: [
                [
                  [20, 25],
                  [5, 7],
                  [10, 12],
                ],
              ],
              expected: [
                [5, 7],
                [10, 12],
                [20, 25],
              ],
              checkImmutability: true,
            },
          ],
        },
        {
          id: 's6-p5-c4',
          title: 'Disjoint-Set Network Connectivity (Union-Find)',
          style: 'beecrowd',
          difficulty: 'medium',
          entryFunction: 'solve',
          description: `Maintain dynamic cluster connectivity across \`N\` servers (\`1 .. N\`) over \`Q\` operations using a Disjoint Set Union (Union-Find) structure.

### Input Format
- Line 1: \`N Q\` (\`1 <= N <= 5000\`, \`1 <= Q <= 5000\`).
- Next \`Q\` lines:
  - \`LINK u v\` — merges the clusters containing servers \`u\` and \`v\`.
  - \`CHECK u v\` — outputs \`CONNECTED\` if \`u\` and \`v\` belong to the same cluster, else \`ISOLATED\`.
  - \`INFO u\` — outputs \`size=<clusterSizeOfU> components=<totalRemainingClusters>\`.

Return all output lines joined by \`\\n\`.`,
          tags: ['Graphs', 'Union-Find', 'Disjoint Set', 'Beecrowd'],
          hints: [
            'Initialize `parent[i] = i`, `compSize[i] = 1` for `1 .. N`, and `components = N`.',
            'Use path compression in `find(x)` and union-by-size in `union(a, b)` (decrementing `components` only when `rootA !== rootB`).',
          ],
          playgroundInput: `5 6
CHECK 1 3
LINK 1 2
LINK 2 3
CHECK 1 3
INFO 2
LINK 4 5`,
          starterCode: `export function solve(input: string): string {
  void input;
  return '';
}
`,
          referenceSolution: `export function solve(input: string): string {
  const lines = input.replace(/\\r/g, '').trim().split('\\n');
  if (lines.length === 0 || lines[0].trim() === '') return '';

  const [nStr, qStr] = lines[0].trim().split(/\\s+/);
  const n = Number(nStr);
  const q = Number(qStr);

  const parent = new Array<number>(n + 1);
  const compSize = new Array<number>(n + 1).fill(1);
  for (let i = 1; i <= n; i++) {
    parent[i] = i;
  }
  let components = n;

  const find = (x: number): number => {
    let root = x;
    while (parent[root] !== root) {
      root = parent[root];
    }
    let curr = x;
    while (curr !== root) {
      const next = parent[curr];
      parent[curr] = root;
      curr = next;
    }
    return root;
  };

  const union = (a: number, b: number): void => {
    let ra = find(a);
    let rb = find(b);
    if (ra === rb) return;
    if (compSize[ra] < compSize[rb]) {
      const tmp = ra;
      ra = rb;
      rb = tmp;
    }
    parent[rb] = ra;
    compSize[ra] += compSize[rb];
    components--;
  };

  const out: string[] = [];
  for (let i = 1; i <= q && i < lines.length; i++) {
    const parts = lines[i].trim().split(/\\s+/);
    const cmd = parts[0];
    if (cmd === 'LINK') {
      union(Number(parts[1]), Number(parts[2]));
    } else if (cmd === 'CHECK') {
      out.push(find(Number(parts[1])) === find(Number(parts[2])) ? 'CONNECTED' : 'ISOLATED');
    } else if (cmd === 'INFO') {
      const r = find(Number(parts[1]));
      out.push(\`size=\${compSize[r]} components=\${components}\`);
    }
  }

  return out.join('\\n');
}
`,
          testCases: [
            {
              id: 's6-p5-c4-t1',
              name: 'Tracks transitive connectivity, cluster sizes, and component counts',
              args: [`5 7\nCHECK 1 3\nLINK 1 2\nLINK 2 3\nCHECK 1 3\nINFO 2\nLINK 4 5\nINFO 4`],
              expected: `ISOLATED\nCONNECTED\nsize=3 components=3\nsize=2 components=2`,
            },
            {
              id: 's6-p5-c4-t2',
              name: 'Redundant LINK inside same component does not double-decrement components',
              args: [`3 5\nLINK 1 2\nLINK 2 1\nLINK 1 2\nINFO 1\nCHECK 2 3`],
              expected: `size=2 components=2\nISOLATED`,
            },
            {
              id: 's6-p5-c4-t3',
              name: 'Reflexive CHECK u u is always CONNECTED',
              args: [`4 2\nCHECK 4 4\nINFO 4`],
              expected: `CONNECTED\nsize=1 components=4`,
            },
            {
              id: 's6-p5-c4-t4',
              name: 'Hidden: Merging two multi-node trees collapses into 1 component',
              hidden: true,
              args: [`4 5\nLINK 1 2\nLINK 3 4\nLINK 2 4\nCHECK 1 3\nINFO 1`],
              expected: `CONNECTED\nsize=4 components=1`,
            },
            {
              id: 's6-p5-c4-t5',
              name: 'Hidden: Single node network N=1',
              hidden: true,
              args: [`1 2\nLINK 1 1\nINFO 1`],
              expected: `size=1 components=1`,
            },
          ],
        },
      ],
    },
  ],
  miniProject: {
    id: 's6-mp',
    title: 'Mini Type-Safe Schema Validator (mini-zod)',
    subtitle: '4-file runtime validator + static type-inference engine supporting primitives, literals, arrays, objects, and optional fields',
    difficulty: 'master',
    description: `Build **\`mini-zod\`**, a Type-Safe Schema Validation Library where defining a runtime validator **automatically synthesizes the exact static TypeScript type** via \`Infer<typeof schema>\`!

### Module Architecture (4 Files)
1. \`types.ts\`:
   - \`SafeParseResult<T>\` (\`{ success: true; data: T } | { success: false; errors: string[] }\`).
   - \`abstract class Schema<T>\` with \`abstract _parse(input: unknown, path: string): SafeParseResult<T>\`, \`safeParse(input: unknown): SafeParseResult<T>\`, \`parse(input: unknown): T\`, and \`.optional(): Schema<T | undefined>\`.
   - \`export type Infer<S extends Schema<unknown>> = S extends Schema<infer T> ? T : never;\`
   - \`formatIssue(path: string, message: string): string\` formatting \`"\${path || '<root>'}: \${message}"\`.
2. \`primitives.ts\`:
   - \`stringSchema()\`, \`numberSchema()\` (reject \`NaN\`!), \`booleanSchema()\`, and \`literalSchema<L extends string | number | boolean>(expected: L): Schema<L>\`.
3. \`composites.ts\`:
   - \`arraySchema<Item>(itemSchema: Schema<Item>): Schema<Item[]>\` validating \`Array.isArray\` and element paths \`"\${path}[\${i}]"\` (collecting **all** element errors!).
   - \`objectSchema<Shape extends Record<string, Schema<unknown>>>(shape: Shape): Schema<InferObjectShape<Shape>>\`:
     - Rejects \`null\`, primitives, and arrays!
     - Keys whose schema accepts \`undefined\` (\`undefined extends Infer<Shape[K]>\`) become **optional \`?\` properties** on the inferred object type; other keys are required!
     - Validates nested paths as \`path ? \`\${path}.\${key}\` : key\`, collecting all field errors, and strips unknown extra properties not declared in \`shape\` (or copies validated keys cleanly into the output object—omit keys whose value is \`undefined\` when optional, or include validated keys cleanly).
4. \`index.ts\`:
   - Exports \`s = { string, number, boolean, literal, array, object }\`, \`Schema\`, and types \`Infer\`, \`SafeParseResult\`.`,
    architectureNotes: `- Notice how \`InferObjectShape<Shape>\` separates required keys (\`undefined extends Infer<Shape[K]> ? never : K\`) from optional keys (\`undefined extends Infer<Shape[K]> ? K : never\`) and flattens the intersection with \`Prettify<...>\`!
- Never use \`any\`: \`Schema<unknown>\` works seamlessly as the top constraint because \`Schema<T>\` only uses \`T\` covariantly in return positions!`,
    tags: ['Mini-Project', 'Schema Validation', 'Zod', 'Type Inference', 'Mapped Types'],
    hints: [
      'In types.ts, implement OptionalSchema<T> extends Schema<T | undefined> whose _parse returns { success: true, data: undefined } immediately when input === undefined, otherwise delegates to inner._parse(input, path).',
      'In numberSchema(), verify `typeof input === "number" && !Number.isNaN(input)` so NaN is rejected.',
      'In objectSchema(), check `typeof input === "object" && input !== null && !Array.isArray(input)` before iterating `Object.keys(shape)`.',
    ],
    entryFile: 'index.ts',
    files: [
      {
        path: 'types.ts',
        description: 'Core Schema<T> base class, OptionalSchema, SafeParseResult, and Infer<S> utility',
        starterCode: `export type ParseSuccess<T> = {
  readonly success: true;
  readonly data: T;
};

export type ParseFailure = {
  readonly success: false;
  readonly errors: string[];
};

export type SafeParseResult<T> = ParseSuccess<T> | ParseFailure;

export function formatIssue(path: string, message: string): string {
  const loc = path.length > 0 ? path : '<root>';
  return \`\${loc}: \${message}\`;
}

export abstract class Schema<T> {
  abstract _parse(input: unknown, path: string): SafeParseResult<T>;

  safeParse(input: unknown): SafeParseResult<T> {
    return this._parse(input, '');
  }

  parse(input: unknown): T {
    const res = this.safeParse(input);
    if (!res.success) {
      throw new Error(res.errors.join('; '));
    }
    return res.data;
  }

  optional(): Schema<T | undefined> {
    throw new Error('TODO: implement optional()');
  }
}

export type Infer<_S extends Schema<unknown>> = unknown;
`,
        referenceSolution: `export type ParseSuccess<T> = {
  readonly success: true;
  readonly data: T;
};

export type ParseFailure = {
  readonly success: false;
  readonly errors: string[];
};

export type SafeParseResult<T> = ParseSuccess<T> | ParseFailure;

export function formatIssue(path: string, message: string): string {
  const loc = path.length > 0 ? path : '<root>';
  return \`\${loc}: \${message}\`;
}

export abstract class Schema<T> {
  abstract _parse(input: unknown, path: string): SafeParseResult<T>;

  safeParse(input: unknown): SafeParseResult<T> {
    return this._parse(input, '');
  }

  parse(input: unknown): T {
    const res = this.safeParse(input);
    if (!res.success) {
      throw new Error(res.errors.join('; '));
    }
    return res.data;
  }

  optional(): Schema<T | undefined> {
    return new OptionalSchema(this);
  }
}

class OptionalSchema<T> extends Schema<T | undefined> {
  private readonly inner: Schema<T>;

  constructor(inner: Schema<T>) {
    super();
    this.inner = inner;
  }

  _parse(input: unknown, path: string): SafeParseResult<T | undefined> {
    if (input === undefined) {
      return { success: true, data: undefined };
    }
    return this.inner._parse(input, path);
  }
}

export type Infer<S extends Schema<unknown>> = S extends Schema<infer T> ? T : never;
`,
      },
      {
        path: 'primitives.ts',
        description: 'Primitive and literal runtime schemas (string, number, boolean, literal)',
        starterCode: `import { Schema, formatIssue } from './types';
import type { SafeParseResult } from './types';

class UnimplementedSchema<T> extends Schema<T> {
  _parse(_input: unknown, path: string): SafeParseResult<T> {
    return { success: false, errors: [formatIssue(path, 'unimplemented')] };
  }
}

export function stringSchema(): Schema<string> {
  return new UnimplementedSchema<string>();
}

export function numberSchema(): Schema<number> {
  return new UnimplementedSchema<number>();
}

export function booleanSchema(): Schema<boolean> {
  return new UnimplementedSchema<boolean>();
}

export function literalSchema<L extends string | number | boolean>(_value: L): Schema<L> {
  return new UnimplementedSchema<L>();
}
`,
        referenceSolution: `import { Schema, formatIssue } from './types';
import type { SafeParseResult } from './types';

class StringSchema extends Schema<string> {
  _parse(input: unknown, path: string): SafeParseResult<string> {
    if (typeof input === 'string') {
      return { success: true, data: input };
    }
    return { success: false, errors: [formatIssue(path, 'Expected string')] };
  }
}

class NumberSchema extends Schema<number> {
  _parse(input: unknown, path: string): SafeParseResult<number> {
    if (typeof input === 'number' && !Number.isNaN(input)) {
      return { success: true, data: input };
    }
    return { success: false, errors: [formatIssue(path, 'Expected valid number')] };
  }
}

class BooleanSchema extends Schema<boolean> {
  _parse(input: unknown, path: string): SafeParseResult<boolean> {
    if (typeof input === 'boolean') {
      return { success: true, data: input };
    }
    return { success: false, errors: [formatIssue(path, 'Expected boolean')] };
  }
}

class LiteralSchema<L extends string | number | boolean> extends Schema<L> {
  private readonly expected: L;

  constructor(expected: L) {
    super();
    this.expected = expected;
  }

  _parse(input: unknown, path: string): SafeParseResult<L> {
    if (input === this.expected) {
      return { success: true, data: this.expected };
    }
    return {
      success: false,
      errors: [formatIssue(path, \`Expected literal \${JSON.stringify(this.expected)}\`)],
    };
  }
}

export function stringSchema(): Schema<string> {
  return new StringSchema();
}

export function numberSchema(): Schema<number> {
  return new NumberSchema();
}

export function booleanSchema(): Schema<boolean> {
  return new BooleanSchema();
}

export function literalSchema<L extends string | number | boolean>(value: L): Schema<L> {
  return new LiteralSchema(value);
}
`,
      },
      {
        path: 'composites.ts',
        description: 'Array and Object composite schemas with path-prefixed error aggregation and optional-key inference',
        starterCode: `import { Schema, formatIssue } from './types';
import type { Infer, SafeParseResult } from './types';

export type InferObjectShape<Shape extends Record<string, Schema<unknown>>> = {
  [K in keyof Shape]: Infer<Shape[K]>;
};

class DummyComposite<T> extends Schema<T> {
  _parse(_input: unknown, path: string): SafeParseResult<T> {
    return { success: false, errors: [formatIssue(path, 'TODO')] };
  }
}

export function arraySchema<Item>(_itemSchema: Schema<Item>): Schema<Item[]> {
  return new DummyComposite<Item[]>();
}

export function objectSchema<Shape extends Record<string, Schema<unknown>>>(
  _shape: Shape
): Schema<InferObjectShape<Shape>> {
  return new DummyComposite<InferObjectShape<Shape>>();
}
`,
        referenceSolution: `import { Schema, formatIssue } from './types';
import type { Infer, SafeParseResult } from './types';

type Prettify<T> = {
  [K in keyof T]: T[K];
};

type OptionalShapeKeys<Shape extends Record<string, Schema<unknown>>> = {
  [K in keyof Shape]: undefined extends Infer<Shape[K]> ? K : never;
}[keyof Shape];

type RequiredShapeKeys<Shape extends Record<string, Schema<unknown>>> = {
  [K in keyof Shape]: undefined extends Infer<Shape[K]> ? never : K;
}[keyof Shape];

export type InferObjectShape<Shape extends Record<string, Schema<unknown>>> = Prettify<
  {
    [K in RequiredShapeKeys<Shape>]: Infer<Shape[K]>;
  } & {
    [K in OptionalShapeKeys<Shape>]?: Exclude<Infer<Shape[K]>, undefined>;
  }
>;

class ArraySchema<Item> extends Schema<Item[]> {
  private readonly itemSchema: Schema<Item>;

  constructor(itemSchema: Schema<Item>) {
    super();
    this.itemSchema = itemSchema;
  }

  _parse(input: unknown, path: string): SafeParseResult<Item[]> {
    if (!Array.isArray(input)) {
      return { success: false, errors: [formatIssue(path, 'Expected array')] };
    }

    const out: Item[] = [];
    const errors: string[] = [];

    for (let i = 0; i < input.length; i++) {
      const itemPath = \`\${path}[\${i}]\`;
      const res = this.itemSchema._parse(input[i], itemPath);
      if (res.success) {
        out.push(res.data);
      } else {
        errors.push(...res.errors);
      }
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }
    return { success: true, data: out };
  }
}

class ObjectSchema<Shape extends Record<string, Schema<unknown>>> extends Schema<
  InferObjectShape<Shape>
> {
  private readonly shape: Shape;

  constructor(shape: Shape) {
    super();
    this.shape = shape;
  }

  _parse(input: unknown, path: string): SafeParseResult<InferObjectShape<Shape>> {
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
      return { success: false, errors: [formatIssue(path, 'Expected plain object')] };
    }

    const record = input as Record<string, unknown>;
    const resultObj: Record<string, unknown> = {};
    const errors: string[] = [];

    for (const key of Object.keys(this.shape)) {
      const fieldSchema = this.shape[key];
      const fieldPath = path.length > 0 ? \`\${path}.\${key}\` : key;
      const res = fieldSchema._parse(record[key], fieldPath);
      if (res.success) {
        if (res.data !== undefined || key in record) {
          resultObj[key] = res.data;
        }
      } else {
        errors.push(...res.errors);
      }
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }
    return { success: true, data: resultObj as InferObjectShape<Shape> };
  }
}

export function arraySchema<Item>(itemSchema: Schema<Item>): Schema<Item[]> {
  return new ArraySchema(itemSchema);
}

export function objectSchema<Shape extends Record<string, Schema<unknown>>>(
  shape: Shape
): Schema<InferObjectShape<Shape>> {
  return new ObjectSchema(shape);
}
`,
      },
      {
        path: 'index.ts',
        description: 'Public builder facade s and exported schema inference types',
        starterCode: `import { arraySchema, objectSchema } from './composites';
import { booleanSchema, literalSchema, numberSchema, stringSchema } from './primitives';

export { Schema } from './types';
export type { Infer, ParseFailure, ParseSuccess, SafeParseResult } from './types';

export const s = {
  string: stringSchema,
  number: numberSchema,
  boolean: booleanSchema,
  literal: literalSchema,
  array: arraySchema,
  object: objectSchema,
};
`,
        referenceSolution: `import { arraySchema, objectSchema } from './composites';
import { booleanSchema, literalSchema, numberSchema, stringSchema } from './primitives';

export { Schema } from './types';
export type { Infer, ParseFailure, ParseSuccess, SafeParseResult } from './types';

export const s = {
  string: stringSchema,
  number: numberSchema,
  boolean: booleanSchema,
  literal: literalSchema,
  array: arraySchema,
  object: objectSchema,
};
`,
      },
    ],
    typeAssertionPrelude: `import { s } from './index';
import type { Infer } from './index';

const userSchema = s.object({
  id: s.number(),
  name: s.string(),
  tags: s.array(s.string()),
  role: s.literal('admin').optional(),
});

const nestedOrgSchema = s.object({
  org: s.string(),
  active: s.boolean(),
  members: s.array(userSchema),
});`,
    typeAssertions: [
      {
        id: 's6-mp-a1',
        name: 'Infers exact User type with literal union and optional "?" property',
        assertion: `Expect<Alike<Infer<typeof userSchema>, { id: number; name: string; tags: string[]; role?: 'admin' }>>`,
      },
      {
        id: 's6-mp-a2',
        name: 'Infers nested composite arrays and objects recursively',
        assertion: `Expect<Alike<Infer<typeof nestedOrgSchema>, {
          org: string;
          active: boolean;
          members: Array<{ id: number; name: string; tags: string[]; role?: 'admin' }>;
        }>>`,
      },
      {
        id: 's6-mp-a3',
        name: 'safeParse narrows discriminated union data branch to Infer<typeof userSchema>',
        isBlock: true,
        assertion: `const parsed = userSchema.safeParse(null);
if (parsed.success) {
  type DataCheck = Expect<Alike<typeof parsed.data, { id: number; name: string; tags: string[]; role?: 'admin' }>>;
} else {
  type ErrCheck = Expect<Equal<typeof parsed.errors, string[]>>;
}`,
      },
      {
        id: 's6-mp-a4',
        name: 'Hidden: Primitive and literal schemas infer narrow static types',
        hidden: true,
        assertion: `Expect<Equal<[Infer<ReturnType<typeof s.boolean>>, ReturnType<typeof s.literal<42>> extends import('./index').Schema<infer L> ? L : never], [boolean, 42]>>`,
      },
    ],
    testCases: [
      {
        id: 's6-mp-t1',
        name: 'Validates complete object with optional literal and strips unknown extra fields',
        harnessCode: `
          const { s } = exports as { s: any };
          const userSchema = s.object({
            id: s.number(),
            name: s.string(),
            tags: s.array(s.string()),
            role: s.literal('admin').optional(),
          });
          return userSchema.safeParse({
            id: 1,
            name: 'Ada',
            tags: ['ts', 'compiler'],
            role: 'admin',
            injectedSecret: true,
          });
        `,
        expected: {
          success: true,
          data: { id: 1, name: 'Ada', tags: ['ts', 'compiler'], role: 'admin' },
        },
      },
      {
        id: 's6-mp-t2',
        name: 'Allows omitting optional fields cleanly',
        harnessCode: `
          const { s } = exports as { s: any };
          const schema = s.object({
            id: s.number(),
            role: s.literal('admin').optional(),
          });
          const res = schema.safeParse({ id: 42 });
          return { success: res.success, id: res.data?.id, role: res.data?.role };
        `,
        expected: { success: true, id: 42, role: undefined },
      },
      {
        id: 's6-mp-t3',
        name: 'Aggregates nested object and array element path errors',
        harnessCode: `
          const { s } = exports as { s: any };
          const teamSchema = s.object({
            lead: s.object({ email: s.string() }),
            scores: s.array(s.number()),
          });
          const res = teamSchema.safeParse({
            lead: { email: 999 },
            scores: [10, 'bad', Number.NaN],
          });
          return {
            success: res.success,
            count: !res.success ? res.errors.length : 0,
            hasEmailPath: !res.success && res.errors.some((e: string) => e.startsWith('lead.email:')),
            hasIdx1: !res.success && res.errors.some((e: string) => e.startsWith('scores[1]:')),
            hasIdx2: !res.success && res.errors.some((e: string) => e.startsWith('scores[2]:')),
          };
        `,
        expected: {
          success: false,
          count: 3,
          hasEmailPath: true,
          hasIdx1: true,
          hasIdx2: true,
        },
      },
      {
        id: 's6-mp-t4',
        name: 'Rejects null, arrays, and primitives passed into s.object()',
        harnessCode: `
          const { s } = exports as { s: any };
          const obj = s.object({ a: s.string() });
          return [
            obj.safeParse(null).success,
            obj.safeParse([1, 2]).success,
            obj.safeParse('str').success,
            obj.safeParse(undefined).success,
          ];
        `,
        expected: [false, false, false, false],
      },
      {
        id: 's6-mp-t5',
        name: 'Hidden: parse() returns typed data on valid input and throws Error on invalid input',
        hidden: true,
        harnessCode: `
          const { s } = exports as { s: any };
          const flag = s.boolean();
          const ok = flag.parse(false);
          let threw = false;
          try { flag.parse('false'); } catch { threw = true; }
          return { ok, threw };
        `,
        expected: { ok: false, threw: true },
      },
      {
        id: 's6-mp-t6',
        name: 'Hidden: Rejects wrong literal value even when field is optional()',
        hidden: true,
        harnessCode: `
          const { s } = exports as { s: any };
          const schema = s.object({ role: s.literal('admin').optional() });
          const bad = schema.safeParse({ role: 'guest' });
          return {
            success: bad.success,
            mentionsRole: !bad.success && bad.errors[0].startsWith('role:'),
          };
        `,
        expected: { success: false, mentionsRole: true },
      },
    ],
  },
  exam: {
    id: 's6-exam',
    title: 'Section 6 Grand-Finale Mastery Exam: Full-Spectrum TypeScript',
    subtitle: '5 capstone tasks spanning endpoint AST types, recursive key remapping, bounded-stop shortest paths, async DAG execution, and DP edit distance',
    coveredSections: [1, 2, 3, 4, 5, 6],
    passingScore: 1,
    description:
      'The ultimate TypeCraft Academy examination covering Sections 1–6 without hints: parse HTTP endpoint specifications at the type level, recursively camelCase nested API payloads, solve hop-constrained shortest paths, execute concurrent dependency DAGs, and compute Levenshtein edit distances.',
    tasks: [
      {
        id: 's6-exam-t1',
        title: 'Compile-Time Endpoint Spec Parser (ParseEndpoint<Spec>)',
        style: 'type-challenge',
        difficulty: 'master',
        description: `Implement \`ParseEndpoint<Spec extends string>\` for REST route strings formatted as \`"<METHOD> <PATH>"\` (with an optional \`?<QUERY>\` suffix):

- Example: \`ParseEndpoint<'GET /teams/:teamId/users/:userId?active=true'>\` evaluates to:
  \`\`\`ts
  {
    method: 'GET';
    params: { teamId: string; userId: string };
    hasQuery: true;
  }
  \`\`\`
- If there is no \`?\` in \`<PATH>\` (or nothing after \`?\`, wait: treat presence of \`?\` as \`hasQuery: true\`, absence of \`?\` as \`hasQuery: false\`!), extract \`:param\` segments **only** from the path portion before \`?\`.
- If \`Spec\` has no space separating method and path, return \`never\`.`,
        tags: ['Exam', 'Type Challenge', 'Template Literals', 'REST'],
        hints: [],
        starterCode: `export type ParseEndpoint<Spec extends string> = unknown;
`,
        referenceSolution: `type Prettify<T> = {
  [K in keyof T]: T[K];
};

type SegParam<Seg extends string> = Seg extends \`:\${infer Name}\`
  ? Name extends ''
    ? {}
    : { [K in Name]: string }
  : {};

type ExtractParams<Path extends string> = Path extends \`\${infer Seg}/\${infer Rest}\`
  ? SegParam<Seg> & ExtractParams<Rest>
  : SegParam<Path>;

export type ParseEndpoint<Spec extends string> =
  Spec extends \`\${infer Method} \${infer RawUrl}\`
    ? RawUrl extends \`\${infer CleanPath}?\${string}\`
      ? {
          method: Method;
          params: Prettify<ExtractParams<CleanPath>>;
          hasQuery: true;
        }
      : {
          method: Method;
          params: Prettify<ExtractParams<RawUrl>>;
          hasQuery: false;
        }
    : never;
`,
        astRules: { requireGenerics: true },
        typeAssertionPrelude: `import type { ParseEndpoint } from './solution';`,
        typeAssertions: [
          {
            id: 's6-exam-t1-a1',
            name: 'Parses method, multiple path params, and query flag without leaking query into last param name',
            assertion: `Expect<Equal<
              ParseEndpoint<'GET /teams/:teamId/users/:userId?role=lead'>,
              { method: 'GET'; params: { teamId: string; userId: string }; hasQuery: true }
            >>`,
          },
          {
            id: 's6-exam-t1-a2',
            name: 'Handles static endpoints without params or query string',
            assertion: `Expect<Equal<
              ParseEndpoint<'POST /auth/logout'>,
              { method: 'POST'; params: {}; hasQuery: false }
            >>`,
          },
          {
            id: 's6-exam-t1-a3',
            name: 'Returns never on malformed spec without space',
            assertion: `Expect<Equal<ParseEndpoint<'/missing-method'>, never>>`,
          },
          {
            id: 's6-exam-t1-a4',
            name: 'Hidden: Distributes over union of endpoint specs',
            hidden: true,
            assertion: `Expect<Equal<
              ParseEndpoint<'DELETE /items/:id' | 'GET /items?limit=10'>,
              | { method: 'DELETE'; params: { id: string }; hasQuery: false }
              | { method: 'GET'; params: {}; hasQuery: true }
            >>`,
          },
          {
            id: 's6-exam-t1-a5',
            name: 'Hidden: Handles trailing question mark as hasQuery: true',
            hidden: true,
            assertion: `Expect<Equal<ParseEndpoint<'PATCH /nodes/:nodeId?'>, { method: 'PATCH'; params: { nodeId: string }; hasQuery: true }>>`,
          },
        ],
        testCases: [],
      },
      {
        id: 's6-exam-t2',
        title: 'Recursive Snake-to-Camel Key Remapper (DeepCamelKeys<T>)',
        style: 'type-challenge',
        difficulty: 'master',
        description: `Implement \`DeepCamelKeys<T>\` that recursively converts \`snake_case\` object property keys into \`camelCase\`:

- \`'created_at'\` $\\rightarrow$ \`'createdAt'\`, \`'oauth_refresh_token'\` $\\rightarrow$ \`'oauthRefreshToken'\`.
- Functions (\`(...args: never) => unknown\`) remain unchanged.
- Mutable arrays \`Array<U>\` become \`Array<DeepCamelKeys<U>>\`; \`ReadonlyArray<U>\` becomes \`ReadonlyArray<DeepCamelKeys<U>>\`.
- Plain objects remap string keys via \`SnakeToCamel<K>\` while preserving \`readonly\` and optional \`?\` modifiers!`,
        tags: ['Exam', 'Type Challenge', 'Key Remapping', 'Recursive Types'],
        hints: [],
        starterCode: `export type DeepCamelKeys<T> = T;
`,
        referenceSolution: `type CamelRest<S extends string> = S extends \`_\${infer Rest}\`
  ? CamelRest<Rest>
  : S extends ''
    ? ''
    : S extends \`\${infer Part}_\${infer Rest}\`
      ? \`\${Capitalize<Part>}\${CamelRest<Rest>}\`
      : Capitalize<S>;

type SnakeToCamel<S extends string> = S extends \`_\${infer Rest}\`
  ? SnakeToCamel<Rest>
  : S extends \`\${infer First}_\${infer Rest}\`
    ? \`\${First}\${CamelRest<Rest>}\`
    : S;

export type DeepCamelKeys<T> = T extends (...args: never) => unknown
  ? T
  : T extends Array<infer U>
    ? Array<DeepCamelKeys<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepCamelKeys<U>>
      : T extends object
        ? {
            [K in keyof T as K extends string ? SnakeToCamel<K> : K]: DeepCamelKeys<T[K]>;
          }
        : T;
`,
        astRules: { requireGenerics: true },
        typeAssertionPrelude: `import type { DeepCamelKeys } from './solution';

interface RawApiUser {
  readonly user_id: number;
  first_name: string;
  contact_info?: {
    primary_email: string;
    phone_numbers: Array<{ country_code: string; is_verified: boolean }>;
  };
  on_audit: (event_name: string) => void;
}`,
        typeAssertions: [
          {
            id: 's6-exam-t2-a1',
            name: 'Transforms nested objects and arrays of objects while keeping modifiers and function signatures',
            assertion: `Expect<Equal<DeepCamelKeys<RawApiUser>, {
              readonly userId: number;
              firstName: string;
              contactInfo?: {
                primaryEmail: string;
                phoneNumbers: Array<{ countryCode: string; isVerified: boolean }>;
              };
              onAudit: (event_name: string) => void;
            }>>`,
          },
          {
            id: 's6-exam-t2-a2',
            name: 'Preserves ReadonlyArray wrapper around transformed item shapes',
            assertion: `Expect<Equal<DeepCamelKeys<ReadonlyArray<{ max_retry_count: number }>>, ReadonlyArray<{ maxRetryCount: number }>>>`,
          },
          {
            id: 's6-exam-t2-a3',
            name: 'Leaves already camelCase keys and primitives untouched',
            assertion: `Expect<Equal<DeepCamelKeys<{ alreadyCamel: boolean }>, { alreadyCamel: boolean }>>`,
          },
          {
            id: 's6-exam-t2-a4',
            name: 'Hidden: Normalizes consecutive underscores in keys',
            hidden: true,
            assertion: `Expect<Equal<DeepCamelKeys<{ api__secret__key: string }>, { apiSecretKey: string }>>`,
          },
          {
            id: 's6-exam-t2-a5',
            name: 'Hidden: Distributes cleanly over union responses',
            hidden: true,
            assertion: `Expect<Equal<DeepCamelKeys<{ ok_data: number } | { error_code: string }>, { okData: number } | { errorCode: string }>>`,
          },
        ],
        testCases: [],
      },
      {
        id: 's6-exam-t3',
        title: 'Cheapest Flight Within K Stops (cheapestFlightWithinStops)',
        style: 'leetcode',
        difficulty: 'hard',
        entryFunction: 'cheapestFlightWithinStops',
        description: `Given \`cityCount\` cities (\`0 .. cityCount - 1\`), directed flights \`flights: readonly (readonly [from: number, to: number, price: number])[]\`, \`src\`, \`dst\`, and \`maxStops\` (\`>= 0\`), return the **minimum price** from \`src\` to \`dst\` using **at most \`maxStops\` intermediate stops** (i.e. at most \`maxStops + 1\` flight legs), or \`-1\` if no such route exists.

- Do not mutate \`flights\`.`,
        tags: ['Exam', 'Graphs', 'Dynamic Programming', 'Bellman-Ford'],
        hints: [],
        starterCode: `export function cheapestFlightWithinStops(
  _cityCount: number,
  _flights: readonly (readonly [number, number, number])[],
  _src: number,
  _dst: number,
  _maxStops: number
): number {
  return -1;
}
`,
        referenceSolution: `export function cheapestFlightWithinStops(
  cityCount: number,
  flights: readonly (readonly [number, number, number])[],
  src: number,
  dst: number,
  maxStops: number
): number {
  if (src < 0 || src >= cityCount || dst < 0 || dst >= cityCount) return -1;
  if (src === dst) return 0;

  let costs = new Array<number>(cityCount).fill(Number.POSITIVE_INFINITY);
  costs[src] = 0;

  const maxEdges = maxStops + 1;
  for (let step = 0; step < maxEdges; step++) {
    const next = [...costs];
    let changed = false;
    for (const [u, v, price] of flights) {
      if (costs[u] !== Number.POSITIVE_INFINITY && costs[u] + price < next[v]) {
        next[v] = costs[u] + price;
        changed = true;
      }
    }
    costs = next;
    if (!changed) break;
  }

  return Number.isFinite(costs[dst]) ? costs[dst] : -1;
}
`,
        testCases: [
          {
            id: 's6-exam-t3-c1',
            name: 'Respects stop limit when cheaper route has too many stops',
            args: [
              4,
              [
                [0, 1, 100],
                [1, 2, 100],
                [2, 3, 100],
                [0, 2, 500],
              ],
              0,
              3,
              1,
            ],
            expected: 600,
            checkImmutability: true,
          },
          {
            id: 's6-exam-t3-c2',
            name: 'Unlocks cheaper multi-hop route when maxStops allows it',
            args: [
              4,
              [
                [0, 1, 100],
                [1, 2, 100],
                [2, 3, 100],
                [0, 2, 500],
              ],
              0,
              3,
              2,
            ],
            expected: 300,
            checkImmutability: true,
          },
          {
            id: 's6-exam-t3-c3',
            name: 'Zero stops allows only direct flight',
            args: [
              3,
              [
                [0, 1, 50],
                [1, 2, 50],
                [0, 2, 250],
              ],
              0,
              2,
              0,
            ],
            expected: 250,
            checkImmutability: true,
          },
          {
            id: 's6-exam-t3-c4',
            name: 'Hidden: Returns -1 when destination cannot be reached within maxStops',
            hidden: true,
            args: [
              4,
              [
                [0, 1, 10],
                [1, 2, 10],
                [2, 3, 10],
              ],
              0,
              3,
              1,
            ],
            expected: -1,
            checkImmutability: true,
          },
          {
            id: 's6-exam-t3-c5',
            name: 'Hidden: Same source and destination returns 0',
            hidden: true,
            args: [3, [[0, 1, 80]], 1, 1, 0],
            expected: 0,
          },
        ],
      },
      {
        id: 's6-exam-t4',
        title: 'Concurrent Async Dependency DAG Runner (runTaskGraph)',
        style: 'leetcode',
        difficulty: 'hard',
        description: `Implement \`runTaskGraph<T>(nodes)\` to execute a Directed Acyclic Graph of async tasks:

\`\`\`ts
export interface DagTask<T> {
  readonly id: string;
  readonly deps: readonly string[];
  readonly run: (depResults: Readonly<Record<string, T>>) => Promise<T>;
}
\`\`\`

- Validate upfront:
  - Throw an \`Error\` if any \`dep\` references a task \`id\` that does not exist in \`nodes\`.
  - Throw an \`Error\` if the dependency graph contains a **cycle** (including self-dependency \`id\` in \`deps\`).
- Execute ready tasks **concurrently** as soon as all their \`deps\` have resolved, passing an object containing their direct dependencies' resolved values (\`depResults[depId]\`).
- Return \`Record<string, T>\` mapping every task \`id\` to its resolved output.`,
        tags: ['Exam', 'Async/Await', 'Topological Sort', 'DAG', 'Concurrency'],
        hints: [],
        starterCode: `export interface DagTask<T> {
  readonly id: string;
  readonly deps: readonly string[];
  readonly run: (depResults: Readonly<Record<string, T>>) => Promise<T>;
}

export async function runTaskGraph<T>(
  _nodes: readonly DagTask<T>[]
): Promise<Record<string, T>> {
  return {};
}
`,
        referenceSolution: `export interface DagTask<T> {
  readonly id: string;
  readonly deps: readonly string[];
  readonly run: (depResults: Readonly<Record<string, T>>) => Promise<T>;
}

export async function runTaskGraph<T>(
  nodes: readonly DagTask<T>[]
): Promise<Record<string, T>> {
  if (nodes.length === 0) return {};

  const taskMap = new Map<string, DagTask<T>>();
  const inDegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();

  for (const node of nodes) {
    if (taskMap.has(node.id)) {
      throw new Error(\`Duplicate task id: \${node.id}\`);
    }
    taskMap.set(node.id, node);
    inDegree.set(node.id, 0);
    dependents.set(node.id, []);
  }

  for (const node of nodes) {
    const uniqueDeps = new Set(node.deps);
    inDegree.set(node.id, uniqueDeps.size);
    for (const dep of uniqueDeps) {
      const list = dependents.get(dep);
      if (!list) {
        throw new Error(\`Unknown dependency '\${dep}' referenced by '\${node.id}'\`);
      }
      list.push(node.id);
    }
  }

  // Kahn topological check for cycles upfront
  const simDegree = new Map(inDegree);
  const queue: string[] = [];
  for (const [id, deg] of simDegree) {
    if (deg === 0) queue.push(id);
  }
  let visited = 0;
  while (queue.length > 0) {
    const curr = queue.shift() as string;
    visited++;
    for (const child of dependents.get(curr) ?? []) {
      const nextDeg = (simDegree.get(child) as number) - 1;
      simDegree.set(child, nextDeg);
      if (nextDeg === 0) queue.push(child);
    }
  }
  if (visited !== nodes.length) {
    throw new Error('Cycle detected in task graph');
  }

  // Launch each node lazily/memoized once deps settle
  const promises = new Map<string, Promise<T>>();
  const launch = (id: string): Promise<T> => {
    const existing = promises.get(id);
    if (existing) return existing;

    const node = taskMap.get(id) as DagTask<T>;
    const p = (async (): Promise<T> => {
      const depEntries = await Promise.all(
        node.deps.map(async (depId): Promise<[string, T]> => [depId, await launch(depId)])
      );
      const depRecord: Record<string, T> = {};
      for (const [k, v] of depEntries) {
        depRecord[k] = v;
      }
      return node.run(depRecord);
    })();

    promises.set(id, p);
    return p;
  };

  const pairs = await Promise.all(
    nodes.map(async (n): Promise<[string, T]> => [n.id, await launch(n.id)])
  );

  const output: Record<string, T> = {};
  for (const [k, v] of pairs) {
    output[k] = v;
  }
  return output;
}
`,
        astRules: { requireAsync: true, requireGenerics: true },
        testCases: [
          {
            id: 's6-exam-t4-c1',
            name: 'Runs independent branches concurrently and passes resolved dep values',
            harnessCode: `
              const { runTaskGraph } = exports as { runTaskGraph: any };
              const t0 = performance.now();
              const res = await runTaskGraph([
                {
                  id: 'config',
                  deps: [],
                  run: async () => 10,
                },
                {
                  id: 'branchA',
                  deps: ['config'],
                  run: async (d: Record<string, number>) => {
                    await new Promise((r) => setTimeout(r, 12));
                    return d.config + 5;
                  },
                },
                {
                  id: 'branchB',
                  deps: ['config'],
                  run: async (d: Record<string, number>) => {
                    await new Promise((r) => setTimeout(r, 12));
                    return d.config * 2;
                  },
                },
                {
                  id: 'join',
                  deps: ['branchA', 'branchB'],
                  run: async (d: Record<string, number>) => d.branchA + d.branchB,
                },
              ]);
              const parallel = performance.now() - t0 < 23;
              return { res, parallel };
            `,
            expected: {
              res: { config: 10, branchA: 15, branchB: 20, join: 35 },
              parallel: true,
            },
          },
          {
            id: 's6-exam-t4-c2',
            name: 'Detects 2-node and 3-node cycles and rejects immediately',
            harnessCode: `
              const { runTaskGraph } = exports as { runTaskGraph: any };
              let ran = false;
              let rejected = false;
              try {
                await runTaskGraph([
                  { id: 'a', deps: ['c'], run: async () => { ran = true; return 1; } },
                  { id: 'b', deps: ['a'], run: async () => 2 },
                  { id: 'c', deps: ['b'], run: async () => 3 },
                ]);
              } catch {
                rejected = true;
              }
              return { ran, rejected };
            `,
            expected: { ran: false, rejected: true },
          },
          {
            id: 's6-exam-t4-c3',
            name: 'Rejects unknown missing dependency IDs',
            harnessCode: `
              const { runTaskGraph } = exports as { runTaskGraph: any };
              try {
                await runTaskGraph([
                  { id: 'build', deps: ['nonExistent'], run: async () => 'ok' },
                ]);
                return false;
              } catch {
                return true;
              }
            `,
            expected: true,
          },
          {
            id: 's6-exam-t4-c4',
            name: 'Hidden: Self-dependency is caught as a cycle',
            hidden: true,
            harnessCode: `
              const { runTaskGraph } = exports as { runTaskGraph: any };
              try {
                await runTaskGraph([{ id: 'loop', deps: ['loop'], run: async () => 1 }]);
                return false;
              } catch {
                return true;
              }
            `,
            expected: true,
          },
          {
            id: 's6-exam-t4-c5',
            name: 'Hidden: Empty DAG resolves to empty object {}',
            hidden: true,
            harnessCode: `
              const { runTaskGraph } = exports as { runTaskGraph: any };
              return await runTaskGraph([]);
            `,
            expected: {},
          },
        ],
      },
      {
        id: 's6-exam-t5',
        title: 'Levenshtein Edit Distance Batch Evaluator',
        style: 'beecrowd',
        difficulty: 'medium',
        entryFunction: 'solve',
        description: `Compute the minimum **Levenshtein edit distance** (single-character insert, delete, or substitute, each costing \`1\`) for \`Q\` pairs of strings.

### Input Format
- Line 1: integer \`Q\` (\`1 <= Q <= 100\`).
- Next \`Q\` lines: \`<source> <target>\` separated by whitespace, where the literal token \`-\` represents the **empty string** \`""\`.

### Output Format
Return \`Q\` lines, each containing the integer minimum edit distance for that pair, joined by \`\\n\`.`,
        tags: ['Exam', 'Dynamic Programming', 'Edit Distance', 'Beecrowd'],
        hints: [],
        playgroundInput: `4
kitten sitting
intention execution
- typescript
same same`,
        starterCode: `export function solve(input: string): string {
  void input;
  return '';
}
`,
        referenceSolution: `function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) {
    prev[j] = j;
  }

  for (let i = 1; i <= m; i++) {
    const curr = new Array<number>(n + 1);
    curr[0] = i;
    const ca = a.charCodeAt(i - 1);
    for (let j = 1; j <= n; j++) {
      if (ca === b.charCodeAt(j - 1)) {
        curr[j] = prev[j - 1];
      } else {
        const del = prev[j];
        const ins = curr[j - 1];
        const sub = prev[j - 1];
        curr[j] = 1 + (del < ins ? (del < sub ? del : sub) : ins < sub ? ins : sub);
      }
    }
    prev = curr;
  }

  return prev[n];
}

export function solve(input: string): string {
  const lines = input.replace(/\\r/g, '').trim().split('\\n');
  if (lines.length === 0 || lines[0].trim() === '') return '';

  const q = Number(lines[0].trim());
  const out: string[] = [];

  for (let i = 1; i <= q && i < lines.length; i++) {
    const [rawA, rawB] = lines[i].trim().split(/\\s+/);
    const a = rawA === '-' ? '' : rawA;
    const b = rawB === '-' ? '' : rawB;
    out.push(String(editDistance(a, b)));
  }

  return out.join('\\n');
}
`,
        testCases: [
          {
            id: 's6-exam-t5-c1',
            name: 'Computes classic Levenshtein distances and empty "-" token',
            args: [`4\nkitten sitting\nintention execution\n- typescript\nsame same`],
            expected: `3\n5\n10\n0`,
          },
          {
            id: 's6-exam-t5-c2',
            name: 'Both empty tokens "-" "-" yield 0 and asymmetric deletions work',
            args: [`3\n- -\nabcdef -\nabc yabd`],
            expected: `0\n6\n2`,
          },
          {
            id: 's6-exam-t5-c3',
            name: 'Single character insertions, deletions, and substitutions',
            args: [`3\na b\na ab\nab b`],
            expected: `1\n1\n1`,
          },
          {
            id: 's6-exam-t5-c4',
            name: 'Hidden: Reversed string and repeated character alignments',
            hidden: true,
            args: [`2\nalgorithm altruistic\naaaab baaaa`],
            expected: `6\n2`,
          },
          {
            id: 's6-exam-t5-c5',
            name: 'Hidden: Case-sensitive character comparison',
            hidden: true,
            args: [`2\nTypeScript typescript\nflaw lawn`],
            expected: `2\n2`,
          },
        ],
      },
    ],
  },
};
