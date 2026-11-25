import type { Section } from '../types/curriculum';

export const section3: Section = {
  id: 'section-3',
  number: 3,
  slug: 'objects-unions-narrowing',
  title: 'Objects, Interfaces, Unions & Narrowing',
  subtitle: 'Structural Contracts, Discriminated Unions, Exhaustiveness & Runtime Type Guards',
  accentColor: '#e5c07b',
  description:
    'Model real-world domain state cleanly with TypeScript interfaces, readonly records, literal unions, control-flow narrowing, exhaustive discriminated unions (`never`), user-defined `is` type predicates over `unknown` payloads, and `keyof` / mapped object transformations.',
  phases: [
    {
      id: 's3-p1',
      number: 1,
      title: 'Interfaces, Structural Typing & Readonly Records',
      subtitle: 'Domain object contracts, immutable updates, index lookups, and property modifiers',
      conceptSummary: `TypeScript uses **structural typing**: compatibility depends on an object's shape rather than nominal class inheritance.

- **\`interface\` & \`readonly\` modifiers:** Declare explicit contracts for domain entities and mark properties \`readonly\` so accidental mutation fails at compile time.
- **Immutable record patching:** Spread syntax (\`{ ...record, ...patch }\`) creates shallow copies; nested objects and arrays must also be copied to preserve immutability.
- **Dictionary lookups (\`Record<K, V>\`):** Prefer \`Object.hasOwn(dict, key)\` when reading arbitrary string keys from records so inherited \`Object.prototype\` keys like \`"toString"\` never leak through.
- **Mapped modifiers:** At the type level, \`{ readonly [K in keyof T]: T[K] }\` and key-remapping (\`as\`) let you inspect and transform optionality and mutability.`,
      challenges: [
        {
          id: 's3-p1-c1',
          title: 'Invoice Line Summary',
          style: 'leetcode',
          difficulty: 'beginner',
          description: `Model an invoice calculation contract using explicit \`interface\` or \`type\` definitions and implement \`summarizeInvoice(lines, taxRatePercent)\`.

### Requirements
1. Each item in \`lines\` has shape:
   - \`sku: string\`
   - \`unitPriceCents: number\` (non-negative integer)
   - \`quantity: number\` (non-negative integer)
   - \`taxExempt?: boolean\` (optional; defaults to \`false\` when omitted)
2. Return an object with:
   - \`subtotalCents\`: sum of \`unitPriceCents * quantity\` across all lines.
   - \`taxCents\`: \`Math.round((taxableSubtotalCents * taxRatePercent) / 100)\`, where \`taxableSubtotalCents\` sums only lines with \`taxExempt !== true\`.
   - \`totalCents\`: \`subtotalCents + taxCents\`.
   - \`lineCount\`: \`lines.length\`.

### Example
\`\`\`ts
summarizeInvoice(
  [
    { sku: 'BOOK-1', unitPriceCents: 2500, quantity: 2, taxExempt: true },
    { sku: 'PEN-9', unitPriceCents: 400, quantity: 3 },
  ],
  10
);
// => { subtotalCents: 6200, taxCents: 120, totalCents: 6320, lineCount: 2 }
\`\`\``,
          tags: ['Interfaces', 'Optional Properties', 'Readonly Arrays'],
          hints: [
            'Declare `export interface InvoiceLine` and `export interface InvoiceSummary` before implementing `summarizeInvoice`.',
            'Track `subtotalCents` and `taxableSubtotalCents` separately in a single pass over `lines`.',
            'Compute `Math.round((taxableSubtotalCents * taxRatePercent) / 100)` once at the end rather than rounding per line.',
          ],
          entryFunction: 'summarizeInvoice',
          astRules: { requireInterfaceOrType: true },
          starterCode: `export interface InvoiceLine {
  readonly sku: string;
  readonly unitPriceCents: number;
  readonly quantity: number;
  readonly taxExempt?: boolean;
}

export interface InvoiceSummary {
  readonly subtotalCents: number;
  readonly taxCents: number;
  readonly totalCents: number;
  readonly lineCount: number;
}

export function summarizeInvoice(
  lines: readonly InvoiceLine[],
  taxRatePercent: number
): InvoiceSummary {
  // TODO: Compute subtotal, tax on non-exempt lines, total, and lineCount
  return {
    subtotalCents: 0,
    taxCents: 0,
    totalCents: 0,
    lineCount: 0,
  };
}
`,
          referenceSolution: `export interface InvoiceLine {
  readonly sku: string;
  readonly unitPriceCents: number;
  readonly quantity: number;
  readonly taxExempt?: boolean;
}

export interface InvoiceSummary {
  readonly subtotalCents: number;
  readonly taxCents: number;
  readonly totalCents: number;
  readonly lineCount: number;
}

export function summarizeInvoice(
  lines: readonly InvoiceLine[],
  taxRatePercent: number
): InvoiceSummary {
  let subtotalCents = 0;
  let taxableSubtotalCents = 0;

  for (const line of lines) {
    const lineTotal = line.unitPriceCents * line.quantity;
    subtotalCents += lineTotal;
    if (line.taxExempt !== true) {
      taxableSubtotalCents += lineTotal;
    }
  }

  const taxCents = Math.round((taxableSubtotalCents * taxRatePercent) / 100);
  return {
    subtotalCents,
    taxCents,
    totalCents: subtotalCents + taxCents,
    lineCount: lines.length,
  };
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Mixed taxable and tax-exempt lines',
              args: [
                [
                  { sku: 'BOOK-1', unitPriceCents: 2500, quantity: 2, taxExempt: true },
                  { sku: 'PEN-9', unitPriceCents: 400, quantity: 3 },
                ],
                10,
              ],
              expected: { subtotalCents: 6200, taxCents: 120, totalCents: 6320, lineCount: 2 },
            },
            {
              id: 'tc-2',
              name: 'All lines taxable with fractional cent rounding',
              args: [
                [
                  { sku: 'CABLE', unitPriceCents: 333, quantity: 1 },
                  { sku: 'ADAPTER', unitPriceCents: 200, quantity: 1, taxExempt: false },
                ],
                7,
              ],
              expected: { subtotalCents: 533, taxCents: 37, totalCents: 570, lineCount: 2 },
            },
            {
              id: 'tc-3',
              name: 'Empty invoice produces zeros',
              args: [[], 15],
              expected: { subtotalCents: 0, taxCents: 0, totalCents: 0, lineCount: 0 },
            },
            {
              id: 'tc-4',
              name: 'Hidden: All lines tax-exempt yields zero tax',
              hidden: true,
              args: [
                [
                  { sku: 'MED-1', unitPriceCents: 1850, quantity: 4, taxExempt: true },
                  { sku: 'MED-2', unitPriceCents: 950, quantity: 1, taxExempt: true },
                ],
                18,
              ],
              expected: { subtotalCents: 8350, taxCents: 0, totalCents: 8350, lineCount: 2 },
            },
            {
              id: 'tc-5',
              name: 'Hidden: Zero-quantity lines still count in lineCount',
              hidden: true,
              args: [
                [
                  { sku: 'PROMO', unitPriceCents: 5000, quantity: 0 },
                  { sku: 'CASE', unitPriceCents: 1500, quantity: 2 },
                ],
                8,
              ],
              expected: { subtotalCents: 3000, taxCents: 240, totalCents: 3240, lineCount: 2 },
            },
          ],
        },
        {
          id: 's3-p1-c2',
          title: 'Immutable User Profile Patch',
          style: 'leetcode',
          difficulty: 'easy',
          description: `Implement \`applyProfilePatch(profile, patch)\` so it returns an updated \`UserProfile\` **without mutating** \`profile\`, \`profile.tags\`, \`profile.settings\`, or \`patch\`.

### Update Rules
- \`displayName\`: replace if \`patch.displayName !== undefined\`, otherwise keep \`profile.displayName\`.
- \`bio\`: replace if \`patch.bio !== undefined\`, otherwise keep \`profile.bio\`.
- \`tags\`: start with a copy of \`profile.tags\`; if \`patch.addTags\` is provided, append each tag that is not already present (preserving first-seen order, including deduplicating within \`addTags\`).
- \`settings\`: merge \`patch.settings\` (\`theme\` and/or \`notifications\`) into a fresh \`settings\` object without mutating \`profile.settings\`.`,
          tags: ['Readonly', 'Immutability', 'Nested Objects'],
          hints: [
            'Copy `profile.tags` into a new array and use a `Set<string>` to avoid adding duplicate tags.',
            'Construct a brand-new `settings` object using nullish coalescing (`patch.settings?.theme ?? profile.settings.theme`).',
            'Never call `.push()` directly on `profile.tags`—test cases verify input immutability.',
          ],
          entryFunction: 'applyProfilePatch',
          astRules: { requireInterfaceOrType: true },
          starterCode: `export interface UserProfile {
  readonly id: string;
  readonly displayName: string;
  readonly bio: string;
  readonly tags: readonly string[];
  readonly settings: {
    readonly theme: 'light' | 'dark';
    readonly notifications: boolean;
  };
}

export interface ProfilePatch {
  readonly displayName?: string;
  readonly bio?: string;
  readonly addTags?: readonly string[];
  readonly settings?: {
    readonly theme?: 'light' | 'dark';
    readonly notifications?: boolean;
  };
}

export function applyProfilePatch(
  profile: UserProfile,
  patch: ProfilePatch
): UserProfile {
  // TODO: Return a new UserProfile with patch applied immutably
  return profile;
}
`,
          referenceSolution: `export interface UserProfile {
  readonly id: string;
  readonly displayName: string;
  readonly bio: string;
  readonly tags: readonly string[];
  readonly settings: {
    readonly theme: 'light' | 'dark';
    readonly notifications: boolean;
  };
}

export interface ProfilePatch {
  readonly displayName?: string;
  readonly bio?: string;
  readonly addTags?: readonly string[];
  readonly settings?: {
    readonly theme?: 'light' | 'dark';
    readonly notifications?: boolean;
  };
}

export function applyProfilePatch(
  profile: UserProfile,
  patch: ProfilePatch
): UserProfile {
  const seenTags = new Set<string>(profile.tags);
  const nextTags = [...profile.tags];
  if (patch.addTags) {
    for (const tag of patch.addTags) {
      if (!seenTags.has(tag)) {
        seenTags.add(tag);
        nextTags.push(tag);
      }
    }
  }

  return {
    id: profile.id,
    displayName: patch.displayName !== undefined ? patch.displayName : profile.displayName,
    bio: patch.bio !== undefined ? patch.bio : profile.bio,
    tags: nextTags,
    settings: {
      theme: patch.settings?.theme !== undefined ? patch.settings.theme : profile.settings.theme,
      notifications:
        patch.settings?.notifications !== undefined
          ? patch.settings.notifications
          : profile.settings.notifications,
    },
  };
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Updates displayName, deduplicates tags, and patches nested theme',
              checkImmutability: true,
              args: [
                {
                  id: 'u-1',
                  displayName: 'Ada',
                  bio: 'Compiler engineer',
                  tags: ['ts', 'rust'],
                  settings: { theme: 'light', notifications: true },
                },
                {
                  displayName: 'Ada Lovelace',
                  addTags: ['rust', 'wasm', 'wasm'],
                  settings: { theme: 'dark' },
                },
              ],
              expected: {
                id: 'u-1',
                displayName: 'Ada Lovelace',
                bio: 'Compiler engineer',
                tags: ['ts', 'rust', 'wasm'],
                settings: { theme: 'dark', notifications: true },
              },
            },
            {
              id: 'tc-2',
              name: 'Allows clearing bio to empty string explicitly',
              checkImmutability: true,
              args: [
                {
                  id: 'u-2',
                  displayName: 'Linus',
                  bio: 'Old bio',
                  tags: ['kernel'],
                  settings: { theme: 'dark', notifications: true },
                },
                {
                  bio: '',
                  settings: { notifications: false },
                },
              ],
              expected: {
                id: 'u-2',
                displayName: 'Linus',
                bio: '',
                tags: ['kernel'],
                settings: { theme: 'dark', notifications: false },
              },
            },
            {
              id: 'tc-3',
              name: 'Empty patch returns structural copy',
              checkImmutability: true,
              args: [
                {
                  id: 'u-3',
                  displayName: 'Grace',
                  bio: 'Navy',
                  tags: ['cobol'],
                  settings: { theme: 'light', notifications: false },
                },
                {},
              ],
              expected: {
                id: 'u-3',
                displayName: 'Grace',
                bio: 'Navy',
                tags: ['cobol'],
                settings: { theme: 'light', notifications: false },
              },
            },
            {
              id: 'tc-4',
              name: 'Hidden: Appending tags onto empty initial tag list',
              hidden: true,
              checkImmutability: true,
              args: [
                {
                  id: 'u-4',
                  displayName: 'Ken',
                  bio: 'Unix',
                  tags: [],
                  settings: { theme: 'dark', notifications: false },
                },
                { addTags: ['unix', 'go', 'unix'] },
              ],
              expected: {
                id: 'u-4',
                displayName: 'Ken',
                bio: 'Unix',
                tags: ['unix', 'go'],
                settings: { theme: 'dark', notifications: false },
              },
            },
            {
              id: 'tc-5',
              name: 'Hidden: Preserves id and handles simultaneous setting changes',
              hidden: true,
              checkImmutability: true,
              args: [
                {
                  id: 'u-5',
                  displayName: 'Barbara',
                  bio: 'CLU',
                  tags: ['subtyping'],
                  settings: { theme: 'light', notifications: true },
                },
                {
                  displayName: 'Barbara Liskov',
                  bio: 'Turing Laureate',
                  settings: { theme: 'dark', notifications: false },
                },
              ],
              expected: {
                id: 'u-5',
                displayName: 'Barbara Liskov',
                bio: 'Turing Laureate',
                tags: ['subtyping'],
                settings: { theme: 'dark', notifications: false },
              },
            },
          ],
        },
        {
          id: 's3-p1-c3',
          title: 'Environment Feature Flag Lookup',
          style: 'leetcode',
          difficulty: 'easy',
          description: `Implement \`resolveFeatureFlags(defaults, envOverrides, requestedKeys)\` using typed dictionary records (\`Record<string, boolean>\`).

### Resolution Rules
For each unique key in \`requestedKeys\`:
1. If \`envOverrides\` defines an **own** property for \`key\`, use \`envOverrides[key]\`.
2. Otherwise, if \`defaults\` defines an **own** property for \`key\`, use \`defaults[key]\`.
3. Otherwise, default to \`false\`.

> Guard against \`Object.prototype\` property names such as \`"toString"\` or \`"constructor"\` when checking keys.`,
          tags: ['Record', 'Index Signatures', 'Object.hasOwn'],
          hints: [
            'Define a type alias `export type FlagMap = Record<string, boolean>` for readability.',
            'Use `Object.hasOwn(envOverrides, key)` rather than `key in envOverrides` or truthiness checks (since `false` is a valid override!).',
          ],
          entryFunction: 'resolveFeatureFlags',
          astRules: { requireInterfaceOrType: true },
          starterCode: `export type FlagMap = Readonly<Record<string, boolean>>;

export function resolveFeatureFlags(
  defaults: FlagMap,
  envOverrides: FlagMap,
  requestedKeys: readonly string[]
): Record<string, boolean> {
  // TODO: Resolve each requested flag safely
  return {};
}
`,
          referenceSolution: `export type FlagMap = Readonly<Record<string, boolean>>;

export function resolveFeatureFlags(
  defaults: FlagMap,
  envOverrides: FlagMap,
  requestedKeys: readonly string[]
): Record<string, boolean> {
  const resolved: Record<string, boolean> = {};
  for (const key of requestedKeys) {
    if (Object.hasOwn(envOverrides, key)) {
      resolved[key] = envOverrides[key];
    } else if (Object.hasOwn(defaults, key)) {
      resolved[key] = defaults[key];
    } else {
      resolved[key] = false;
    }
  }
  return resolved;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Override false beats default true',
              args: [
                { darkMode: true, betaSearch: false, metrics: true },
                { darkMode: false, newCheckout: true },
                ['darkMode', 'betaSearch', 'newCheckout', 'unknownFlag'],
              ],
              expected: {
                darkMode: false,
                betaSearch: false,
                newCheckout: true,
                unknownFlag: false,
              },
            },
            {
              id: 'tc-2',
              name: 'Ignores unrequested keys and deduplicates requestedKeys',
              args: [
                { sso: true, auditLog: true },
                { extraFlag: true },
                ['sso', 'sso'],
              ],
              expected: { sso: true },
            },
            {
              id: 'tc-3',
              name: 'Empty requestedKeys returns empty object',
              args: [{ a: true }, { a: false }, []],
              expected: {},
            },
            {
              id: 'tc-4',
              name: 'Hidden: Prototype key names like toString resolve to false when absent',
              hidden: true,
              args: [{ safeKey: true }, {}, ['toString', 'valueOf', 'safeKey']],
              expected: { toString: false, valueOf: false, safeKey: true },
            },
            {
              id: 'tc-5',
              name: 'Hidden: Prototype hasOwnProperty resolves false while explicit override resolves true',
              hidden: true,
              args: [{}, { protoTest: true }, ['hasOwnProperty', 'protoTest', 'missing']],
              expected: { hasOwnProperty: false, protoTest: true, missing: false },
            },
          ],
        },
        {
          id: 's3-p1-c4',
          title: 'Readonly Contract & OptionalKeys',
          style: 'type-challenge',
          difficulty: 'medium',
          description: `Implement two compile-time object inspection utilities:

1. \`MyReadonly<T>\`: Constructs an object type with all properties of \`T\` marked \`readonly\`, preserving optionality and exact value types.
2. \`OptionalKeys<T>\`: Produces the union of keys in \`T\` that are marked optional (\`?\`). Note that a **required** property whose value type includes \`undefined\` (e.g. \`d: string | undefined\`) is **not** optional!`,
          tags: ['Mapped Types', 'Property Modifiers', 'Optional Keys'],
          hints: [
            'For `MyReadonly<T>`, map directly with `{ readonly [K in keyof T]: T[K] }`.',
            'A key `K` of `T` is optional if and only if `{}` is assignable to `Pick<T, K>` (`{} extends Pick<T, K>`).',
            'Use mapped key remapping `keyof { [K in keyof T as {} extends Pick<T, K> ? K : never]: true }` to avoid distributive union pitfalls.',
          ],
          starterCode: `export type MyReadonly<T> = T;

export type OptionalKeys<T> = keyof T;
`,
          referenceSolution: `export type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

export type OptionalKeys<T> = keyof {
  [K in keyof T as {} extends Pick<T, K> ? K : never]: true;
};
`,
          typeAssertionPrelude: `import type { MyReadonly, OptionalKeys } from './solution';

interface Account {
  id: string;
  nickname?: string;
  age?: number | undefined;
  deletedAt: string | undefined;
  readonly createdAt: number;
}`,
          typeAssertions: [
            {
              id: 'ta-1',
              name: 'MyReadonly marks all properties readonly',
              assertion: `Expect<Equal<MyReadonly<{ a: number; b?: string }>, { readonly a: number; readonly b?: string }>>`,
            },
            {
              id: 'ta-2',
              name: 'MyReadonly preserves existing readonly properties',
              assertion: `Expect<Equal<MyReadonly<{ readonly id: string; count: number }>, { readonly id: string; readonly count: number }>>`,
            },
            {
              id: 'ta-3',
              name: 'OptionalKeys extracts only ?-optional keys, excluding required T | undefined',
              assertion: `Expect<Equal<OptionalKeys<Account>, 'nickname' | 'age'>>`,
            },
            {
              id: 'ta-4',
              name: 'OptionalKeys returns never when all properties are required',
              assertion: `Expect<Equal<OptionalKeys<{ x: number; y: string }>, never>>`,
            },
            {
              id: 'ta-5',
              name: 'Hidden: OptionalKeys on empty interface returns never',
              hidden: true,
              assertion: `Expect<Equal<OptionalKeys<{}>, never>>`,
            },
            {
              id: 'ta-6',
              name: 'Hidden: OptionalKeys handles all-optional config',
              hidden: true,
              assertion: `Expect<Equal<OptionalKeys<{ retries?: number; timeoutMs?: number }>, 'retries' | 'timeoutMs'>>`,
            },
          ],
          testCases: [],
        },
      ],
    },
    {
      id: 's3-p2',
      number: 2,
      title: 'Union Types, Literal Types & Control-Flow Narrowing',
      subtitle: 'typeof checks, in-operator narrowing, literal unions, and union filtering',
      conceptSummary: `TypeScript tracks control flow (\`if\`, \`switch\`, early \`return\`) to narrow broad union types down to specific members:

- **Primitive narrowing:** \`typeof x === 'string'\`, \`typeof x === 'number'\`, \`typeof x === 'boolean'\`, and strict equality \`x === null\` narrow primitive branches.
- **Structural \`in\` narrowing:** When union members are distinct object shapes without a shared tag, \`'phoneNumber' in channel\` narrows to members possessing that property.
- **String literal unions:** Modeling commands or units with \`'ms' | 's'\` prevents typo bugs at compile time.
- **Distributive conditional types:** When \`T\` is a naked type parameter in \`T extends U ? never : T\`, TypeScript distributes over every member of the union \`T\`.`,
      challenges: [
        {
          id: 's3-p2-c1',
          title: 'Telemetry Value Normalizer',
          style: 'leetcode',
          difficulty: 'beginner',
          description: `Implement \`normalizeMetricValue(input)\` to convert heterogeneous telemetry readings into milliseconds (\`number | null\`).

### Input Union
\`RawMetric = number | string | boolean | { readonly value: number; readonly unit: 'ms' | 's' } | null\`

### Conversion Rules
1. \`null\` -> \`null\`.
2. \`boolean\` -> \`1\` for \`true\`, \`0\` for \`false\`.
3. \`number\` -> \`input\` if \`Number.isFinite(input)\`, else \`null\`.
4. \`string\` -> trim whitespace:
   - If empty, return \`null\`.
   - If ending with \`"ms"\`, parse the prefix before \`"ms"\` as a number.
   - Else if ending with \`"s"\`, parse the prefix before \`"s"\` and multiply by \`1000\`.
   - Otherwise parse the trimmed string directly with \`Number(...)\`.
   - Note: \`Number("")\` is \`0\` in JS, so reject empty numeric prefixes (like \`"ms"\` or \`"s"\`) and any non-finite result by returning \`null\`.
5. \`{ value, unit }\` -> if \`!Number.isFinite(input.value)\` return \`null\`; return \`input.value * 1000\` when \`unit === 's'\`, else \`input.value\`.`,
          tags: ['Unions', 'typeof Narrowing', 'in Operator'],
          hints: [
            'Check `input === null` first because `typeof null === "object"` in JavaScript.',
            'Handle `boolean`, `number`, and `string` with `typeof`, leaving the `{ value, unit }` object branch.',
            'When stripping `"ms"` or `"s"`, verify the remaining prefix `numPart.trim().length > 0` before `Number(numPart)`.',
          ],
          entryFunction: 'normalizeMetricValue',
          astRules: { requireTypeNarrowing: true },
          starterCode: `export type RawMetric =
  | number
  | string
  | boolean
  | { readonly value: number; readonly unit: 'ms' | 's' }
  | null;

export function normalizeMetricValue(input: RawMetric): number | null {
  // TODO: Narrow RawMetric and return milliseconds or null
  return null;
}
`,
          referenceSolution: `export type RawMetric =
  | number
  | string
  | boolean
  | { readonly value: number; readonly unit: 'ms' | 's' }
  | null;

export function normalizeMetricValue(input: RawMetric): number | null {
  if (input === null) return null;
  if (typeof input === 'boolean') return input ? 1 : 0;
  if (typeof input === 'number') {
    return Number.isFinite(input) ? input : null;
  }
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed.length === 0) return null;

    let multiplier = 1;
    let numericSlice = trimmed;
    if (trimmed.endsWith('ms')) {
      numericSlice = trimmed.slice(0, -2).trim();
    } else if (trimmed.endsWith('s')) {
      numericSlice = trimmed.slice(0, -1).trim();
      multiplier = 1000;
    }

    if (numericSlice.length === 0) return null;
    const parsed = Number(numericSlice);
    return Number.isFinite(parsed) ? parsed * multiplier : null;
  }

  if ('unit' in input) {
    if (!Number.isFinite(input.value)) return null;
    return input.unit === 's' ? input.value * 1000 : input.value;
  }

  return null;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Handles numbers and booleans',
              args: [true],
              expected: 1,
            },
            {
              id: 'tc-2',
              name: 'Parses string with seconds suffix',
              args: ['  2.5s '],
              expected: 2500,
            },
            {
              id: 'tc-3',
              name: 'Parses string with ms suffix',
              args: ['140ms'],
              expected: 140,
            },
            {
              id: 'tc-4',
              name: 'Handles structured unit object in seconds',
              args: [{ value: 1.2, unit: 's' }],
              expected: 1200,
            },
            {
              id: 'tc-5',
              name: 'Hidden: Rejects bare unit strings like "ms" or malformed text',
              hidden: true,
              args: ['ms'],
              expected: null,
            },
            {
              id: 'tc-6',
              name: 'Hidden: Null input returns null',
              hidden: true,
              args: [null],
              expected: null,
            },
          ],
        },
        {
          id: 's3-p2-c2',
          title: 'Multi-Channel Notification Formatter',
          style: 'leetcode',
          difficulty: 'easy',
          description: `Define \`EmailNotification\`, \`SmsNotification\`, \`WebhookNotification\`, and their union \`NotificationTarget\`, then implement \`describeNotification(target)\` using structural property narrowing (\`in\`).

### Shapes & Output Formats
1. **Email** (\`{ recipientEmail: string; subject: string }\`):
   \`"EMAIL -> <recipientEmail>: <subject>"\`
2. **SMS** (\`{ phoneNumber: string; body: string }\`):
   \`"SMS -> <phoneNumber> (<body.length> chars)"\`
3. **Webhook** (\`{ endpointUrl: string; eventName: string; retryCount: number }\`):
   \`"WEBHOOK -> <endpointUrl> [<eventName>] (retries: <retryCount>)"\``,
          tags: ['in Narrowing', 'Structural Unions', 'String Formatting'],
          hints: [
            'Check `"recipientEmail" in target` and `"phoneNumber" in target` with `if` statements.',
            'In the final branch, TypeScript narrows `target` automatically to `WebhookNotification`.',
          ],
          entryFunction: 'describeNotification',
          astRules: { requireTypeNarrowing: true, requireInterfaceOrType: true },
          starterCode: `export interface EmailNotification {
  readonly recipientEmail: string;
  readonly subject: string;
}

export interface SmsNotification {
  readonly phoneNumber: string;
  readonly body: string;
}

export interface WebhookNotification {
  readonly endpointUrl: string;
  readonly eventName: string;
  readonly retryCount: number;
}

export type NotificationTarget =
  | EmailNotification
  | SmsNotification
  | WebhookNotification;

export function describeNotification(target: NotificationTarget): string {
  // TODO: Narrow NotificationTarget with the 'in' operator
  return '';
}
`,
          referenceSolution: `export interface EmailNotification {
  readonly recipientEmail: string;
  readonly subject: string;
}

export interface SmsNotification {
  readonly phoneNumber: string;
  readonly body: string;
}

export interface WebhookNotification {
  readonly endpointUrl: string;
  readonly eventName: string;
  readonly retryCount: number;
}

export type NotificationTarget =
  | EmailNotification
  | SmsNotification
  | WebhookNotification;

export function describeNotification(target: NotificationTarget): string {
  if ('recipientEmail' in target) {
    return \`EMAIL -> \${target.recipientEmail}: \${target.subject}\`;
  }
  if ('phoneNumber' in target) {
    return \`SMS -> \${target.phoneNumber} (\${target.body.length} chars)\`;
  }
  return \`WEBHOOK -> \${target.endpointUrl} [\${target.eventName}] (retries: \${target.retryCount})\`;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Formats email target',
              args: [{ recipientEmail: 'ops@acme.dev', subject: 'Deploy Succeeded' }],
              expected: 'EMAIL -> ops@acme.dev: Deploy Succeeded',
            },
            {
              id: 'tc-2',
              name: 'Formats SMS target with body character count',
              args: [{ phoneNumber: '+15550199', body: 'Code: 842910' }],
              expected: 'SMS -> +15550199 (12 chars)',
            },
            {
              id: 'tc-3',
              name: 'Formats webhook target with retry count',
              args: [
                {
                  endpointUrl: 'https://hooks.acme.dev/v1',
                  eventName: 'invoice.paid',
                  retryCount: 2,
                },
              ],
              expected: 'WEBHOOK -> https://hooks.acme.dev/v1 [invoice.paid] (retries: 2)',
            },
            {
              id: 'tc-4',
              name: 'Hidden: Empty SMS body reports 0 chars',
              hidden: true,
              args: [{ phoneNumber: '+4420794600', body: '' }],
              expected: 'SMS -> +4420794600 (0 chars)',
            },
            {
              id: 'tc-5',
              name: 'Hidden: Zero retries webhook',
              hidden: true,
              args: [
                {
                  endpointUrl: 'http://localhost:8080/events',
                  eventName: 'ping',
                  retryCount: 0,
                },
              ],
              expected: 'WEBHOOK -> http://localhost:8080/events [ping] (retries: 0)',
            },
          ],
        },
        {
          id: 's3-p2-c3',
          title: 'Packet Ledger Interpreter',
          style: 'beecrowd',
          difficulty: 'easy',
          description: `Read a sequence of account ledger packets from standard input, execute them using a typed command union, and print final account balances.

### Input Format
- First line: integer \`N\` (\`0 <= N <= 1000\`), the number of command lines that follow.
- Next \`N\` lines, each one of:
  - \`CREDIT <account> <amount>\` (\`amount\` is a positive integer)
  - \`DEBIT <account> <amount>\` (\`amount\` is a positive integer)
  - \`FREEZE <account>\`
  - \`UNFREEZE <account>\`

### Processing Rules
- Any account starts at balance \`0\` and unfrozen on first mention.
- \`FREEZE\` marks \`<account>\` frozen; \`UNFREEZE\` marks \`<account>\` unfrozen (both always succeed and register the account).
- If an account is currently **frozen**, both \`CREDIT\` and \`DEBIT\` on that account are **rejected** (balance unchanged, \`rejected\` count incremented by 1).
- On an unfrozen account, \`CREDIT\` adds \`amount\`, while \`DEBIT\` subtracts \`amount\` **only** if \`balance >= amount\` (otherwise rejected and \`rejected\` incremented by 1).

### Output Format
- Print every known account sorted lexicographically (\`localeCompare\` / ASCII \`<\`—account names are ASCII identifiers) as \`<account>: <balance>\`, one per line.
- Final line: \`REJECTED: <count>\`.`,
          tags: ['Literal Unions', 'Narrowing', 'Stdin Parsing'],
          hints: [
            'Parse each line into a discriminated command type (`CREDIT | DEBIT | FREEZE | UNFREEZE`) before executing it.',
            'Store account state in a `Map<string, { balance: number; frozen: boolean }>`.',
            'Sort account keys with `(a, b) => (a < b ? -1 : a > b ? 1 : 0)` before building output lines.',
          ],
          entryFunction: 'solve',
          playgroundInput: `6
CREDIT alice 500
DEBIT alice 200
FREEZE alice
CREDIT alice 100
UNFREEZE alice
DEBIT bob 50`,
          astRules: { requireTypeNarrowing: true },
          starterCode: `type LedgerCommand =
  | { readonly op: 'CREDIT'; readonly account: string; readonly amount: number }
  | { readonly op: 'DEBIT'; readonly account: string; readonly amount: number }
  | { readonly op: 'FREEZE'; readonly account: string }
  | { readonly op: 'UNFREEZE'; readonly account: string };

export function solve(input: string): string {
  // TODO: Parse commands, apply ledger rules, and format sorted output
  return '';
}
`,
          referenceSolution: `type LedgerCommand =
  | { readonly op: 'CREDIT'; readonly account: string; readonly amount: number }
  | { readonly op: 'DEBIT'; readonly account: string; readonly amount: number }
  | { readonly op: 'FREEZE'; readonly account: string }
  | { readonly op: 'UNFREEZE'; readonly account: string };

function parseLine(line: string): LedgerCommand | null {
  const parts = line.trim().split(/\\s+/);
  const op = parts[0];
  const account = parts[1];
  if (!op || !account) return null;

  if (op === 'FREEZE') return { op: 'FREEZE', account };
  if (op === 'UNFREEZE') return { op: 'UNFREEZE', account };
  if (op === 'CREDIT' || op === 'DEBIT') {
    const amount = Number(parts[2]);
    if (!Number.isInteger(amount) || amount <= 0) return null;
    return { op, account, amount };
  }
  return null;
}

export function solve(input: string): string {
  const rawLines = input
    .split(/\\r?\\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (rawLines.length === 0) {
    return 'REJECTED: 0';
  }

  const count = Number(rawLines[0]);
  const accounts = new Map<string, { balance: number; frozen: boolean }>();
  let rejected = 0;

  const ensureAccount = (name: string) => {
    let entry = accounts.get(name);
    if (!entry) {
      entry = { balance: 0, frozen: false };
      accounts.set(name, entry);
    }
    return entry;
  };

  for (let i = 1; i <= count && i < rawLines.length; i++) {
    const cmd = parseLine(rawLines[i]);
    if (!cmd) continue;
    const state = ensureAccount(cmd.account);

    switch (cmd.op) {
      case 'FREEZE':
        state.frozen = true;
        break;
      case 'UNFREEZE':
        state.frozen = false;
        break;
      case 'CREDIT':
        if (state.frozen) {
          rejected++;
        } else {
          state.balance += cmd.amount;
        }
        break;
      case 'DEBIT':
        if (state.frozen || state.balance < cmd.amount) {
          rejected++;
        } else {
          state.balance -= cmd.amount;
        }
        break;
    }
  }

  const sortedNames = [...accounts.keys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const outLines = sortedNames.map((name) => \`\${name}: \${accounts.get(name)!.balance}\`);
  outLines.push(\`REJECTED: \${rejected}\`);
  return outLines.join('\\n');
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Frozen credit and insufficient debit are rejected',
              args: [
                `6
CREDIT alice 500
DEBIT alice 200
FREEZE alice
CREDIT alice 100
UNFREEZE alice
DEBIT bob 50`,
              ],
              expected: `alice: 300\nbob: 0\nREJECTED: 2`,
            },
            {
              id: 'tc-2',
              name: 'Unfreezing restores normal operations and sorts accounts',
              args: [
                `5
CREDIT zoe 100
FREEZE zoe
DEBIT zoe 40
UNFREEZE zoe
DEBIT zoe 40`,
              ],
              expected: `zoe: 60\nREJECTED: 1`,
            },
            {
              id: 'tc-3',
              name: 'Zero commands prints only REJECTED: 0',
              args: [`0`],
              expected: `REJECTED: 0`,
            },
            {
              id: 'tc-4',
              name: 'Hidden: Exact zero balance debit succeeds',
              hidden: true,
              args: [
                `3
CREDIT vault 250
DEBIT vault 250
DEBIT vault 1`,
              ],
              expected: `vault: 0\nREJECTED: 1`,
            },
            {
              id: 'tc-5',
              name: 'Hidden: Multiple interleaved accounts sorted ASCII',
              hidden: true,
              args: [
                `6
CREDIT charlie 90
CREDIT alpha 40
FREEZE alpha
UNFREEZE alpha
CREDIT alpha 15
CREDIT bravo 10`,
              ],
              expected: `alpha: 55\nbravo: 10\ncharlie: 90\nREJECTED: 0`,
            },
          ],
        },
        {
          id: 's3-p2-c4',
          title: 'Union Filtering (MyExclude & NonNullableProps)',
          style: 'type-challenge',
          difficulty: 'medium',
          description: `Implement two union-filtering type utilities without using built-in \`Exclude\` or \`NonNullable\`:

1. \`MyExclude<T, U>\`: Removes from union \`T\` any member assignable to \`U\`.
2. \`NonNullableProps<T>\`: Maps every property \`K\` of object \`T\` so \`null\` and \`undefined\` are stripped from \`T[K]\` (while keeping property modifiers like \`readonly\` intact). Note: for optional properties \`b?: string | null\`, TypeScript keeps \`?\` while stripping \`null | undefined\` from the value type.`,
          tags: ['Distributive Conditional Types', 'Mapped Types', 'Unions'],
          hints: [
            'Distributive conditional: `export type MyExclude<T, U> = T extends U ? never : T;`.',
            'Use `MyExclude<T[K], null | undefined>` inside a homomorphic mapped type `{ [K in keyof T]: ... }`.',
          ],
          starterCode: `export type MyExclude<T, U> = T;

export type NonNullableProps<T> = T;
`,
          referenceSolution: `export type MyExclude<T, U> = T extends U ? never : T;

export type NonNullableProps<T> = {
  [K in keyof T]: MyExclude<T[K], null | undefined>;
};
`,
          typeAssertionPrelude: `import type { MyExclude, NonNullableProps } from './solution';`,
          typeAssertions: [
            {
              id: 'ta-1',
              name: 'MyExclude filters string literal unions',
              assertion: `Expect<Equal<MyExclude<'draft' | 'published' | 'archived', 'archived'>, 'draft' | 'published'>>`,
            },
            {
              id: 'ta-2',
              name: 'MyExclude removes functions or primitive subsets',
              assertion: `Expect<Equal<MyExclude<string | number | (() => void), Function>, string | number>>`,
            },
            {
              id: 'ta-3',
              name: 'MyExclude returns never when all members match U',
              assertion: `Expect<Equal<MyExclude<'a' | 'b', string>, never>>`,
            },
            {
              id: 'ta-4',
              name: 'NonNullableProps strips null and undefined from field types',
              assertion: `Expect<Equal<NonNullableProps<{ id: string | null; count: number | undefined }>, { id: string; count: number }>>`,
            },
            {
              id: 'ta-5',
              name: 'Hidden: NonNullableProps preserves readonly modifier',
              hidden: true,
              assertion: `Expect<Equal<NonNullableProps<{ readonly token: string | null }>, { readonly token: string }>>`,
            },
            {
              id: 'ta-6',
              name: 'Hidden: MyExclude with never leaves T unchanged',
              hidden: true,
              assertion: `Expect<Equal<MyExclude<'x' | 'y', never>, 'x' | 'y'>>`,
            },
          ],
          testCases: [],
        },
      ],
    },
    {
      id: 's3-p3',
      number: 3,
      title: 'Discriminated Unions & Exhaustiveness (`never`)',
      subtitle: 'Tagged unions, recursive ASTs, Result pipelines, and exhaustive state reducers',
      conceptSummary: `A **discriminated union** gives every variant a common literal tag property (such as \`kind\`, \`status\`, or \`ok\`).

- **Instant branch narrowing:** Switching on \`expr.kind\` narrows the entire object inside each \`case\`.
- **Compile-time exhaustiveness (\`never\`):** Adding a \`default\` branch calling \`assertNever(expr)\` where \`function assertNever(x: never): never\` guarantees a compile error the moment a new variant is added to the union without updating every \`switch\`.
- **\`Result<T, E>\` error values:** Representing recoverable domain errors as \`{ ok: true; value: T } | { ok: false; error: E }\` makes failure paths explicit in function signatures.`,
      challenges: [
        {
          id: 's3-p3-c1',
          title: 'Safe Arithmetic AST Evaluator',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Evaluate a recursive arithmetic expression tree modeled as a discriminated union \`Expr\`, returning \`number | null\`.

### Expression Variants
- \`{ kind: 'lit'; value: number }\` -> returns \`value\`.
- \`{ kind: 'neg'; expr: Expr }\` -> negates child value (\`0 - val\` so \`-0\` is avoided or use \`val === 0 ? 0 : -val\`).
- \`{ kind: 'bin'; op: '+' | '-' | '*' | '/'; left: Expr; right: Expr }\` -> evaluates \`left\` and \`right\`; if either is \`null\`, or if \`op === '/'\` and \`rightVal === 0\`, returns \`null\`. Normalize \`-0\` to \`0\`.
- \`{ kind: 'clamp'; expr: Expr; min: number; max: number }\` -> evaluates \`expr\`; if \`null\` return \`null\`, else \`Math.min(max, Math.max(min, val))\`.

Use an exhaustive \`switch\` with a \`never\` helper so every \`Expr\` variant is handled.`,
          tags: ['Discriminated Unions', 'Recursion', 'Exhaustiveness'],
          hints: [
            'Write `function assertNever(value: never): never { throw new Error("Unhandled: " + JSON.stringify(value)); }`.',
            'Short-circuit immediately if any recursive `evaluateExpr(...)` call returns `null`.',
            'Normalize `result === 0 ? 0 : result` so `-0` never fails structural equality against `0`.',
          ],
          entryFunction: 'evaluateExpr',
          astRules: { requireTypeNarrowing: true, requireInterfaceOrType: true },
          starterCode: `export type Expr =
  | { readonly kind: 'lit'; readonly value: number }
  | { readonly kind: 'neg'; readonly expr: Expr }
  | {
      readonly kind: 'bin';
      readonly op: '+' | '-' | '*' | '/';
      readonly left: Expr;
      readonly right: Expr;
    }
  | {
      readonly kind: 'clamp';
      readonly expr: Expr;
      readonly min: number;
      readonly max: number;
    };

export function evaluateExpr(expr: Expr): number | null {
  // TODO: Exhaustively evaluate Expr and propagate null on division by zero
  return 0;
}
`,
          referenceSolution: `export type Expr =
  | { readonly kind: 'lit'; readonly value: number }
  | { readonly kind: 'neg'; readonly expr: Expr }
  | {
      readonly kind: 'bin';
      readonly op: '+' | '-' | '*' | '/';
      readonly left: Expr;
      readonly right: Expr;
    }
  | {
      readonly kind: 'clamp';
      readonly expr: Expr;
      readonly min: number;
      readonly max: number;
    };

function assertNever(x: never): never {
  throw new Error(\`Unexpected expression node: \${JSON.stringify(x)}\`);
}

function normalizeZero(n: number): number {
  return n === 0 ? 0 : n;
}

export function evaluateExpr(expr: Expr): number | null {
  switch (expr.kind) {
    case 'lit':
      return normalizeZero(expr.value);
    case 'neg': {
      const inner = evaluateExpr(expr.expr);
      return inner === null ? null : normalizeZero(-inner);
    }
    case 'bin': {
      const left = evaluateExpr(expr.left);
      if (left === null) return null;
      const right = evaluateExpr(expr.right);
      if (right === null) return null;

      switch (expr.op) {
        case '+':
          return normalizeZero(left + right);
        case '-':
          return normalizeZero(left - right);
        case '*':
          return normalizeZero(left * right);
        case '/':
          return right === 0 ? null : normalizeZero(left / right);
        default:
          return assertNever(expr.op);
      }
    }
    case 'clamp': {
      const inner = evaluateExpr(expr.expr);
      if (inner === null) return null;
      return normalizeZero(Math.min(expr.max, Math.max(expr.min, inner)));
    }
    default:
      return assertNever(expr);
  }
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Evaluates nested arithmetic and clamp',
              args: [
                {
                  kind: 'clamp',
                  min: 0,
                  max: 50,
                  expr: {
                    kind: 'bin',
                    op: '*',
                    left: { kind: 'lit', value: 12 },
                    right: {
                      kind: 'bin',
                      op: '+',
                      left: { kind: 'lit', value: 3 },
                      right: { kind: 'lit', value: 4 },
                    },
                  },
                },
              ],
              expected: 50,
            },
            {
              id: 'tc-2',
              name: 'Propagates division by zero inside nested sub-expression',
              args: [
                {
                  kind: 'bin',
                  op: '+',
                  left: { kind: 'lit', value: 10 },
                  right: {
                    kind: 'bin',
                    op: '/',
                    left: { kind: 'lit', value: 5 },
                    right: {
                      kind: 'bin',
                      op: '-',
                      left: { kind: 'lit', value: 2 },
                      right: { kind: 'lit', value: 2 },
                    },
                  },
                },
              ],
              expected: null,
            },
            {
              id: 'tc-3',
              name: 'Handles negation and subtraction',
              args: [
                {
                  kind: 'neg',
                  expr: {
                    kind: 'bin',
                    op: '-',
                    left: { kind: 'lit', value: 4 },
                    right: { kind: 'lit', value: 11 },
                  },
                },
              ],
              expected: 7,
            },
            {
              id: 'tc-4',
              name: 'Clamp enforces lower bound',
              args: [
                {
                  kind: 'clamp',
                  min: 10,
                  max: 100,
                  expr: { kind: 'neg', expr: { kind: 'lit', value: 25 } },
                },
              ],
              expected: 10,
            },
            {
              id: 'tc-5',
              name: 'Hidden: Negating zero normalizes -0 to 0',
              hidden: true,
              args: [{ kind: 'neg', expr: { kind: 'lit', value: 0 } }],
              expected: 0,
            },
            {
              id: 'tc-6',
              name: 'Hidden: Clamp around null child propagates null',
              hidden: true,
              args: [
                {
                  kind: 'clamp',
                  min: 0,
                  max: 10,
                  expr: {
                    kind: 'bin',
                    op: '/',
                    left: { kind: 'lit', value: 1 },
                    right: { kind: 'lit', value: 0 },
                  },
                },
              ],
              expected: null,
            },
          ],
        },
        {
          id: 's3-p3-c2',
          title: 'Result<T, E> Pricing Pipeline',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Model recoverable checkout errors with \`Result<T, E> = { ok: true; value: T } | { ok: false; error: E }\` and implement \`pipelineResults(rawPrice, discountPercent, couponCode)\`.

### Sequential Validation Steps
1. **Parse base price:** Trim \`rawPrice\`. If empty, or \`Number(trimmed)\` is not a positive integer (\`> 0\`), return \`{ ok: false, error: 'INVALID_PRICE' }\`.
2. **Apply percentage discount:** Validate \`discountPercent\` is an integer with \`0 <= discountPercent <= 80\`; otherwise return \`{ ok: false, error: 'INVALID_DISCOUNT' }\`. Compute \`discounted = Math.round((priceCents * (100 - discountPercent)) / 100)\`.
3. **Apply optional coupon:**
   - \`null\`: keep \`discounted\`.
   - \`'SAVE500'\`: \`Math.max(100, discounted - 500)\`.
   - \`'VIP1000'\`: \`Math.max(100, discounted - 1000)\`.
   - Any other string: return \`{ ok: false, error: 'UNKNOWN_COUPON' }\`.

Return \`{ ok: true, value: finalCents }\` if all steps succeed.`,
          tags: ['Result Pattern', 'Discriminated Unions', 'Error Handling'],
          hints: [
            'Define `PricingError = "INVALID_PRICE" | "INVALID_DISCOUNT" | "UNKNOWN_COUPON"` so typos fail at compile time.',
            'Write small stage functions returning `Result<number, PricingError>` and narrow on `step.ok` between stages.',
          ],
          entryFunction: 'pipelineResults',
          astRules: { requireTypeNarrowing: true, requireInterfaceOrType: true },
          starterCode: `export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export type PricingError = 'INVALID_PRICE' | 'INVALID_DISCOUNT' | 'UNKNOWN_COUPON';

export function pipelineResults(
  rawPrice: string,
  discountPercent: number,
  couponCode: string | null
): Result<number, PricingError> {
  // TODO: Chain Result validation steps
  return { ok: false, error: 'INVALID_PRICE' };
}
`,
          referenceSolution: `export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export type PricingError = 'INVALID_PRICE' | 'INVALID_DISCOUNT' | 'UNKNOWN_COUPON';

function parsePrice(rawPrice: string): Result<number, PricingError> {
  const trimmed = rawPrice.trim();
  if (trimmed.length === 0) return { ok: false, error: 'INVALID_PRICE' };
  const n = Number(trimmed);
  if (!Number.isInteger(n) || n <= 0) return { ok: false, error: 'INVALID_PRICE' };
  return { ok: true, value: n };
}

function applyDiscount(priceCents: number, discountPercent: number): Result<number, PricingError> {
  if (!Number.isInteger(discountPercent) || discountPercent < 0 || discountPercent > 80) {
    return { ok: false, error: 'INVALID_DISCOUNT' };
  }
  return {
    ok: true,
    value: Math.round((priceCents * (100 - discountPercent)) / 100),
  };
}

function applyCoupon(amountCents: number, couponCode: string | null): Result<number, PricingError> {
  if (couponCode === null) return { ok: true, value: amountCents };
  if (couponCode === 'SAVE500') return { ok: true, value: Math.max(100, amountCents - 500) };
  if (couponCode === 'VIP1000') return { ok: true, value: Math.max(100, amountCents - 1000) };
  return { ok: false, error: 'UNKNOWN_COUPON' };
}

export function pipelineResults(
  rawPrice: string,
  discountPercent: number,
  couponCode: string | null
): Result<number, PricingError> {
  const step1 = parsePrice(rawPrice);
  if (!step1.ok) return step1;

  const step2 = applyDiscount(step1.value, discountPercent);
  if (!step2.ok) return step2;

  return applyCoupon(step2.value, couponCode);
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Valid price, 20% discount, and SAVE500 coupon',
              args: [' 2500 ', 20, 'SAVE500'],
              expected: { ok: true, value: 1500 },
            },
            {
              id: 'tc-2',
              name: 'Coupon clamps minimum checkout price to 100 cents',
              args: ['800', 50, 'VIP1000'],
              expected: { ok: true, value: 100 },
            },
            {
              id: 'tc-3',
              name: 'Invalid price fails before later steps',
              args: ['0', 99, 'BAD'],
              expected: { ok: false, error: 'INVALID_PRICE' },
            },
            {
              id: 'tc-4',
              name: 'Discount above 80% returns INVALID_DISCOUNT',
              args: ['3000', 85, null],
              expected: { ok: false, error: 'INVALID_DISCOUNT' },
            },
            {
              id: 'tc-5',
              name: 'Hidden: Unknown coupon code returns UNKNOWN_COUPON',
              hidden: true,
              args: ['2000', 10, 'FREEALL'],
              expected: { ok: false, error: 'UNKNOWN_COUPON' },
            },
            {
              id: 'tc-6',
              name: 'Hidden: Decimal rawPrice is rejected as INVALID_PRICE',
              hidden: true,
              args: ['19.99', 0, null],
              expected: { ok: false, error: 'INVALID_PRICE' },
            },
          ],
        },
        {
          id: 's3-p3-c3',
          title: 'Exhaustive Request State Reducer',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Implement \`reduceRequestState(initialState, events)\` to fold an array of \`RequestEvent\` actions over a \`RequestState\` discriminated union without mutating inputs.

### States (\`status\`)
- \`{ status: 'idle' }\`
- \`{ status: 'loading'; requestId: string; attempt: number }\`
- \`{ status: 'success'; data: string; stale: boolean }\`
- \`{ status: 'error'; message: string; retryable: boolean }\`

### Transition Rules by Event (\`type\`)
- \`FETCH { requestId }\`: from **any** state -> \`{ status: 'loading', requestId, attempt: 1 }\`.
- \`RETRY { requestId }\`:
  - If \`state.status === 'error'\` and \`state.retryable === true\` -> \`{ status: 'loading', requestId, attempt: 1 }\`.
  - If \`state.status === 'loading'\` -> \`{ status: 'loading', requestId, attempt: state.attempt + 1 }\`.
  - Otherwise -> \`state\` unchanged.
- \`RESOLVE { requestId, data }\`: ONLY if \`state.status === 'loading'\` and \`state.requestId === event.requestId\` -> \`{ status: 'success', data, stale: false }\`; otherwise ignore stale response!
- \`FAIL { requestId, message, retryable }\`: ONLY if \`state.status === 'loading'\` and \`state.requestId === event.requestId\` -> \`{ status: 'error', message, retryable }\`; otherwise ignore!
- \`INVALIDATE\`: if \`state.status === 'success'\` -> \`{ ...state, stale: true }\`; otherwise unchanged.
- \`RESET\`: from **any** state -> \`{ status: 'idle' }\`.`,
          tags: ['State Machines', 'Reducers', 'Stale Request Guard'],
          hints: [
            'Write a pure single-step helper `step(state: RequestState, event: RequestEvent): RequestState` using `switch (event.type)` plus an `assertNever(event)` default.',
            'Checking `state.requestId === event.requestId` on `RESOLVE` and `FAIL` prevents out-of-order network responses from overwriting newer requests.',
          ],
          entryFunction: 'reduceRequestState',
          astRules: { requireTypeNarrowing: true, requireInterfaceOrType: true },
          starterCode: `export type RequestState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading'; readonly requestId: string; readonly attempt: number }
  | { readonly status: 'success'; readonly data: string; readonly stale: boolean }
  | { readonly status: 'error'; readonly message: string; readonly retryable: boolean };

export type RequestEvent =
  | { readonly type: 'FETCH'; readonly requestId: string }
  | { readonly type: 'RETRY'; readonly requestId: string }
  | { readonly type: 'RESOLVE'; readonly requestId: string; readonly data: string }
  | {
      readonly type: 'FAIL';
      readonly requestId: string;
      readonly message: string;
      readonly retryable: boolean;
    }
  | { readonly type: 'INVALIDATE' }
  | { readonly type: 'RESET' };

export function reduceRequestState(
  initialState: RequestState,
  events: readonly RequestEvent[]
): RequestState {
  // TODO: Fold events exhaustively over RequestState
  return initialState;
}
`,
          referenceSolution: `export type RequestState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading'; readonly requestId: string; readonly attempt: number }
  | { readonly status: 'success'; readonly data: string; readonly stale: boolean }
  | { readonly status: 'error'; readonly message: string; readonly retryable: boolean };

export type RequestEvent =
  | { readonly type: 'FETCH'; readonly requestId: string }
  | { readonly type: 'RETRY'; readonly requestId: string }
  | { readonly type: 'RESOLVE'; readonly requestId: string; readonly data: string }
  | {
      readonly type: 'FAIL';
      readonly requestId: string;
      readonly message: string;
      readonly retryable: boolean;
    }
  | { readonly type: 'INVALIDATE' }
  | { readonly type: 'RESET' };

function assertNever(x: never): never {
  throw new Error(\`Unhandled event: \${JSON.stringify(x)}\`);
}

function step(state: RequestState, event: RequestEvent): RequestState {
  switch (event.type) {
    case 'FETCH':
      return { status: 'loading', requestId: event.requestId, attempt: 1 };
    case 'RETRY':
      if (state.status === 'error' && state.retryable) {
        return { status: 'loading', requestId: event.requestId, attempt: 1 };
      }
      if (state.status === 'loading') {
        return { status: 'loading', requestId: event.requestId, attempt: state.attempt + 1 };
      }
      return state;
    case 'RESOLVE':
      if (state.status === 'loading' && state.requestId === event.requestId) {
        return { status: 'success', data: event.data, stale: false };
      }
      return state;
    case 'FAIL':
      if (state.status === 'loading' && state.requestId === event.requestId) {
        return { status: 'error', message: event.message, retryable: event.retryable };
      }
      return state;
    case 'INVALIDATE':
      if (state.status === 'success') {
        return { status: 'success', data: state.data, stale: true };
      }
      return state;
    case 'RESET':
      return { status: 'idle' };
    default:
      return assertNever(event);
  }
}

export function reduceRequestState(
  initialState: RequestState,
  events: readonly RequestEvent[]
): RequestState {
  let current = initialState;
  for (const event of events) {
    current = step(current, event);
  }
  return current;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Ignores stale RESOLVE from superseded requestId',
              checkImmutability: true,
              args: [
                { status: 'idle' },
                [
                  { type: 'FETCH', requestId: 'req-1' },
                  { type: 'FETCH', requestId: 'req-2' },
                  { type: 'RESOLVE', requestId: 'req-1', data: 'old-payload' },
                  { type: 'RESOLVE', requestId: 'req-2', data: 'fresh-payload' },
                ],
              ],
              expected: { status: 'success', data: 'fresh-payload', stale: false },
            },
            {
              id: 'tc-2',
              name: 'Retryable error recovers via RETRY and INVALIDATE marks data stale',
              checkImmutability: true,
              args: [
                { status: 'idle' },
                [
                  { type: 'FETCH', requestId: 'r1' },
                  { type: 'FAIL', requestId: 'r1', message: 'Timeout', retryable: true },
                  { type: 'RETRY', requestId: 'r2' },
                  { type: 'RESOLVE', requestId: 'r2', data: 'ok' },
                  { type: 'INVALIDATE' },
                ],
              ],
              expected: { status: 'success', data: 'ok', stale: true },
            },
            {
              id: 'tc-3',
              name: 'Non-retryable error ignores RETRY',
              checkImmutability: true,
              args: [
                { status: 'error', message: '403 Forbidden', retryable: false },
                [{ type: 'RETRY', requestId: 'r9' }],
              ],
              expected: { status: 'error', message: '403 Forbidden', retryable: false },
            },
            {
              id: 'tc-4',
              name: 'RETRY while loading increments attempt counter',
              checkImmutability: true,
              args: [
                { status: 'idle' },
                [
                  { type: 'FETCH', requestId: 'r1' },
                  { type: 'RETRY', requestId: 'r1-b' },
                  { type: 'RETRY', requestId: 'r1-c' },
                ],
              ],
              expected: { status: 'loading', requestId: 'r1-c', attempt: 3 },
            },
            {
              id: 'tc-5',
              name: 'Hidden: Stale FAIL does not clobber active request',
              hidden: true,
              checkImmutability: true,
              args: [
                { status: 'loading', requestId: 'active', attempt: 1 },
                [{ type: 'FAIL', requestId: 'stale', message: 'Network', retryable: true }],
              ],
              expected: { status: 'loading', requestId: 'active', attempt: 1 },
            },
            {
              id: 'tc-6',
              name: 'Hidden: RESET returns any state to idle',
              hidden: true,
              checkImmutability: true,
              args: [
                { status: 'success', data: 'cached', stale: true },
                [{ type: 'RESET' }],
              ],
              expected: { status: 'idle' },
            },
          ],
        },
        {
          id: 's3-p3-c4',
          title: 'Discriminated Event Extractor & Handler Map',
          style: 'type-challenge',
          difficulty: 'medium',
          description: `Given a discriminated union \`E extends { kind: string }\`, implement two compile-time utilities:

1. \`EventByKind<E extends { kind: string }, K extends E['kind']>\`: Extracts the specific union member(s) of \`E\` whose \`kind\` matches \`K\`.
2. \`EventHandlers<E extends { kind: string }, R>\`: Builds a handler lookup object mapping every \`K\` in \`E['kind']\` to a callback \`(event: EventByKind<E, K>) => R\`.`,
          tags: ['Discriminated Unions', 'Mapped Types', 'Type Extraction'],
          hints: [
            'Use a distributive conditional `E extends { kind: K } ? E : never` (or `Extract<E, { kind: K }>`).',
            'Map over `[K in E["kind"]]` so each property receives the narrowed `EventByKind<E, K>` parameter.',
          ],
          starterCode: `export type EventByKind<E extends { kind: string }, K extends E['kind']> = E;

export type EventHandlers<E extends { kind: string }, R> = Record<E['kind'], (event: E) => R>;
`,
          referenceSolution: `export type EventByKind<
  E extends { kind: string },
  K extends E['kind'],
> = E extends { kind: K } ? E : never;

export type EventHandlers<E extends { kind: string }, R> = {
  [K in E['kind']]: (event: EventByKind<E, K>) => R;
};
`,
          typeAssertionPrelude: `import type { EventByKind, EventHandlers } from './solution';

type DomainEvent =
  | { kind: 'user.created'; userId: string; email: string }
  | { kind: 'user.deleted'; userId: string }
  | { kind: 'invoice.paid'; invoiceId: string; cents: number };`,
          typeAssertions: [
            {
              id: 'ta-1',
              name: 'Extracts user.created variant accurately',
              assertion: `Expect<Equal<EventByKind<DomainEvent, 'user.created'>, { kind: 'user.created'; userId: string; email: string }>>`,
            },
            {
              id: 'ta-2',
              name: 'Extracts union when K is a union of kinds',
              assertion: `Expect<Equal<EventByKind<DomainEvent, 'user.deleted' | 'invoice.paid'>, { kind: 'user.deleted'; userId: string } | { kind: 'invoice.paid'; invoiceId: string; cents: number }>>`,
            },
            {
              id: 'ta-3',
              name: 'EventHandlers creates strongly typed per-kind callbacks',
              assertion: `Expect<Equal<EventHandlers<DomainEvent, boolean>, {
                'user.created': (event: { kind: 'user.created'; userId: string; email: string }) => boolean;
                'user.deleted': (event: { kind: 'user.deleted'; userId: string }) => boolean;
                'invoice.paid': (event: { kind: 'invoice.paid'; invoiceId: string; cents: number }) => boolean;
              }>>`,
            },
            {
              id: 'ta-4',
              name: 'Works on single-variant discriminated union',
              assertion: `Expect<Equal<EventHandlers<{ kind: 'ping'; ts: number }, void>, { ping: (event: { kind: 'ping'; ts: number }) => void }>>`,
            },
            {
              id: 'ta-5',
              name: 'Hidden: Preserves readonly fields inside extracted event',
              hidden: true,
              assertion: `Expect<Equal<EventByKind<{ kind: 'a'; readonly id: number } | { kind: 'b' }, 'a'>, { kind: 'a'; readonly id: number }>>`,
            },
            {
              id: 'ta-6',
              name: 'Hidden: Return type R can itself be a union',
              hidden: true,
              assertion: `Expect<Equal<EventHandlers<{ kind: 'stop' }, string | null>, { stop: (event: { kind: 'stop' }) => string | null }>>`,
            },
          ],
          testCases: [],
        },
      ],
    },
    {
      id: 's3-p4',
      number: 4,
      title: 'User-Defined Type Predicates (`is`) & Safe `unknown` Parsing',
      subtitle: 'Validating untrusted JSON, nested runtime guards, and schema boundaries',
      conceptSummary: `External data (\`JSON.parse\`, network webhooks, plugin configs) should enter your system typed as \`unknown\`, never \`any\`.

- **User-defined type guards (\`val is Target\`):** A function returning \`val is TelemetryPacket\` teaches TypeScript's control-flow analyzer that when the function returns \`true\`, \`val\` has been verified at runtime to match \`Target\`.
- **Safe plain-object check:** Always verify \`typeof v === 'object' && v !== null && !Array.isArray(v)\` before inspecting properties on \`unknown\`.
- **Array filtering with predicates:** \`items.filter(isOrder)\` automatically narrows \`unknown[]\` into \`Order[]\`!`,
      challenges: [
        {
          id: 's3-p4-c1',
          title: 'Runtime Telemetry Guard from unknown',
          style: 'leetcode',
          difficulty: 'easy',
          description: `Write a user-defined type guard \`isTelemetryPacket(value: unknown): value is TelemetryPacket\` and use it inside \`parseTelemetryPacket(rawJson)\`.

### Valid \`TelemetryPacket\` Contract
- Plain object with:
  - \`sensorId\`: non-empty \`string\` (\`sensorId.trim().length > 0\`).
  - \`readings\`: non-empty array of finite \`number\` values (\`Number.isFinite(n)\`).
  - \`status\`: one of \`'ok' | 'warn' | 'critical'\`.

\`parseTelemetryPacket(rawJson: string)\` must catch malformed JSON cleanly and return \`TelemetryPacket | null\`.`,
          tags: ['Type Predicates', 'unknown', 'JSON Parsing'],
          hints: [
            'Check `typeof value === "object" && value !== null && !Array.isArray(value)` first, then cast or inspect via `const rec = value as Record<string, unknown>`.',
            'Verify `Array.isArray(rec.readings) && rec.readings.length > 0 && rec.readings.every((n) => typeof n === "number" && Number.isFinite(n))`.',
          ],
          entryFunction: 'parseTelemetryPacket',
          astRules: { requireTypePredicate: true, requireInterfaceOrType: true },
          starterCode: `export interface TelemetryPacket {
  readonly sensorId: string;
  readonly readings: readonly number[];
  readonly status: 'ok' | 'warn' | 'critical';
}

export function isTelemetryPacket(value: unknown): value is TelemetryPacket {
  // TODO: Validate unknown value at runtime
  return false;
}

export function parseTelemetryPacket(rawJson: string): TelemetryPacket | null {
  // TODO: Parse rawJson safely and validate with isTelemetryPacket
  return null;
}
`,
          referenceSolution: `export interface TelemetryPacket {
  readonly sensorId: string;
  readonly readings: readonly number[];
  readonly status: 'ok' | 'warn' | 'critical';
}

function isPlainRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function isTelemetryPacket(value: unknown): value is TelemetryPacket {
  if (!isPlainRecord(value)) return false;
  if (typeof value.sensorId !== 'string' || value.sensorId.trim().length === 0) {
    return false;
  }
  if (
    value.status !== 'ok' &&
    value.status !== 'warn' &&
    value.status !== 'critical'
  ) {
    return false;
  }
  if (!Array.isArray(value.readings) || value.readings.length === 0) {
    return false;
  }
  return value.readings.every((r) => typeof r === 'number' && Number.isFinite(r));
}

export function parseTelemetryPacket(rawJson: string): TelemetryPacket | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return null;
  }
  return isTelemetryPacket(parsed) ? parsed : null;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Accepts valid telemetry JSON payload',
              args: ['{"sensorId":"temp-north","readings":[21.5,22.0,21.8],"status":"ok"}'],
              expected: {
                sensorId: 'temp-north',
                readings: [21.5, 22, 21.8],
                status: 'ok',
              },
            },
            {
              id: 'tc-2',
              name: 'Rejects malformed JSON syntax without throwing',
              args: ['{"sensorId":"broken"'],
              expected: null,
            },
            {
              id: 'tc-3',
              name: 'Rejects empty readings array',
              args: ['{"sensorId":"s1","readings":[],"status":"warn"}'],
              expected: null,
            },
            {
              id: 'tc-4',
              name: 'Rejects unknown status literal',
              args: ['{"sensorId":"s1","readings":[10],"status":"healthy"}'],
              expected: null,
            },
            {
              id: 'tc-5',
              name: 'Hidden: Rejects non-number entries inside readings',
              hidden: true,
              args: ['{"sensorId":"s1","readings":[10,"20",null],"status":"critical"}'],
              expected: null,
            },
            {
              id: 'tc-6',
              name: 'Hidden: Rejects whitespace-only sensorId',
              hidden: true,
              args: ['{"sensorId":"   ","readings":[42],"status":"ok"}'],
              expected: null,
            },
          ],
        },
        {
          id: 's3-p4-c2',
          title: 'Nested Order Batch Filter',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Given \`batch: readonly unknown[]\`, write nested type predicates \`isOrderItem\` and \`isOrder\` and summarize all valid orders in \`extractValidOrders(batch)\`.

### Valid \`Order\` Shape
- \`orderId\`: non-empty \`string\` (\`orderId.trim().length > 0\`).
- \`customer\`: plain object \`{ id: string; vip: boolean }\` where \`id.trim().length > 0\` and \`typeof vip === 'boolean'\`.
- \`items\`: non-empty array of \`OrderItem\`, each \`{ sku: string; qty: number; priceCents: number }\` where:
  - \`sku.trim().length > 0\`
  - \`qty\` is an integer \`>= 1\`
  - \`priceCents\` is an integer \`>= 0\`

### Output Summary
Return \`{ validOrderIds: string[]; totalRevenueCents: number; vipOrderCount: number }\`, preserving batch order for \`validOrderIds\` and summing \`qty * priceCents\` across all valid orders.`,
          tags: ['Nested Type Guards', 'Array.filter Narrowing', 'Validation'],
          hints: [
            'Compose small guards: `isPlainObject` -> `isOrderItem` -> `isOrder`.',
            'Calling `const validOrders = batch.filter(isOrder)` narrows `validOrders` directly to `Order[]`!',
          ],
          entryFunction: 'extractValidOrders',
          astRules: { requireTypePredicate: true, requireInterfaceOrType: true },
          starterCode: `export interface OrderItem {
  readonly sku: string;
  readonly qty: number;
  readonly priceCents: number;
}

export interface Order {
  readonly orderId: string;
  readonly customer: {
    readonly id: string;
    readonly vip: boolean;
  };
  readonly items: readonly OrderItem[];
}

export interface BatchSummary {
  readonly validOrderIds: string[];
  readonly totalRevenueCents: number;
  readonly vipOrderCount: number;
}

export function isOrder(value: unknown): value is Order {
  // TODO: Implement nested runtime guard
  return false;
}

export function extractValidOrders(batch: readonly unknown[]): BatchSummary {
  // TODO: Filter batch with isOrder and aggregate summary metrics
  return { validOrderIds: [], totalRevenueCents: 0, vipOrderCount: 0 };
}
`,
          referenceSolution: `export interface OrderItem {
  readonly sku: string;
  readonly qty: number;
  readonly priceCents: number;
}

export interface Order {
  readonly orderId: string;
  readonly customer: {
    readonly id: string;
    readonly vip: boolean;
  };
  readonly items: readonly OrderItem[];
}

export interface BatchSummary {
  readonly validOrderIds: string[];
  readonly totalRevenueCents: number;
  readonly vipOrderCount: number;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function isOrderItem(v: unknown): v is OrderItem {
  if (!isRecord(v)) return false;
  return (
    typeof v.sku === 'string' &&
    v.sku.trim().length > 0 &&
    typeof v.qty === 'number' &&
    Number.isInteger(v.qty) &&
    v.qty >= 1 &&
    typeof v.priceCents === 'number' &&
    Number.isInteger(v.priceCents) &&
    v.priceCents >= 0
  );
}

export function isOrder(value: unknown): value is Order {
  if (!isRecord(value)) return false;
  if (typeof value.orderId !== 'string' || value.orderId.trim().length === 0) {
    return false;
  }
  if (!isRecord(value.customer)) return false;
  if (
    typeof value.customer.id !== 'string' ||
    value.customer.id.trim().length === 0 ||
    typeof value.customer.vip !== 'boolean'
  ) {
    return false;
  }
  if (!Array.isArray(value.items) || value.items.length === 0) return false;
  return value.items.every(isOrderItem);
}

export function extractValidOrders(batch: readonly unknown[]): BatchSummary {
  const valid = batch.filter(isOrder);
  let totalRevenueCents = 0;
  let vipOrderCount = 0;

  for (const order of valid) {
    if (order.customer.vip) vipOrderCount++;
    for (const item of order.items) {
      totalRevenueCents += item.qty * item.priceCents;
    }
  }

  return {
    validOrderIds: valid.map((o) => o.orderId),
    totalRevenueCents,
    vipOrderCount,
  };
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Filters mixed valid and malformed order payloads',
              args: [
                [
                  {
                    orderId: 'ORD-1',
                    customer: { id: 'c1', vip: true },
                    items: [{ sku: 'KEYB', qty: 2, priceCents: 4500 }],
                  },
                  {
                    orderId: 'ORD-BAD-QTY',
                    customer: { id: 'c2', vip: false },
                    items: [{ sku: 'MOUSE', qty: 0, priceCents: 2000 }],
                  },
                  null,
                  {
                    orderId: 'ORD-2',
                    customer: { id: 'c3', vip: false },
                    items: [
                      { sku: 'CABLE', qty: 3, priceCents: 500 },
                      { sku: 'PROMO', qty: 1, priceCents: 0 },
                    ],
                  },
                ],
              ],
              expected: {
                validOrderIds: ['ORD-1', 'ORD-2'],
                totalRevenueCents: 10500,
                vipOrderCount: 1,
              },
            },
            {
              id: 'tc-2',
              name: 'Rejects empty items array and non-boolean vip flag',
              args: [
                [
                  { orderId: 'O-1', customer: { id: 'c1', vip: 'yes' }, items: [{ sku: 'A', qty: 1, priceCents: 100 }] },
                  { orderId: 'O-2', customer: { id: 'c2', vip: true }, items: [] },
                ],
              ],
              expected: { validOrderIds: [], totalRevenueCents: 0, vipOrderCount: 0 },
            },
            {
              id: 'tc-3',
              name: 'Handles empty batch',
              args: [[]],
              expected: { validOrderIds: [], totalRevenueCents: 0, vipOrderCount: 0 },
            },
            {
              id: 'tc-4',
              name: 'Hidden: Rejects negative priceCents or fractional qty',
              hidden: true,
              args: [
                [
                  {
                    orderId: 'O-NEG',
                    customer: { id: 'c1', vip: true },
                    items: [{ sku: 'X', qty: 1, priceCents: -10 }],
                  },
                  {
                    orderId: 'O-FRAC',
                    customer: { id: 'c1', vip: true },
                    items: [{ sku: 'X', qty: 1.5, priceCents: 100 }],
                  },
                ],
              ],
              expected: { validOrderIds: [], totalRevenueCents: 0, vipOrderCount: 0 },
            },
            {
              id: 'tc-5',
              name: 'Hidden: Rejects array passed as customer field',
              hidden: true,
              args: [
                [
                  {
                    orderId: 'O-ARR',
                    customer: ['c1', true],
                    items: [{ sku: 'X', qty: 1, priceCents: 100 }],
                  },
                  {
                    orderId: 'O-OK',
                    customer: { id: 'c9', vip: true },
                    items: [{ sku: 'X', qty: 4, priceCents: 250 }],
                  },
                ],
              ],
              expected: { validOrderIds: ['O-OK'], totalRevenueCents: 1000, vipOrderCount: 1 },
            },
          ],
        },
        {
          id: 's3-p4-c3',
          title: 'Webhook Event Predicate Filter',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Validate an array of untrusted webhook objects (\`readonly unknown[]\`) against a discriminated union \`WebhookEvent\` using \`isWebhookEvent\`, then aggregate metrics in \`summarizeWebhookBatch(payloads)\`.

### Valid \`WebhookEvent\` Variants
1. \`{ event: 'payment.succeeded'; txId: string; amountCents: number }\` (\`txId\` non-empty trimmed, \`amountCents\` positive integer \`> 0\`)
2. \`{ event: 'payment.refunded'; txId: string; amountCents: number; reason: string }\` (\`txId\` non-empty trimmed, \`amountCents\` positive integer \`> 0\`, \`typeof reason === 'string'\`)
3. \`{ event: 'account.locked'; userId: string }\` (\`userId\` non-empty trimmed)

### Aggregation Rules
- \`netRevenueCents\`: sum of \`payment.succeeded\` amounts **minus** sum of \`payment.refunded\` amounts (may be negative).
- \`refundedTxIds\`: \`txId\` values from valid \`payment.refunded\` events in arrival order.
- \`lockedUsers\`: unique \`userId\` values from valid \`account.locked\` events in first-seen order.
- \`droppedCount\`: number of items in \`payloads\` that failed \`isWebhookEvent\`.`,
          tags: ['Type Predicates', 'Discriminated Unions', 'Webhooks'],
          hints: [
            'Inside `isWebhookEvent`, narrow on `rec.event` first (`"payment.succeeded"`, `"payment.refunded"`, `"account.locked"`), then check that variant\'s required fields.',
            'Track `lockedUsers` with a `Set<string>` to preserve first-seen uniqueness.',
          ],
          entryFunction: 'summarizeWebhookBatch',
          astRules: { requireTypePredicate: true, requireTypeNarrowing: true },
          starterCode: `export type WebhookEvent =
  | { readonly event: 'payment.succeeded'; readonly txId: string; readonly amountCents: number }
  | {
      readonly event: 'payment.refunded';
      readonly txId: string;
      readonly amountCents: number;
      readonly reason: string;
    }
  | { readonly event: 'account.locked'; readonly userId: string };

export interface WebhookSummary {
  readonly netRevenueCents: number;
  readonly refundedTxIds: string[];
  readonly lockedUsers: string[];
  readonly droppedCount: number;
}

export function isWebhookEvent(value: unknown): value is WebhookEvent {
  // TODO: Validate discriminated WebhookEvent variants
  return false;
}

export function summarizeWebhookBatch(payloads: readonly unknown[]): WebhookSummary {
  // TODO: Filter and summarize valid webhook events
  return { netRevenueCents: 0, refundedTxIds: [], lockedUsers: [], droppedCount: 0 };
}
`,
          referenceSolution: `export type WebhookEvent =
  | { readonly event: 'payment.succeeded'; readonly txId: string; readonly amountCents: number }
  | {
      readonly event: 'payment.refunded';
      readonly txId: string;
      readonly amountCents: number;
      readonly reason: string;
    }
  | { readonly event: 'account.locked'; readonly userId: string };

export interface WebhookSummary {
  readonly netRevenueCents: number;
  readonly refundedTxIds: string[];
  readonly lockedUsers: string[];
  readonly droppedCount: number;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isPositiveInt(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v > 0;
}

export function isWebhookEvent(value: unknown): value is WebhookEvent {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const rec = value as Record<string, unknown>;
  switch (rec.event) {
    case 'payment.succeeded':
      return isNonEmptyString(rec.txId) && isPositiveInt(rec.amountCents);
    case 'payment.refunded':
      return (
        isNonEmptyString(rec.txId) &&
        isPositiveInt(rec.amountCents) &&
        typeof rec.reason === 'string'
      );
    case 'account.locked':
      return isNonEmptyString(rec.userId);
    default:
      return false;
  }
}

export function summarizeWebhookBatch(payloads: readonly unknown[]): WebhookSummary {
  let netRevenueCents = 0;
  const refundedTxIds: string[] = [];
  const lockedSet = new Set<string>();
  const lockedUsers: string[] = [];
  let droppedCount = 0;

  for (const item of payloads) {
    if (!isWebhookEvent(item)) {
      droppedCount++;
      continue;
    }
    switch (item.event) {
      case 'payment.succeeded':
        netRevenueCents += item.amountCents;
        break;
      case 'payment.refunded':
        netRevenueCents -= item.amountCents;
        refundedTxIds.push(item.txId);
        break;
      case 'account.locked':
        if (!lockedSet.has(item.userId)) {
          lockedSet.add(item.userId);
          lockedUsers.push(item.userId);
        }
        break;
    }
  }

  return {
    netRevenueCents,
    refundedTxIds,
    lockedUsers,
    droppedCount,
  };
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Aggregates payments, refunds, deduplicated locks, and dropped count',
              args: [
                [
                  { event: 'payment.succeeded', txId: 'tx-1', amountCents: 5000 },
                  { event: 'payment.refunded', txId: 'tx-1', amountCents: 1200, reason: 'partial' },
                  { event: 'account.locked', userId: 'u-7' },
                  { event: 'account.locked', userId: 'u-7' },
                  { event: 'payment.succeeded', txId: 'tx-bad', amountCents: 0 },
                  'corrupt-payload',
                ],
              ],
              expected: {
                netRevenueCents: 3800,
                refundedTxIds: ['tx-1'],
                lockedUsers: ['u-7'],
                droppedCount: 2,
              },
            },
            {
              id: 'tc-2',
              name: 'Refund missing reason string is dropped',
              args: [
                [
                  { event: 'payment.refunded', txId: 'tx-9', amountCents: 500 },
                  { event: 'payment.refunded', txId: 'tx-10', amountCents: 500, reason: '' },
                ],
              ],
              expected: {
                netRevenueCents: -500,
                refundedTxIds: ['tx-10'],
                lockedUsers: [],
                droppedCount: 1,
              },
            },
            {
              id: 'tc-3',
              name: 'All invalid payloads count as dropped',
              args: [[null, [], { event: 'unknown.event' }]],
              expected: {
                netRevenueCents: 0,
                refundedTxIds: [],
                lockedUsers: [],
                droppedCount: 3,
              },
            },
            {
              id: 'tc-4',
              name: 'Preserves order across multiple locked users',
              args: [
                [
                  { event: 'account.locked', userId: 'zoe' },
                  { event: 'account.locked', userId: 'ada' },
                  { event: 'account.locked', userId: 'zoe' },
                ],
              ],
              expected: {
                netRevenueCents: 0,
                refundedTxIds: [],
                lockedUsers: ['zoe', 'ada'],
                droppedCount: 0,
              },
            },
            {
              id: 'tc-5',
              name: 'Hidden: Rejects floating-point amountCents',
              hidden: true,
              args: [[{ event: 'payment.succeeded', txId: 'tx-float', amountCents: 12.5 }]],
              expected: {
                netRevenueCents: 0,
                refundedTxIds: [],
                lockedUsers: [],
                droppedCount: 1,
              },
            },
            {
              id: 'tc-6',
              name: 'Hidden: Rejects whitespace-only userId or txId',
              hidden: true,
              args: [
                [
                  { event: 'account.locked', userId: '   ' },
                  { event: 'payment.succeeded', txId: '\t', amountCents: 100 },
                ],
              ],
              expected: {
                netRevenueCents: 0,
                refundedTxIds: [],
                lockedUsers: [],
                droppedCount: 2,
              },
            },
          ],
        },
        {
          id: 's3-p4-c4',
          title: 'Schema Guard for Service Config',
          style: 'leetcode',
          difficulty: 'hard',
          description: `Implement \`isServiceConfig(val: unknown): val is ServiceConfig\` and \`validateConfigDocument(val: unknown)\` to validate service boot configurations strictly.

### \`ServiceConfig\` Contract
- \`serviceName\`: \`string\` matching \`/^[a-z][a-z0-9-]{1,30}$/\` (2–31 lowercase alphanumeric/hyphen chars starting with a letter).
- \`port\`: integer in \`1..65535\`.
- \`mode\`: \`'development' | 'staging' | 'production'\`.
- \`corsOrigins\`: \`string[]\` (may be empty) where every item starts with \`"https://"\` or \`"http://localhost"\`.
- \`rateLimit?\`: optional. If omitted or \`undefined\`, valid. If present (including \`null\`), it **must** be a plain object \`{ windowMs: number; maxRequests: number }\` where both fields are positive integers (\`> 0\`).

\`validateConfigDocument(val)\` returns \`{ valid: true, config: val }\` when valid, or \`{ valid: false }\` otherwise.`,
          tags: ['Schema Validation', 'Optional Sub-Schemas', 'Type Guards'],
          hints: [
            'Distinguish `val.rateLimit === undefined` (allowed) from `val.rateLimit === null` (invalid because `null` is not `{ windowMs, maxRequests }`).',
            'Validate `corsOrigins` with `Array.isArray(rec.corsOrigins)` and `.every(...)`.',
          ],
          entryFunction: 'validateConfigDocument',
          astRules: { requireTypePredicate: true, requireInterfaceOrType: true },
          starterCode: `export interface ServiceConfig {
  readonly serviceName: string;
  readonly port: number;
  readonly mode: 'development' | 'staging' | 'production';
  readonly corsOrigins: readonly string[];
  readonly rateLimit?: {
    readonly windowMs: number;
    readonly maxRequests: number;
  };
}

export type ConfigValidationResult =
  | { readonly valid: true; readonly config: ServiceConfig }
  | { readonly valid: false };

export function isServiceConfig(val: unknown): val is ServiceConfig {
  // TODO: Validate ServiceConfig including optional rateLimit
  return false;
}

export function validateConfigDocument(val: unknown): ConfigValidationResult {
  return isServiceConfig(val) ? { valid: true, config: val } : { valid: false };
}
`,
          referenceSolution: `export interface ServiceConfig {
  readonly serviceName: string;
  readonly port: number;
  readonly mode: 'development' | 'staging' | 'production';
  readonly corsOrigins: readonly string[];
  readonly rateLimit?: {
    readonly windowMs: number;
    readonly maxRequests: number;
  };
}

export type ConfigValidationResult =
  | { readonly valid: true; readonly config: ServiceConfig }
  | { readonly valid: false };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

const SERVICE_NAME_RE = /^[a-z][a-z0-9-]{1,30}$/;

export function isServiceConfig(val: unknown): val is ServiceConfig {
  if (!isRecord(val)) return false;

  if (typeof val.serviceName !== 'string' || !SERVICE_NAME_RE.test(val.serviceName)) {
    return false;
  }
  if (
    typeof val.port !== 'number' ||
    !Number.isInteger(val.port) ||
    val.port < 1 ||
    val.port > 65535
  ) {
    return false;
  }
  if (
    val.mode !== 'development' &&
    val.mode !== 'staging' &&
    val.mode !== 'production'
  ) {
    return false;
  }
  if (
    !Array.isArray(val.corsOrigins) ||
    !val.corsOrigins.every(
      (o) =>
        typeof o === 'string' &&
        (o.startsWith('https://') || o.startsWith('http://localhost'))
    )
  ) {
    return false;
  }

  if (val.rateLimit !== undefined) {
    if (!isRecord(val.rateLimit)) return false;
    if (
      typeof val.rateLimit.windowMs !== 'number' ||
      !Number.isInteger(val.rateLimit.windowMs) ||
      val.rateLimit.windowMs <= 0 ||
      typeof val.rateLimit.maxRequests !== 'number' ||
      !Number.isInteger(val.rateLimit.maxRequests) ||
      val.rateLimit.maxRequests <= 0
    ) {
      return false;
    }
  }

  return true;
}

export function validateConfigDocument(val: unknown): ConfigValidationResult {
  return isServiceConfig(val) ? { valid: true, config: val } : { valid: false };
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Accepts valid production config with rateLimit',
              args: [
                {
                  serviceName: 'auth-gateway-2',
                  port: 8443,
                  mode: 'production',
                  corsOrigins: ['https://app.acme.dev', 'http://localhost:5173'],
                  rateLimit: { windowMs: 60000, maxRequests: 120 },
                },
              ],
              expected: {
                valid: true,
                config: {
                  serviceName: 'auth-gateway-2',
                  port: 8443,
                  mode: 'production',
                  corsOrigins: ['https://app.acme.dev', 'http://localhost:5173'],
                  rateLimit: { windowMs: 60000, maxRequests: 120 },
                },
              },
            },
            {
              id: 'tc-2',
              name: 'Accepts valid config without optional rateLimit',
              args: [
                {
                  serviceName: 'billing',
                  port: 3000,
                  mode: 'development',
                  corsOrigins: [],
                },
              ],
              expected: {
                valid: true,
                config: {
                  serviceName: 'billing',
                  port: 3000,
                  mode: 'development',
                  corsOrigins: [],
                },
              },
            },
            {
              id: 'tc-3',
              name: 'Rejects insecure non-localhost http origin',
              args: [
                {
                  serviceName: 'billing',
                  port: 3000,
                  mode: 'staging',
                  corsOrigins: ['http://evil.example.com'],
                },
              ],
              expected: { valid: false },
            },
            {
              id: 'tc-4',
              name: 'Rejects rateLimit set to null',
              args: [
                {
                  serviceName: 'billing',
                  port: 3000,
                  mode: 'staging',
                  corsOrigins: [],
                  rateLimit: null,
                },
              ],
              expected: { valid: false },
            },
            {
              id: 'tc-5',
              name: 'Hidden: Rejects uppercase serviceName or out-of-range port 70000',
              hidden: true,
              args: [
                {
                  serviceName: 'BillingService',
                  port: 70000,
                  mode: 'production',
                  corsOrigins: [],
                },
              ],
              expected: { valid: false },
            },
            {
              id: 'tc-6',
              name: 'Hidden: Rejects 1-char serviceName or zero maxRequests',
              hidden: true,
              args: [
                {
                  serviceName: 'api',
                  port: 8080,
                  mode: 'staging',
                  corsOrigins: ['https://ok.dev'],
                  rateLimit: { windowMs: 1000, maxRequests: 0 },
                },
              ],
              expected: { valid: false },
            },
          ],
        },
      ],
    },
    {
      id: 's3-p5',
      number: 5,
      title: 'Keyof, Lookup Types & Mapped Object Transformations',
      subtitle: 'Key-safe pick/omit helpers, mapped modifiers, deep config overrides, and log streams',
      conceptSummary: `Combining \`keyof T\`, indexed access \`T[K]\`, and mapped types \`{ [K in keyof T]: ... }\` bridges runtime object manipulation with exact static types:

- **Key-constrained helpers:** \`function pickByKeys<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K>\` guarantees callers cannot pass misspelled property names and receives an exact narrowed return type.
- **Modifier toggling:** \`-readonly\` removes \`readonly\` from mapped properties, while \`as Exclude<K, ...>\` remaps or filters keys cleanly.
- **Recursive mapped types:** \`DeepPartialConfig<T>\` lets callers supply partial nested overrides while preserving leaf array types.`,
      challenges: [
        {
          id: 's3-p5-c1',
          title: 'Key-Safe pickByKeys & omitByKeys',
          style: 'leetcode',
          difficulty: 'easy',
          description: `Implement two key-safe object projection utilities without mutating the source object:

1. \`pickByKeys<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K>\`
   Copies only own properties listed in \`keys\` into a new object.
2. \`omitByKeys<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K>\`
   Copies all own enumerable properties of \`obj\` **except** those listed in \`keys\`.`,
          tags: ['keyof', 'Pick & Omit', 'Immutability'],
          hints: [
            'Use `Object.hasOwn(obj, key)` inside `pickByKeys` before copying `obj[key]`.',
            'In `omitByKeys`, place `keys` into a `Set<PropertyKey>` and iterate `Object.keys(obj)`.',
          ],
          entryFunction: 'pickByKeys',
          astRules: { requireGenerics: true },
          starterCode: `export function pickByKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  // TODO: Return a new object containing only the specified keys
  return {} as Pick<T, K>;
}

export function omitByKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> {
  // TODO: Return a new object excluding the specified keys
  return {} as Omit<T, K>;
}
`,
          referenceSolution: `export function pickByKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const key of keys) {
    if (Object.hasOwn(obj, key)) {
      out[key] = obj[key];
    }
  }
  return out;
}

export function omitByKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> {
  const excluded = new Set<PropertyKey>(keys);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (!excluded.has(k)) {
      out[k] = v;
    }
  }
  return out as Omit<T, K>;
}
`,
          typeAssertionPrelude: `import { pickByKeys, omitByKeys } from './solution';

interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  age: number;
}
declare const sampleUser: UserRecord;
const picked = pickByKeys(sampleUser, ['id', 'email']);
const omitted = omitByKeys(sampleUser, ['passwordHash']);`,
          typeAssertions: [
            {
              id: 'ta-1',
              name: 'pickByKeys narrows return type to Pick<UserRecord, K>',
              assertion: `Expect<Equal<typeof picked, Pick<UserRecord, 'id' | 'email'>>>`,
            },
            {
              id: 'ta-2',
              name: 'omitByKeys narrows return type to Omit<UserRecord, K>',
              assertion: `Expect<Equal<typeof omitted, Omit<UserRecord, 'passwordHash'>>>`,
            },
          ],
          testCases: [
            {
              id: 'tc-1',
              name: 'pickByKeys extracts selected fields immutably',
              fnName: 'pickByKeys',
              checkImmutability: true,
              args: [
                { id: 'u1', email: 'a@b.dev', passwordHash: 'secret', age: 30 },
                ['id', 'email'],
              ],
              expected: { id: 'u1', email: 'a@b.dev' },
            },
            {
              id: 'tc-2',
              name: 'omitByKeys strips sensitive fields immutably',
              fnName: 'omitByKeys',
              checkImmutability: true,
              args: [
                { id: 'u1', email: 'a@b.dev', passwordHash: 'secret', age: 30 },
                ['passwordHash', 'age'],
              ],
              expected: { id: 'u1', email: 'a@b.dev' },
            },
            {
              id: 'tc-3',
              name: 'pickByKeys with empty keys returns empty object',
              fnName: 'pickByKeys',
              checkImmutability: true,
              args: [{ id: 'u1', count: 0 }, []],
              expected: {},
            },
            {
              id: 'tc-4',
              name: 'Hidden: omitByKeys preserves falsy values like 0, false, and ""',
              hidden: true,
              fnName: 'omitByKeys',
              checkImmutability: true,
              args: [{ a: 0, b: false, c: '', drop: true }, ['drop']],
              expected: { a: 0, b: false, c: '' },
            },
            {
              id: 'tc-5',
              name: 'Hidden: pickByKeys handles duplicate keys idempotently',
              hidden: true,
              fnName: 'pickByKeys',
              checkImmutability: true,
              args: [{ x: 10, y: 20, z: 30 }, ['y', 'y', 'x']],
              expected: { y: 20, x: 10 },
            },
          ],
        },
        {
          id: 's3-p5-c2',
          title: 'Mapped Key Remapping (MyPick, MyOmit & MutableProps)',
          style: 'type-challenge',
          difficulty: 'medium',
          description: `Implement three core mapped-type utilities from first principles (do **not** use built-in \`Pick\` or \`Omit\`):

1. \`MyPick<T, K extends keyof T>\`: Keeps only properties \`K\` from \`T\`.
2. \`MyOmit<T, K extends keyof T>\`: Keeps all properties from \`T\` except \`K\`, preserving \`readonly\` and \`?\` modifiers.
3. \`MutableProps<T>\`: Strips the \`readonly\` modifier from every property of \`T\` while preserving optionality.`,
          tags: ['Mapped Types', 'Key Remapping', 'Modifier Removal'],
          hints: [
            '`MyPick<T, K extends keyof T> = { [P in K]: T[P] }` preserves modifiers because `K` is constrained to `keyof T`!',
            'For `MyOmit`, remap keys using `{ [P in keyof T as P extends K ? never : P]: T[P] }`.',
            'Use `-readonly` in `{ -readonly [P in keyof T]: T[P] }` for `MutableProps<T>`.',
          ],
          starterCode: `export type MyPick<T, K extends keyof T> = T;

export type MyOmit<T, K extends keyof T> = T;

export type MutableProps<T> = T;
`,
          referenceSolution: `export type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

export type MutableProps<T> = {
  -readonly [P in keyof T]: T[P];
};
`,
          typeAssertionPrelude: `import type { MyPick, MyOmit, MutableProps } from './solution';

interface Todo {
  readonly id: string;
  title: string;
  description?: string;
  completed: boolean;
}`,
          typeAssertions: [
            {
              id: 'ta-1',
              name: 'MyPick selects subset and preserves modifiers',
              assertion: `Expect<Equal<MyPick<Todo, 'id' | 'description'>, { readonly id: string; description?: string }>>`,
            },
            {
              id: 'ta-2',
              name: 'MyOmit removes specified keys and preserves modifiers',
              assertion: `Expect<Equal<MyOmit<Todo, 'completed' | 'title'>, { readonly id: string; description?: string }>>`,
            },
            {
              id: 'ta-3',
              name: 'MutableProps removes readonly while preserving optional ?',
              assertion: `Expect<Equal<MutableProps<Todo>, { id: string; title: string; description?: string; completed: boolean }>>`,
            },
            {
              id: 'ta-4',
              name: 'MyOmit with never keeps entire type intact',
              assertion: `Expect<Equal<MyOmit<{ a: number; b: string }, never>, { a: number; b: string }>>`,
            },
            {
              id: 'ta-5',
              name: 'Hidden: MutableProps on all-readonly tuple/object',
              hidden: true,
              assertion: `Expect<Equal<MutableProps<{ readonly x: 1; readonly y?: 2 }>, { x: 1; y?: 2 }>>`,
            },
            {
              id: 'ta-6',
              name: 'Hidden: MyPick single key',
              hidden: true,
              assertion: `Expect<Equal<MyPick<Todo, 'completed'>, { completed: boolean }>>`,
            },
          ],
          testCases: [],
        },
        {
          id: 's3-p5-c3',
          title: 'Typed Deep Config Merger',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Define a recursive mapped type \`DeepPartialConfig<T>\` and implement \`mergeServiceDefaults(defaults, overrides)\` so nested plain-object overrides merge cleanly into \`defaults\` **without mutating** either input.

### Merge Semantics
- Plain objects (\`typeof v === 'object' && v !== null && !Array.isArray(v)\`) are merged recursively key-by-key.
- Arrays are **replaced wholesale** (copied as a fresh array) when overridden, never concatenated or merged by index.
- Explicit \`undefined\` values in \`overrides\` are ignored (the value from \`defaults\` is kept).
- Even untouched nested objects/arrays in \`defaults\` should be cloned so the returned config shares no mutable references with \`defaults\`.`,
          tags: ['Recursive Mapped Types', 'Deep Merge', 'Immutability'],
          hints: [
            'In `DeepPartialConfig<T>`, check `T[K] extends readonly (infer U)[] ? readonly U[] : T[K] extends object ? DeepPartialConfig<T[K]> : T[K]`.',
            'Write a helper `cloneValue(val)` so untouched subtrees in `defaults` are also cloned cleanly.',
          ],
          entryFunction: 'mergeServiceDefaults',
          astRules: { requireGenerics: true, requireInterfaceOrType: true },
          starterCode: `export type DeepPartialConfig<T> = {
  [K in keyof T]?: T[K] extends readonly (infer U)[]
    ? readonly U[]
    : T[K] extends object
      ? DeepPartialConfig<T[K]>
      : T[K];
};

export function mergeServiceDefaults<T extends Record<string, unknown>>(
  defaults: T,
  overrides: DeepPartialConfig<T>
): T {
  // TODO: Recursively merge plain objects and replace arrays/primitives immutably
  return defaults;
}
`,
          referenceSolution: `export type DeepPartialConfig<T> = {
  [K in keyof T]?: T[K] extends readonly (infer U)[]
    ? readonly U[]
    : T[K] extends object
      ? DeepPartialConfig<T[K]>
      : T[K];
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function deepClone(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(deepClone);
  if (isPlainObject(v)) {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v)) {
      out[k] = deepClone(val);
    }
    return out;
  }
  return v;
}

function mergeRecords(
  base: Record<string, unknown>,
  patch: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const keys = new Set([...Object.keys(base), ...Object.keys(patch)]);

  for (const key of keys) {
    const baseVal = base[key];
    const patchVal = patch[key];

    if (patchVal === undefined) {
      result[key] = deepClone(baseVal);
    } else if (isPlainObject(baseVal) && isPlainObject(patchVal)) {
      result[key] = mergeRecords(baseVal, patchVal);
    } else {
      result[key] = deepClone(patchVal);
    }
  }

  return result;
}

export function mergeServiceDefaults<T extends Record<string, unknown>>(
  defaults: T,
  overrides: DeepPartialConfig<T>
): T {
  return mergeRecords(defaults, overrides as Record<string, unknown>) as T;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Recursively merges nested objects while replacing arrays',
              checkImmutability: true,
              args: [
                {
                  host: '0.0.0.0',
                  db: { poolSize: 10, ssl: true, hosts: ['db1.internal', 'db2.internal'] },
                  features: { audit: true, cacheTtlSec: 60 },
                },
                {
                  db: { poolSize: 25, hosts: ['db-prod.internal'] },
                  features: { cacheTtlSec: 300 },
                },
              ],
              expected: {
                host: '0.0.0.0',
                db: { poolSize: 25, ssl: true, hosts: ['db-prod.internal'] },
                features: { audit: true, cacheTtlSec: 300 },
              },
            },
            {
              id: 'tc-2',
              name: 'Explicit undefined in overrides preserves default value',
              checkImmutability: true,
              args: [
                { retries: 3, log: { level: 'info', json: true } },
                { retries: undefined, log: { level: undefined, json: false } },
              ],
              expected: { retries: 3, log: { level: 'info', json: false } },
            },
            {
              id: 'tc-3',
              name: 'Allows overriding boolean true to false and number to 0',
              checkImmutability: true,
              args: [
                { enabled: true, timeoutMs: 5000 },
                { enabled: false, timeoutMs: 0 },
              ],
              expected: { enabled: false, timeoutMs: 0 },
            },
            {
              id: 'tc-4',
              name: 'Hidden: Deeply nested 3-level partial override',
              hidden: true,
              checkImmutability: true,
              args: [
                { telemetry: { otel: { enabled: false, sampleRate: 0.1 } } },
                { telemetry: { otel: { enabled: true } } },
              ],
              expected: { telemetry: { otel: { enabled: true, sampleRate: 0.1 } } },
            },
            {
              id: 'tc-5',
              name: 'Hidden: Overriding array with empty array clears default items',
              hidden: true,
              checkImmutability: true,
              args: [
                { allowlist: ['10.0.0.1', '10.0.0.2'], port: 8080 },
                { allowlist: [] },
              ],
              expected: { allowlist: [], port: 8080 },
            },
          ],
        },
        {
          id: 's3-p5-c4',
          title: 'JSON-Lines Audit Stream',
          style: 'beecrowd',
          difficulty: 'medium',
          description: `Process a newline-delimited JSON audit stream from standard input using a user-defined type guard over \`unknown\` values.

### Valid Event Shapes
Each non-empty input line is parsed as JSON and validated against:
- \`{ type: 'LOGIN'; user: string; ok: boolean }\` (\`user.trim().length > 0\`, \`typeof ok === 'boolean'\`)
- \`{ type: 'PURCHASE'; user: string; cents: number }\` (\`user.trim().length > 0\`, \`cents\` integer \`> 0\`)
- \`{ type: 'LOGOUT'; user: string }\` (\`user.trim().length > 0\`)

Empty/whitespace-only lines are ignored. Any non-empty line that is invalid JSON or fails the guard increments \`MALFORMED\`.

### Output Format (4 lines)
\`\`\`
VALID: <validCount>
MALFORMED: <malformedCount>
SPEND_TOP: <user> (<totalCents>)
FAILED_LOGINS: <failedLoginCount>
\`\`\`
- \`SPEND_TOP\`: user with highest cumulative \`PURCHASE\` cents (tie-breaker: ASCII-smallest \`user\`), or \`NONE\` if no valid purchases occurred.
- \`FAILED_LOGINS\`: count of valid \`LOGIN\` events where \`ok === false\`.`,
          tags: ['JSON Lines', 'Type Predicates', 'Discriminated Unions'],
          hints: [
            'Wrap `JSON.parse(line)` in `try/catch` and pass the `unknown` result into `isAuditRecord(val): val is AuditRecord`.',
            'When comparing `SPEND_TOP`, update winner if `cents > bestCents || (cents === bestCents && user < bestUser)`.',
          ],
          entryFunction: 'solve',
          playgroundInput: `{"type":"LOGIN","user":"ada","ok":true}
{"type":"PURCHASE","user":"bob","cents":1500}
not-valid-json
{"type":"LOGIN","user":"bob","ok":false}
{"type":"PURCHASE","user":"ada","cents":1500}
{"type":"PURCHASE","user":"bob","cents":0}`,
          astRules: { requireTypePredicate: true, requireTypeNarrowing: true },
          starterCode: `type AuditRecord =
  | { readonly type: 'LOGIN'; readonly user: string; readonly ok: boolean }
  | { readonly type: 'PURCHASE'; readonly user: string; readonly cents: number }
  | { readonly type: 'LOGOUT'; readonly user: string };

function isAuditRecord(val: unknown): val is AuditRecord {
  // TODO: Validate unknown JSON value
  return false;
}

export function solve(input: string): string {
  // TODO: Process JSON-lines stream and format 4-line audit report
  return '';
}
`,
          referenceSolution: `type AuditRecord =
  | { readonly type: 'LOGIN'; readonly user: string; readonly ok: boolean }
  | { readonly type: 'PURCHASE'; readonly user: string; readonly cents: number }
  | { readonly type: 'LOGOUT'; readonly user: string };

function isAuditRecord(val: unknown): val is AuditRecord {
  if (typeof val !== 'object' || val === null || Array.isArray(val)) {
    return false;
  }
  const rec = val as Record<string, unknown>;
  if (typeof rec.user !== 'string' || rec.user.trim().length === 0) {
    return false;
  }

  switch (rec.type) {
    case 'LOGIN':
      return typeof rec.ok === 'boolean';
    case 'PURCHASE':
      return typeof rec.cents === 'number' && Number.isInteger(rec.cents) && rec.cents > 0;
    case 'LOGOUT':
      return true;
    default:
      return false;
  }
}

export function solve(input: string): string {
  const lines = input
    .split(/\\r?\\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  let valid = 0;
  let malformed = 0;
  let failedLogins = 0;
  const spendByUser = new Map<string, number>();

  for (const line of lines) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      malformed++;
      continue;
    }

    if (!isAuditRecord(parsed)) {
      malformed++;
      continue;
    }

    valid++;
    switch (parsed.type) {
      case 'LOGIN':
        if (!parsed.ok) failedLogins++;
        break;
      case 'PURCHASE':
        spendByUser.set(parsed.user, (spendByUser.get(parsed.user) ?? 0) + parsed.cents);
        break;
      case 'LOGOUT':
        break;
    }
  }

  let topUser: string | null = null;
  let topCents = 0;
  for (const [user, cents] of spendByUser.entries()) {
    if (topUser === null || cents > topCents || (cents === topCents && user < topUser)) {
      topUser = user;
      topCents = cents;
    }
  }

  const spendLine = topUser === null ? 'NONE' : \`\${topUser} (\${topCents})\`;
  return [
    \`VALID: \${valid}\`,
    \`MALFORMED: \${malformed}\`,
    \`SPEND_TOP: \${spendLine}\`,
    \`FAILED_LOGINS: \${failedLogins}\`,
  ].join('\\n');
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Tie-breaks SPEND_TOP alphabetically and counts malformed records',
              args: [
                `{"type":"LOGIN","user":"ada","ok":true}
{"type":"PURCHASE","user":"bob","cents":1500}
not-valid-json
{"type":"LOGIN","user":"bob","ok":false}
{"type":"PURCHASE","user":"ada","cents":1500}
{"type":"PURCHASE","user":"bob","cents":0}`,
              ],
              expected: `VALID: 4\nMALFORMED: 2\nSPEND_TOP: ada (1500)\nFAILED_LOGINS: 1`,
            },
            {
              id: 'tc-2',
              name: 'No purchases produces SPEND_TOP: NONE',
              args: [
                `{"type":"LOGIN","user":"eve","ok":false}
{"type":"LOGIN","user":"eve","ok":false}
{"type":"LOGOUT","user":"eve"}`,
              ],
              expected: `VALID: 3\nMALFORMED: 0\nSPEND_TOP: NONE\nFAILED_LOGINS: 2`,
            },
            {
              id: 'tc-3',
              name: 'Empty input stream reports all zeros and NONE',
              args: [`   \n  `],
              expected: `VALID: 0\nMALFORMED: 0\nSPEND_TOP: NONE\nFAILED_LOGINS: 0`,
            },
            {
              id: 'tc-4',
              name: 'Hidden: Accumulates multiple purchases for the same user',
              hidden: true,
              args: [
                `{"type":"PURCHASE","user":"zoe","cents":400}
{"type":"PURCHASE","user":"ada","cents":900}
{"type":"PURCHASE","user":"zoe","cents":700}`,
              ],
              expected: `VALID: 3\nMALFORMED: 0\nSPEND_TOP: zoe (1100)\nFAILED_LOGINS: 0`,
            },
            {
              id: 'tc-5',
              name: 'Hidden: Rejects array JSON lines and fractional purchase cents',
              hidden: true,
              args: [
                `[1,2,3]
{"type":"PURCHASE","user":"ada","cents":99.5}
{"type":"LOGIN","user":"   ","ok":false}`,
              ],
              expected: `VALID: 0\nMALFORMED: 3\nSPEND_TOP: NONE\nFAILED_LOGINS: 0`,
            },
          ],
        },
      ],
    },
  ],
  miniProject: {
    id: 's3-mp',
    title: 'Task Workflow State Machine',
    subtitle: '4-file Kanban workflow engine with role guards, runtime validation, and exhaustive transitions',
    difficulty: 'hard',
    description: `Build a multi-module **Task Workflow State Machine** modeling an engineering issue lifecycle (\`backlog\` -> \`in_progress\` -> \`in_review\` / \`blocked\` -> \`released\`).

### Workflow Rules
Every task starts in \`{ taskId, status: 'backlog', assignee: null }\`. Each item in \`rawEvents\` is first validated with \`isWorkflowEvent\` (invalid items increment \`malformedCount\`). Valid \`WorkflowEvent\` items are processed by \`applyTransition(state, event)\` (disallowed transitions leave \`state\` unchanged and increment \`rejectedCount\`):

1. **\`START\`** (\`{ type: 'START', actor, role, assignee }\`):
   - Allowed only when \`state.status === 'backlog'\`, \`assignee.trim().length > 0\`, and (\`role === 'lead' || role === 'admin' || actor === assignee\`).
   - Next state: \`{ taskId, status: 'in_progress', assignee: assignee.trim() }\`.
2. **\`SUBMIT_REVIEW\`** (\`{ type: 'SUBMIT_REVIEW', actor, role, reviewer }\`):
   - Allowed only when \`state.status === 'in_progress'\`, \`reviewer.trim().length > 0\`, \`(actor === state.assignee || role === 'lead' || role === 'admin')\`, and \`reviewer.trim() !== state.assignee\` (no self-review!).
   - Next state: \`{ taskId, status: 'in_review', assignee: state.assignee, reviewer: reviewer.trim() }\`.
3. **\`REQUEST_CHANGES\`** (\`{ type: 'REQUEST_CHANGES', actor, role }\`):
   - Allowed only when \`state.status === 'in_review'\` and \`(actor === state.reviewer || role === 'lead' || role === 'admin')\`.
   - Next state: \`{ taskId, status: 'in_progress', assignee: state.assignee }\`.
4. **\`BLOCK\`** (\`{ type: 'BLOCK', actor, role, reason }\`):
   - Allowed only when \`state.status === 'in_progress' || state.status === 'in_review'\`, and \`reason.trim().length > 0\`.
   - Next state: \`{ taskId, status: 'blocked', previousStatus: state.status, assignee: state.assignee, reviewer: state.status === 'in_review' ? state.reviewer : null, blockerReason: reason.trim() }\`.
5. **\`UNBLOCK\`** (\`{ type: 'UNBLOCK', actor, role }\`):
   - Allowed only when \`state.status === 'blocked'\` and \`(role === 'lead' || role === 'admin' || actor === state.assignee)\`.
   - Restores \`in_progress\` or \`in_review\` (using \`state.previousStatus\` and \`state.reviewer\`).
6. **\`RELEASE\`** (\`{ type: 'RELEASE', actor, role, versionTag }\`):
   - Allowed only when \`state.status === 'in_review'\`, \`versionTag.trim().length > 0\`, \`actor !== state.assignee\`, and \`(role === 'lead' || role === 'admin' || (role === 'reviewer' && actor === state.reviewer))\`.
   - Next state: \`{ taskId, status: 'released', assignee: state.assignee, approvedBy: actor, versionTag: versionTag.trim() }\`. Once \`released\`, all subsequent events are rejected!

Accepted transitions append \`{ eventType: event.type, actor: event.actor, from: prevStatus, to: nextState.status }\` to \`history\`.`,
    architectureNotes: `- **\`types.ts\`**: Pure domain types (\`Role\`, \`TaskStatus\`, \`TaskState\`, \`WorkflowEvent\`, \`TransitionRecord\`, \`WorkflowReport\`).
- **\`guards.ts\`**: Runtime type predicate \`isWorkflowEvent(raw: unknown): raw is WorkflowEvent\` plus role/permission helper predicates.
- **\`transitions.ts\`**: Pure exhaustive state transition function \`applyTransition(state, event)\` with \`assertNever\`.
- **\`machine.ts\`**: Entry module exporting \`runWorkflow(taskId, rawEvents)\` coordinating validation, transitions, and audit log generation.`,
    tags: ['State Machine', 'Discriminated Unions', 'Type Predicates', 'Audit Log'],
    hints: [
      'In `guards.ts`, verify `actor` is a non-empty string (`actor.trim().length > 0`) and `role` is one of `"author" | "reviewer" | "lead" | "admin"` for every `WorkflowEvent`.',
      'In `transitions.ts`, reject all events immediately if `state.status === "released"`, then `switch (event.type)` with an exhaustive `assertNever(event)` default.',
      'In `UNBLOCK`, narrow on `state.previousStatus === "in_review"` and check `state.reviewer !== null` to reconstruct `in_review` cleanly without `!` assertions.',
    ],
    entryFile: 'machine.ts',
    entryFunction: 'runWorkflow',
    playgroundInput: `["TASK-42", [{"type":"START","actor":"ada","role":"author","assignee":"ada"},{"type":"SUBMIT_REVIEW","actor":"ada","role":"author","reviewer":"linus"},{"type":"RELEASE","actor":"linus","role":"reviewer","versionTag":"v1.2.0"}]]`,
    astRules: {
      requireTypeNarrowing: true,
      requireTypePredicate: true,
      requireInterfaceOrType: true,
    },
    files: [
      {
        path: 'types.ts',
        description: 'Discriminated union contracts for workflow states, events, and audit history',
        readOnly: true,
        starterCode: `export type Role = 'author' | 'reviewer' | 'lead' | 'admin';

export type TaskStatus = 'backlog' | 'in_progress' | 'in_review' | 'blocked' | 'released';

export type TaskState =
  | { readonly taskId: string; readonly status: 'backlog'; readonly assignee: null }
  | { readonly taskId: string; readonly status: 'in_progress'; readonly assignee: string }
  | {
      readonly taskId: string;
      readonly status: 'in_review';
      readonly assignee: string;
      readonly reviewer: string;
    }
  | {
      readonly taskId: string;
      readonly status: 'blocked';
      readonly previousStatus: 'in_progress' | 'in_review';
      readonly assignee: string;
      readonly reviewer: string | null;
      readonly blockerReason: string;
    }
  | {
      readonly taskId: string;
      readonly status: 'released';
      readonly assignee: string;
      readonly approvedBy: string;
      readonly versionTag: string;
    };

export type WorkflowEvent =
  | { readonly type: 'START'; readonly actor: string; readonly role: Role; readonly assignee: string }
  | {
      readonly type: 'SUBMIT_REVIEW';
      readonly actor: string;
      readonly role: Role;
      readonly reviewer: string;
    }
  | { readonly type: 'REQUEST_CHANGES'; readonly actor: string; readonly role: Role }
  | { readonly type: 'BLOCK'; readonly actor: string; readonly role: Role; readonly reason: string }
  | { readonly type: 'UNBLOCK'; readonly actor: string; readonly role: Role }
  | {
      readonly type: 'RELEASE';
      readonly actor: string;
      readonly role: Role;
      readonly versionTag: string;
    };

export interface TransitionRecord {
  readonly eventType: WorkflowEvent['type'];
  readonly actor: string;
  readonly from: TaskStatus;
  readonly to: TaskStatus;
}

export interface WorkflowReport {
  readonly finalState: TaskState;
  readonly history: TransitionRecord[];
  readonly rejectedCount: number;
  readonly malformedCount: number;
}
`,
        referenceSolution: `export type Role = 'author' | 'reviewer' | 'lead' | 'admin';

export type TaskStatus = 'backlog' | 'in_progress' | 'in_review' | 'blocked' | 'released';

export type TaskState =
  | { readonly taskId: string; readonly status: 'backlog'; readonly assignee: null }
  | { readonly taskId: string; readonly status: 'in_progress'; readonly assignee: string }
  | {
      readonly taskId: string;
      readonly status: 'in_review';
      readonly assignee: string;
      readonly reviewer: string;
    }
  | {
      readonly taskId: string;
      readonly status: 'blocked';
      readonly previousStatus: 'in_progress' | 'in_review';
      readonly assignee: string;
      readonly reviewer: string | null;
      readonly blockerReason: string;
    }
  | {
      readonly taskId: string;
      readonly status: 'released';
      readonly assignee: string;
      readonly approvedBy: string;
      readonly versionTag: string;
    };

export type WorkflowEvent =
  | { readonly type: 'START'; readonly actor: string; readonly role: Role; readonly assignee: string }
  | {
      readonly type: 'SUBMIT_REVIEW';
      readonly actor: string;
      readonly role: Role;
      readonly reviewer: string;
    }
  | { readonly type: 'REQUEST_CHANGES'; readonly actor: string; readonly role: Role }
  | { readonly type: 'BLOCK'; readonly actor: string; readonly role: Role; readonly reason: string }
  | { readonly type: 'UNBLOCK'; readonly actor: string; readonly role: Role }
  | {
      readonly type: 'RELEASE';
      readonly actor: string;
      readonly role: Role;
      readonly versionTag: string;
    };

export interface TransitionRecord {
  readonly eventType: WorkflowEvent['type'];
  readonly actor: string;
  readonly from: TaskStatus;
  readonly to: TaskStatus;
}

export interface WorkflowReport {
  readonly finalState: TaskState;
  readonly history: TransitionRecord[];
  readonly rejectedCount: number;
  readonly malformedCount: number;
}
`,
      },
      {
        path: 'guards.ts',
        description: 'Runtime payload type guards and role authorization helpers',
        starterCode: `import type { Role, WorkflowEvent } from './types';

export function isRole(val: unknown): val is Role {
  return val === 'author' || val === 'reviewer' || val === 'lead' || val === 'admin';
}

export function isPrivilegedRole(role: Role): boolean {
  return role === 'lead' || role === 'admin';
}

export function isWorkflowEvent(raw: unknown): raw is WorkflowEvent {
  // TODO: Validate unknown object against all 6 WorkflowEvent shapes
  // Note: actor must be a non-empty trimmed string, role must satisfy isRole,
  // and string payload fields (assignee, reviewer, reason, versionTag) must be typeof 'string'.
  return false;
}
`,
        referenceSolution: `import type { Role, WorkflowEvent } from './types';

export function isRole(val: unknown): val is Role {
  return val === 'author' || val === 'reviewer' || val === 'lead' || val === 'admin';
}

export function isPrivilegedRole(role: Role): boolean {
  return role === 'lead' || role === 'admin';
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function isWorkflowEvent(raw: unknown): raw is WorkflowEvent {
  if (!isPlainObject(raw)) return false;
  if (typeof raw.actor !== 'string' || raw.actor.trim().length === 0) return false;
  if (!isRole(raw.role)) return false;

  switch (raw.type) {
    case 'START':
      return typeof raw.assignee === 'string';
    case 'SUBMIT_REVIEW':
      return typeof raw.reviewer === 'string';
    case 'REQUEST_CHANGES':
      return true;
    case 'BLOCK':
      return typeof raw.reason === 'string';
    case 'UNBLOCK':
      return true;
    case 'RELEASE':
      return typeof raw.versionTag === 'string';
    default:
      return false;
  }
}
`,
      },
      {
        path: 'transitions.ts',
        description: 'Pure exhaustive state transition reducer',
        starterCode: `import type { TaskState, WorkflowEvent } from './types';
import { isPrivilegedRole } from './guards';

export interface TransitionOutcome {
  readonly accepted: boolean;
  readonly nextState: TaskState;
}

export function applyTransition(
  state: TaskState,
  event: WorkflowEvent
): TransitionOutcome {
  // TODO: Implement exhaustive transition rules for all 6 event types
  void isPrivilegedRole;
  return { accepted: false, nextState: state };
}
`,
        referenceSolution: `import type { TaskState, WorkflowEvent } from './types';
import { isPrivilegedRole } from './guards';

export interface TransitionOutcome {
  readonly accepted: boolean;
  readonly nextState: TaskState;
}

function assertNever(x: never): never {
  throw new Error(\`Unhandled workflow event: \${JSON.stringify(x)}\`);
}

export function applyTransition(
  state: TaskState,
  event: WorkflowEvent
): TransitionOutcome {
  const reject = (): TransitionOutcome => ({ accepted: false, nextState: state });

  if (state.status === 'released') {
    return reject();
  }

  switch (event.type) {
    case 'START': {
      const assignee = event.assignee.trim();
      if (state.status !== 'backlog' || assignee.length === 0) return reject();
      if (!isPrivilegedRole(event.role) && event.actor !== assignee) return reject();
      return {
        accepted: true,
        nextState: { taskId: state.taskId, status: 'in_progress', assignee },
      };
    }

    case 'SUBMIT_REVIEW': {
      const reviewer = event.reviewer.trim();
      if (state.status !== 'in_progress' || reviewer.length === 0) return reject();
      if (!isPrivilegedRole(event.role) && event.actor !== state.assignee) return reject();
      if (reviewer === state.assignee) return reject();
      return {
        accepted: true,
        nextState: {
          taskId: state.taskId,
          status: 'in_review',
          assignee: state.assignee,
          reviewer,
        },
      };
    }

    case 'REQUEST_CHANGES': {
      if (state.status !== 'in_review') return reject();
      if (!isPrivilegedRole(event.role) && event.actor !== state.reviewer) return reject();
      return {
        accepted: true,
        nextState: {
          taskId: state.taskId,
          status: 'in_progress',
          assignee: state.assignee,
        },
      };
    }

    case 'BLOCK': {
      const blockerReason = event.reason.trim();
      if (blockerReason.length === 0) return reject();
      if (state.status !== 'in_progress' && state.status !== 'in_review') return reject();
      return {
        accepted: true,
        nextState: {
          taskId: state.taskId,
          status: 'blocked',
          previousStatus: state.status,
          assignee: state.assignee,
          reviewer: state.status === 'in_review' ? state.reviewer : null,
          blockerReason,
        },
      };
    }

    case 'UNBLOCK': {
      if (state.status !== 'blocked') return reject();
      if (!isPrivilegedRole(event.role) && event.actor !== state.assignee) return reject();
      if (state.previousStatus === 'in_review' && state.reviewer !== null) {
        return {
          accepted: true,
          nextState: {
            taskId: state.taskId,
            status: 'in_review',
            assignee: state.assignee,
            reviewer: state.reviewer,
          },
        };
      }
      return {
        accepted: true,
        nextState: {
          taskId: state.taskId,
          status: 'in_progress',
          assignee: state.assignee,
        },
      };
    }

    case 'RELEASE': {
      const versionTag = event.versionTag.trim();
      if (state.status !== 'in_review' || versionTag.length === 0) return reject();
      if (event.actor === state.assignee) return reject();
      const canApprove =
        isPrivilegedRole(event.role) ||
        (event.role === 'reviewer' && event.actor === state.reviewer);
      if (!canApprove) return reject();
      return {
        accepted: true,
        nextState: {
          taskId: state.taskId,
          status: 'released',
          assignee: state.assignee,
          approvedBy: event.actor,
          versionTag,
        },
      };
    }

    default:
      return assertNever(event);
  }
}
`,
      },
      {
        path: 'machine.ts',
        description: 'Workflow runner assembling runtime validation, state transitions, and history',
        starterCode: `import type { TaskState, TransitionRecord, WorkflowReport } from './types';
import { isWorkflowEvent } from './guards';
import { applyTransition } from './transitions';

export function runWorkflow(
  taskId: string,
  rawEvents: readonly unknown[]
): WorkflowReport {
  const initial: TaskState = { taskId, status: 'backlog', assignee: null };
  const history: TransitionRecord[] = [];
  void isWorkflowEvent;
  void applyTransition;

  // TODO: Validate each raw event, apply transitions, and record audit history
  return {
    finalState: initial,
    history,
    rejectedCount: 0,
    malformedCount: 0,
  };
}
`,
        referenceSolution: `import type { TaskState, TransitionRecord, WorkflowReport } from './types';
import { isWorkflowEvent } from './guards';
import { applyTransition } from './transitions';

export function runWorkflow(
  taskId: string,
  rawEvents: readonly unknown[]
): WorkflowReport {
  let state: TaskState = { taskId, status: 'backlog', assignee: null };
  const history: TransitionRecord[] = [];
  let rejectedCount = 0;
  let malformedCount = 0;

  for (const raw of rawEvents) {
    if (!isWorkflowEvent(raw)) {
      malformedCount++;
      continue;
    }

    const outcome = applyTransition(state, raw);
    if (outcome.accepted) {
      history.push({
        eventType: raw.type,
        actor: raw.actor,
        from: state.status,
        to: outcome.nextState.status,
      });
      state = outcome.nextState;
    } else {
      rejectedCount++;
    }
  }

  return {
    finalState: state,
    history,
    rejectedCount,
    malformedCount,
  };
}
`,
      },
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'Happy path from backlog to released',
        args: [
          'TASK-42',
          [
            { type: 'START', actor: 'ada', role: 'author', assignee: 'ada' },
            { type: 'SUBMIT_REVIEW', actor: 'ada', role: 'author', reviewer: 'linus' },
            { type: 'RELEASE', actor: 'linus', role: 'reviewer', versionTag: 'v1.2.0' },
          ],
        ],
        expected: {
          finalState: {
            taskId: 'TASK-42',
            status: 'released',
            assignee: 'ada',
            approvedBy: 'linus',
            versionTag: 'v1.2.0',
          },
          history: [
            { eventType: 'START', actor: 'ada', from: 'backlog', to: 'in_progress' },
            { eventType: 'SUBMIT_REVIEW', actor: 'ada', from: 'in_progress', to: 'in_review' },
            { eventType: 'RELEASE', actor: 'linus', from: 'in_review', to: 'released' },
          ],
          rejectedCount: 0,
          malformedCount: 0,
        },
      },
      {
        id: 'tc-2',
        name: 'Rejects self-review and unauthorized third-party START',
        args: [
          'TASK-77',
          [
            { type: 'START', actor: 'bob', role: 'author', assignee: 'ada' },
            { type: 'START', actor: 'lead-1', role: 'lead', assignee: 'ada' },
            { type: 'SUBMIT_REVIEW', actor: 'ada', role: 'author', reviewer: 'ada' },
          ],
        ],
        expected: {
          finalState: { taskId: 'TASK-77', status: 'in_progress', assignee: 'ada' },
          history: [
            { eventType: 'START', actor: 'lead-1', from: 'backlog', to: 'in_progress' },
          ],
          rejectedCount: 2,
          malformedCount: 0,
        },
      },
      {
        id: 'tc-3',
        name: 'Block during in_review restores in_review and reviewer on UNBLOCK',
        args: [
          'TASK-88',
          [
            { type: 'START', actor: 'ada', role: 'author', assignee: 'ada' },
            { type: 'SUBMIT_REVIEW', actor: 'ada', role: 'author', reviewer: 'grace' },
            { type: 'BLOCK', actor: 'grace', role: 'reviewer', reason: ' Waiting on migration ' },
            { type: 'UNBLOCK', actor: 'random', role: 'reviewer' },
            { type: 'UNBLOCK', actor: 'ada', role: 'author' },
            { type: 'REQUEST_CHANGES', actor: 'grace', role: 'reviewer' },
          ],
        ],
        expected: {
          finalState: { taskId: 'TASK-88', status: 'in_progress', assignee: 'ada' },
          history: [
            { eventType: 'START', actor: 'ada', from: 'backlog', to: 'in_progress' },
            { eventType: 'SUBMIT_REVIEW', actor: 'ada', from: 'in_progress', to: 'in_review' },
            { eventType: 'BLOCK', actor: 'grace', from: 'in_review', to: 'blocked' },
            { eventType: 'UNBLOCK', actor: 'ada', from: 'blocked', to: 'in_review' },
            { eventType: 'REQUEST_CHANGES', actor: 'grace', from: 'in_review', to: 'in_progress' },
          ],
          rejectedCount: 1,
          malformedCount: 0,
        },
      },
      {
        id: 'tc-4',
        name: 'Separates malformed payloads from valid rejected events',
        args: [
          'TASK-99',
          [
            null,
            { type: 'START', actor: '', role: 'author', assignee: 'ada' },
            { type: 'START', actor: 'ada', role: 'superuser', assignee: 'ada' },
            { type: 'RELEASE', actor: 'linus', role: 'lead', versionTag: 'v1.0.0' },
          ],
        ],
        expected: {
          finalState: { taskId: 'TASK-99', status: 'backlog', assignee: null },
          history: [],
          rejectedCount: 1,
          malformedCount: 3,
        },
      },
      {
        id: 'tc-5',
        name: 'Hidden: Assignee cannot self-release even if holding admin/lead role',
        hidden: true,
        args: [
          'TASK-105',
          [
            { type: 'START', actor: 'ada', role: 'lead', assignee: 'ada' },
            { type: 'SUBMIT_REVIEW', actor: 'ada', role: 'lead', reviewer: 'grace' },
            { type: 'RELEASE', actor: 'ada', role: 'admin', versionTag: 'v2.0.0' },
            { type: 'RELEASE', actor: 'ken', role: 'lead', versionTag: 'v2.0.0' },
            { type: 'BLOCK', actor: 'ken', role: 'lead', reason: 'Post-release attempt' },
          ],
        ],
        expected: {
          finalState: {
            taskId: 'TASK-105',
            status: 'released',
            assignee: 'ada',
            approvedBy: 'ken',
            versionTag: 'v2.0.0',
          },
          history: [
            { eventType: 'START', actor: 'ada', from: 'backlog', to: 'in_progress' },
            { eventType: 'SUBMIT_REVIEW', actor: 'ada', from: 'in_progress', to: 'in_review' },
            { eventType: 'RELEASE', actor: 'ken', from: 'in_review', to: 'released' },
          ],
          rejectedCount: 2,
          malformedCount: 0,
        },
      },
      {
        id: 'tc-6',
        name: 'Hidden: Empty reason on BLOCK is rejected',
        hidden: true,
        args: [
          'TASK-106',
          [
            { type: 'START', actor: 'ada', role: 'author', assignee: 'ada' },
            { type: 'BLOCK', actor: 'ada', role: 'author', reason: '   ' },
          ],
        ],
        expected: {
          finalState: { taskId: 'TASK-106', status: 'in_progress', assignee: 'ada' },
          history: [
            { eventType: 'START', actor: 'ada', from: 'backlog', to: 'in_progress' },
          ],
          rejectedCount: 1,
          malformedCount: 0,
        },
      },
    ],
  },
  exam: {
    id: 's3-exam',
    title: 'Section 3 Cumulative Exam',
    subtitle: 'Integrated assessment across Sections 1–3: I/O parsing, immutability, discriminated unions, and runtime guards',
    coveredSections: [1, 2, 3],
    passingScore: 1,
    description:
      'Complete all 4 tasks without hints to certify mastery of Sections 1–3: structured text parsing, immutable data pipelines, exhaustive discriminated unions, runtime `unknown` validation, and mapped object types.',
    tasks: [
      {
        id: 's3-exam-t1',
        title: 'Warehouse Command Ledger',
        style: 'beecrowd',
        difficulty: 'medium',
        description: `Process warehouse inventory commands from standard input and print sorted valuation metrics.

### Input Format
First line: integer \`N\`. Next \`N\` lines:
- \`STOCK <sku> <qty> <unitCents>\`: adds \`qty\` (> 0) and updates \`unitCents\` (> 0) for \`<sku>\` unless discontinued (if discontinued, increment \`denied\`).
- \`SHIP <sku> <qty>\`: subtracts \`qty\` (> 0) from \`<sku>\` ONLY if \`<sku>\` exists, is not discontinued, and \`currentQty >= qty\`; otherwise increment \`denied\`.
- \`DISCONTINUE <sku>\`: if \`<sku>\` exists and \`currentQty === 0\`, marks \`<sku>\` discontinued; otherwise increment \`denied\`.

### Output Format
1. All **non-discontinued** SKUs with \`currentQty > 0\`, sorted by \`valuation = currentQty * unitCents\` **descending**, breaking ties by \`sku\` ascending (ASCII), formatted as \`<sku>: <currentQty> units (<valuation> cents)\`.
2. Final line: \`DENIED: <deniedCount>\`.`,
        tags: ['Stdin I/O', 'Sorting', 'Union Narrowing'],
        hints: [],
        entryFunction: 'solve',
        playgroundInput: `6
STOCK KEYB 10 5000
SHIP KEYB 4
STOCK MOUSE 20 1500
SHIP MOUSE 25
STOCK CABLE 2 500
SHIP CABLE 2`,
        astRules: { requireTypeNarrowing: true },
        starterCode: `export function solve(input: string): string {
  // Implement warehouse command processor
  return '';
}
`,
        referenceSolution: `type WarehouseCmd =
  | { readonly kind: 'STOCK'; readonly sku: string; readonly qty: number; readonly unitCents: number }
  | { readonly kind: 'SHIP'; readonly sku: string; readonly qty: number }
  | { readonly kind: 'DISCONTINUE'; readonly sku: string };

interface SkuRecord {
  qty: number;
  unitCents: number;
  discontinued: boolean;
}

function parseCmd(line: string): WarehouseCmd | null {
  const parts = line.trim().split(/\\s+/);
  const op = parts[0];
  const sku = parts[1];
  if (!op || !sku) return null;
  if (op === 'STOCK') {
    const qty = Number(parts[2]);
    const unitCents = Number(parts[3]);
    if (!Number.isInteger(qty) || qty <= 0 || !Number.isInteger(unitCents) || unitCents <= 0) {
      return null;
    }
    return { kind: 'STOCK', sku, qty, unitCents };
  }
  if (op === 'SHIP') {
    const qty = Number(parts[2]);
    if (!Number.isInteger(qty) || qty <= 0) return null;
    return { kind: 'SHIP', sku, qty };
  }
  if (op === 'DISCONTINUE') {
    return { kind: 'DISCONTINUE', sku };
  }
  return null;
}

export function solve(input: string): string {
  const lines = input
    .split(/\\r?\\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return 'DENIED: 0';
  const n = Number(lines[0]);
  const inventory = new Map<string, SkuRecord>();
  let denied = 0;

  for (let i = 1; i <= n && i < lines.length; i++) {
    const cmd = parseCmd(lines[i]);
    if (!cmd) continue;

    switch (cmd.kind) {
      case 'STOCK': {
        const existing = inventory.get(cmd.sku);
        if (existing && existing.discontinued) {
          denied++;
        } else if (existing) {
          existing.qty += cmd.qty;
          existing.unitCents = cmd.unitCents;
        } else {
          inventory.set(cmd.sku, { qty: cmd.qty, unitCents: cmd.unitCents, discontinued: false });
        }
        break;
      }
      case 'SHIP': {
        const existing = inventory.get(cmd.sku);
        if (!existing || existing.discontinued || existing.qty < cmd.qty) {
          denied++;
        } else {
          existing.qty -= cmd.qty;
        }
        break;
      }
      case 'DISCONTINUE': {
        const existing = inventory.get(cmd.sku);
        if (!existing || existing.discontinued || existing.qty !== 0) {
          denied++;
        } else {
          existing.discontinued = true;
        }
        break;
      }
    }
  }

  const active = [...inventory.entries()]
    .filter(([, rec]) => !rec.discontinued && rec.qty > 0)
    .map(([sku, rec]) => ({
      sku,
      qty: rec.qty,
      valuation: rec.qty * rec.unitCents,
    }))
    .sort((a, b) => {
      if (b.valuation !== a.valuation) return b.valuation - a.valuation;
      return a.sku < b.sku ? -1 : a.sku > b.sku ? 1 : 0;
    });

  const out = active.map(
    (item) => \`\${item.sku}: \${item.qty} units (\${item.valuation} cents)\`
  );
  out.push(\`DENIED: \${denied}\`);
  return out.join('\\n');
}
`,
        testCases: [
          {
            id: 'tc-1',
            name: 'Tie-breaks equal valuation by SKU and omits zero-stock SKUs',
            args: [
              `6
STOCK KEYB 10 5000
SHIP KEYB 4
STOCK MOUSE 20 1500
SHIP MOUSE 25
STOCK CABLE 2 500
SHIP CABLE 2`,
            ],
            expected: `KEYB: 6 units (30000 cents)\nMOUSE: 20 units (30000 cents)\nDENIED: 1`,
          },
          {
            id: 'tc-2',
            name: 'Discontinued SKU rejects future restocking',
            args: [
              `5
STOCK HUB 3 1000
DISCONTINUE HUB
SHIP HUB 3
DISCONTINUE HUB
STOCK HUB 5 1200`,
            ],
            expected: `DENIED: 2`,
          },
          {
            id: 'tc-3',
            name: 'Restocking updates unitCents for entire remaining stock',
            args: [
              `3
STOCK SSD 2 8000
STOCK SSD 3 7000
SHIP SSD 1`,
            ],
            expected: `SSD: 4 units (28000 cents)\nDENIED: 0`,
          },
          {
            id: 'tc-4',
            name: 'Hidden: Shipping unknown or already discontinued SKU increments denied',
            hidden: true,
            args: [
              `3
SHIP GHOST 1
DISCONTINUE GHOST
STOCK CAM 1 4500`,
            ],
            expected: `CAM: 1 units (4500 cents)\nDENIED: 2`,
          },
          {
            id: 'tc-5',
            name: 'Hidden: Zero commands prints DENIED: 0',
            hidden: true,
            args: [`0`],
            expected: `DENIED: 0`,
          },
        ],
      },
      {
        id: 's3-exam-t2',
        title: 'Immutable Multi-Account Ledger Reconciler',
        style: 'leetcode',
        difficulty: 'medium',
        description: `Implement \`reconcileTransactions(initialBalances, operations)\` without mutating \`initialBalances\` or \`operations\`.

### Operations (\`LedgerOp\`)
- \`{ kind: 'deposit'; account: string; cents: number }\`: adds \`cents\` (\`> 0\`) to \`account\` (creates account starting at \`0\` if absent).
- \`{ kind: 'withdraw'; account: string; cents: number }\`: subtracts \`cents\` ONLY if current balance \`>= cents\`; else increment \`skipped\`.
- \`{ kind: 'transfer'; from: string; to: string; cents: number }\`: if \`from !== to\` and \`balance(from) >= cents\`, subtracts from \`from\` and adds to \`to\`; else increment \`skipped\`.
- \`{ kind: 'fee_waiver'; account: string; maxRefundCents: number }\`: if \`account\` exists and has balance \`< 1000\`, adds \`Math.min(maxRefundCents, 1000 - balance)\`; else increment \`skipped\`.

Return \`{ balances: Record<string, number>; skipped: number }\`.`,
        tags: ['Discriminated Unions', 'Immutability', 'Exhaustiveness'],
        hints: [],
        entryFunction: 'reconcileTransactions',
        astRules: { requireTypeNarrowing: true, requireInterfaceOrType: true },
        starterCode: `export type LedgerOp =
  | { readonly kind: 'deposit'; readonly account: string; readonly cents: number }
  | { readonly kind: 'withdraw'; readonly account: string; readonly cents: number }
  | { readonly kind: 'transfer'; readonly from: string; readonly to: string; readonly cents: number }
  | { readonly kind: 'fee_waiver'; readonly account: string; readonly maxRefundCents: number };

export interface ReconcileResult {
  readonly balances: Record<string, number>;
  readonly skipped: number;
}

export function reconcileTransactions(
  initialBalances: Readonly<Record<string, number>>,
  operations: readonly LedgerOp[]
): ReconcileResult {
  return { balances: {}, skipped: 0 };
}
`,
        referenceSolution: `export type LedgerOp =
  | { readonly kind: 'deposit'; readonly account: string; readonly cents: number }
  | { readonly kind: 'withdraw'; readonly account: string; readonly cents: number }
  | { readonly kind: 'transfer'; readonly from: string; readonly to: string; readonly cents: number }
  | { readonly kind: 'fee_waiver'; readonly account: string; readonly maxRefundCents: number };

export interface ReconcileResult {
  readonly balances: Record<string, number>;
  readonly skipped: number;
}

function assertNever(x: never): never {
  throw new Error(\`Unhandled op: \${JSON.stringify(x)}\`);
}

export function reconcileTransactions(
  initialBalances: Readonly<Record<string, number>>,
  operations: readonly LedgerOp[]
): ReconcileResult {
  const map = new Map<string, number>(Object.entries(initialBalances));
  let skipped = 0;

  for (const op of operations) {
    switch (op.kind) {
      case 'deposit': {
        if (op.cents <= 0) {
          skipped++;
        } else {
          map.set(op.account, (map.get(op.account) ?? 0) + op.cents);
        }
        break;
      }
      case 'withdraw': {
        const cur = map.get(op.account) ?? 0;
        if (!map.has(op.account) || op.cents <= 0 || cur < op.cents) {
          skipped++;
        } else {
          map.set(op.account, cur - op.cents);
        }
        break;
      }
      case 'transfer': {
        const fromBal = map.get(op.from) ?? 0;
        if (!map.has(op.from) || op.from === op.to || op.cents <= 0 || fromBal < op.cents) {
          skipped++;
        } else {
          map.set(op.from, fromBal - op.cents);
          map.set(op.to, (map.get(op.to) ?? 0) + op.cents);
        }
        break;
      }
      case 'fee_waiver': {
        const cur = map.get(op.account);
        if (cur === undefined || cur >= 1000 || op.maxRefundCents <= 0) {
          skipped++;
        } else {
          map.set(op.account, cur + Math.min(op.maxRefundCents, 1000 - cur));
        }
        break;
      }
      default:
        assertNever(op);
    }
  }

  const balances: Record<string, number> = {};
  for (const [k, v] of map.entries()) {
    balances[k] = v;
  }
  return { balances, skipped };
}
`,
        testCases: [
          {
            id: 'tc-1',
            name: 'Handles deposit, transfer to new account, and capped fee_waiver',
            checkImmutability: true,
            args: [
              { checking: 1200 },
              [
                { kind: 'transfer', from: 'checking', to: 'savings', cents: 500 },
                { kind: 'fee_waiver', account: 'checking', maxRefundCents: 400 },
                { kind: 'withdraw', account: 'savings', cents: 600 },
              ],
            ],
            expected: {
              balances: { checking: 1000, savings: 500 },
              skipped: 1,
            },
          },
          {
            id: 'tc-2',
            name: 'Self-transfer and missing-account fee_waiver are skipped',
            checkImmutability: true,
            args: [
              { main: 500 },
              [
                { kind: 'transfer', from: 'main', to: 'main', cents: 100 },
                { kind: 'fee_waiver', account: 'unknown', maxRefundCents: 200 },
              ],
            ],
            expected: {
              balances: { main: 500 },
              skipped: 2,
            },
          },
          {
            id: 'tc-3',
            name: 'Deposit creates new account cleanly',
            checkImmutability: true,
            args: [{}, [{ kind: 'deposit', account: 'vault', cents: 950 }]],
            expected: { balances: { vault: 950 }, skipped: 0 },
          },
          {
            id: 'tc-4',
            name: 'Hidden: fee_waiver when balance >= 1000 is skipped',
            hidden: true,
            checkImmutability: true,
            args: [
              { a: 1000, b: 850 },
              [
                { kind: 'fee_waiver', account: 'a', maxRefundCents: 100 },
                { kind: 'fee_waiver', account: 'b', maxRefundCents: 50 },
              ],
            ],
            expected: { balances: { a: 1000, b: 900 }, skipped: 1 },
          },
          {
            id: 'tc-5',
            name: 'Hidden: Withdraw exact balance leaves account at 0',
            hidden: true,
            checkImmutability: true,
            args: [
              { wallet: 300 },
              [{ kind: 'withdraw', account: 'wallet', cents: 300 }],
            ],
            expected: { balances: { wallet: 0 }, skipped: 0 },
          },
        ],
      },
      {
        id: 's3-exam-t3',
        title: 'Untrusted Sensor Payload Guard',
        style: 'leetcode',
        difficulty: 'medium',
        description: `Implement \`isSensorPayload(v: unknown): v is SensorPayload\` and \`ingestSensorPayloads(rawItems)\`.

### Valid \`SensorPayload\`
Plain object with:
- \`zone\`: non-empty trimmed \`string\`.
- \`celsius\`: finite \`number\` in \`-90 <= celsius <= 90\`.
- \`calibrated\`: \`boolean\`.

### Aggregation
Filter \`rawItems\` with \`isSensorPayload\`, ignore valid items where \`calibrated === false\`, and compute per-zone average \`celsius\` rounded via \`Math.round(avg * 100) / 100\`. Return \`{ zoneAverages: Record<string, number>; invalidCount: number; uncalibratedCount: number }\`.`,
        tags: ['Type Predicates', 'unknown', 'Aggregation'],
        hints: [],
        entryFunction: 'ingestSensorPayloads',
        astRules: { requireTypePredicate: true, requireInterfaceOrType: true },
        starterCode: `export interface SensorPayload {
  readonly zone: string;
  readonly celsius: number;
  readonly calibrated: boolean;
}

export interface IngestReport {
  readonly zoneAverages: Record<string, number>;
  readonly invalidCount: number;
  readonly uncalibratedCount: number;
}

export function isSensorPayload(v: unknown): v is SensorPayload {
  return false;
}

export function ingestSensorPayloads(rawItems: readonly unknown[]): IngestReport {
  return { zoneAverages: {}, invalidCount: 0, uncalibratedCount: 0 };
}
`,
        referenceSolution: `export interface SensorPayload {
  readonly zone: string;
  readonly celsius: number;
  readonly calibrated: boolean;
}

export interface IngestReport {
  readonly zoneAverages: Record<string, number>;
  readonly invalidCount: number;
  readonly uncalibratedCount: number;
}

export function isSensorPayload(v: unknown): v is SensorPayload {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return false;
  const rec = v as Record<string, unknown>;
  return (
    typeof rec.zone === 'string' &&
    rec.zone.trim().length > 0 &&
    typeof rec.celsius === 'number' &&
    Number.isFinite(rec.celsius) &&
    rec.celsius >= -90 &&
    rec.celsius <= 90 &&
    typeof rec.calibrated === 'boolean'
  );
}

export function ingestSensorPayloads(rawItems: readonly unknown[]): IngestReport {
  let invalidCount = 0;
  let uncalibratedCount = 0;
  const sums = new Map<string, { total: number; count: number }>();

  for (const item of rawItems) {
    if (!isSensorPayload(item)) {
      invalidCount++;
      continue;
    }
    if (!item.calibrated) {
      uncalibratedCount++;
      continue;
    }
    const zone = item.zone.trim();
    const cur = sums.get(zone) ?? { total: 0, count: 0 };
    cur.total += item.celsius;
    cur.count += 1;
    sums.set(zone, cur);
  }

  const zoneAverages: Record<string, number> = {};
  for (const [zone, stats] of sums.entries()) {
    zoneAverages[zone] = Math.round((stats.total / stats.count) * 100) / 100;
  }

  return { zoneAverages, invalidCount, uncalibratedCount };
}
`,
        testCases: [
          {
            id: 'tc-1',
            name: 'Computes calibrated zone averages and counts invalid/uncalibrated items',
            args: [
              [
                { zone: 'north', celsius: 20, calibrated: true },
                { zone: 'north', celsius: 21.5, calibrated: true },
                { zone: 'north', celsius: 50, calibrated: false },
                { zone: 'south', celsius: 120, calibrated: true },
                null,
              ],
            ],
            expected: {
              zoneAverages: { north: 20.75 },
              invalidCount: 2,
              uncalibratedCount: 1,
            },
          },
          {
            id: 'tc-2',
            name: 'Rounds repeating decimals to 2 places',
            args: [
              [
                { zone: 'lab', celsius: 10, calibrated: true },
                { zone: 'lab', celsius: 11, calibrated: true },
                { zone: 'lab', celsius: 11, calibrated: true },
              ],
            ],
            expected: {
              zoneAverages: { lab: 10.67 },
              invalidCount: 0,
              uncalibratedCount: 0,
            },
          },
          {
            id: 'tc-3',
            name: 'Accepts boundary temperatures -90 and 90',
            args: [
              [
                { zone: 'polar', celsius: -90, calibrated: true },
                { zone: 'kiln', celsius: 90, calibrated: true },
              ],
            ],
            expected: {
              zoneAverages: { polar: -90, kiln: 90 },
              invalidCount: 0,
              uncalibratedCount: 0,
            },
          },
          {
            id: 'tc-4',
            name: 'Hidden: Trims zone names before grouping',
            hidden: true,
            args: [
              [
                { zone: ' east ', celsius: 15, calibrated: true },
                { zone: 'east', celsius: 25, calibrated: true },
              ],
            ],
            expected: {
              zoneAverages: { east: 20 },
              invalidCount: 0,
              uncalibratedCount: 0,
            },
          },
          {
            id: 'tc-5',
            name: 'Hidden: Rejects whitespace-only zone or string temperature',
            hidden: true,
            args: [
              [
                { zone: '   ', celsius: 20, calibrated: true },
                { zone: 'west', celsius: '20', calibrated: true },
              ],
            ],
            expected: {
              zoneAverages: {},
              invalidCount: 2,
              uncalibratedCount: 0,
            },
          },
        ],
      },
      {
        id: 's3-exam-t4',
        title: 'StrictPatch & ActionPayloadMap',
        style: 'type-challenge',
        difficulty: 'hard',
        description: `Implement two mapped type utilities:

1. \`StrictPatch<T, ImmutableKeys extends keyof T>\`: Produces an update patch object excluding \`ImmutableKeys\`, removing \`readonly\` modifiers on remaining keys, and making every remaining key optional (\`?\`).
2. \`ActionPayloadMap<A extends { type: string }>\`: Maps each discriminant \`K\` in \`A['type']\` to \`Omit<Extract<A, { type: K }>, 'type'>\` (as a clean flat object type \`{ [P in keyof ...]: ... }\`).`,
        tags: ['Mapped Types', 'Key Remapping', 'Discriminated Unions'],
        hints: [],
        starterCode: `export type StrictPatch<T, ImmutableKeys extends keyof T> = T;

export type ActionPayloadMap<A extends { type: string }> = Record<A['type'], unknown>;
`,
        referenceSolution: `export type StrictPatch<T, ImmutableKeys extends keyof T> = {
  -readonly [K in keyof T as K extends ImmutableKeys ? never : K]?: T[K];
};

type OmitTypeTag<E> = {
  [P in keyof E as P extends 'type' ? never : P]: E[P];
};

export type ActionPayloadMap<A extends { type: string }> = {
  [K in A['type']]: OmitTypeTag<A extends { type: K } ? A : never>;
};
`,
        typeAssertionPrelude: `import type { StrictPatch, ActionPayloadMap } from './solution';

interface Customer {
  readonly id: string;
  readonly createdAt: number;
  readonly name: string;
  tier?: 'free' | 'pro';
}

type AppAction =
  | { type: 'SET_NAME'; name: string }
  | { type: 'RESET' }
  | { type: 'CHARGE'; cents: number; currency: string };`,
        typeAssertions: [
          {
            id: 'ta-1',
            name: 'StrictPatch omits immutable keys, strips readonly, and marks remaining optional',
            assertion: `Expect<Equal<StrictPatch<Customer, 'id' | 'createdAt'>, { name?: string; tier?: 'free' | 'pro' }>>`,
          },
          {
            id: 'ta-2',
            name: 'StrictPatch with never immutable keys makes all fields mutable and optional',
            assertion: `Expect<Equal<StrictPatch<{ readonly a: number; b: string }, never>, { a?: number; b?: string }>>`,
          },
          {
            id: 'ta-3',
            name: 'ActionPayloadMap maps each action type to its payload without the type tag',
            assertion: `Expect<Equal<ActionPayloadMap<AppAction>, {
              SET_NAME: { name: string };
              RESET: {};
              CHARGE: { cents: number; currency: string };
            }>>`,
          },
          {
            id: 'ta-4',
            name: 'StrictPatch omitting all keys yields empty object type',
            assertion: `Expect<Equal<StrictPatch<{ id: string }, 'id'>, {}>>`,
          },
          {
            id: 'ta-5',
            name: 'Hidden: ActionPayloadMap preserves readonly and optional modifiers on payload fields',
            hidden: true,
            assertion: `Expect<Equal<ActionPayloadMap<{ type: 'LOG'; readonly msg: string; meta?: number }>, { LOG: { readonly msg: string; meta?: number } }>>`,
          },
          {
            id: 'ta-6',
            name: 'Hidden: StrictPatch handles union of multiple immutable keys',
            hidden: true,
            assertion: `Expect<Equal<StrictPatch<{ a: 1; b: 2; c: 3 }, 'a' | 'c'>, { b?: 2 }>>`,
          },
        ],
        testCases: [],
      },
    ],
  },
};
