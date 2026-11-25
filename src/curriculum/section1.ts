import type { Section } from '../types/curriculum';

export const section1: Section = {
  id: 'section-1',
  number: 1,
  slug: 'foundations-control-flow-io',
  title: 'Foundations, Control Flow & I/O',
  subtitle: 'Strict primitives, deterministic arithmetic, branching logic, loops, stdin parsing, and tuple safety',
  accentColor: '#61afef',
  description:
    'Build rock-solid TypeScript fundamentals from day one: explicit primitive and literal annotations, exact financial math, exhaustive branching, off-by-one-safe loops, multi-line standard input parsing, and readonly tuples.',
  phases: [
    {
      id: 's1-p1',
      number: 1,
      title: 'Primitives, Type Annotations & Precision Math',
      subtitle: 'Explicit primitive types, literal unions, integer cents, and deterministic decimal formatting',
      conceptSummary: `In strict TypeScript, annotating parameters and return types catches unit mismatches before your code ever runs.

- **Primitives & Literals:** Prefer narrow union literals like \`'C' | 'K'\` or \`1 | 2 | 3\` over wide \`string\` or \`number\` types when only specific values are valid.
- **Formatted Output:** Use \`value.toFixed(2)\` when generating human-readable financial or scientific strings.
- **Integer Cents & Basis Points:** Avoid binary floating-point drift (such as \`0.1 + 0.2\`) in billing logic by computing in integer cents and basis points (\`10_000 bps = 100%\`).`,
      challenges: [
        {
          id: 's1-p1-c1',
          title: 'Workshop Order Total',
          style: 'beecrowd',
          difficulty: 'beginner',
          description: `### Problem

A fabrication workshop charges a flat setup fee plus \`quantity * unitPrice\` for materials, and then applies a percentage service fee (\`feePct\`) on top of that subtotal.

Given a single line of four whitespace-separated numbers:

\`\`\`
setupFee quantity unitPrice feePct
\`\`\`

compute:
- \`subtotal = setupFee + quantity * unitPrice\`
- \`total = subtotal * (1 + feePct / 100)\`

### Output Format

Return two lines with both amounts formatted to **2 decimal places**:

\`\`\`
SUBTOTAL = <subtotal>
TOTAL = <total>
\`\`\`

### Example

**Input:** \`"15.00 3 12.50 10"\`  
**Output:**
\`\`\`
SUBTOTAL = 52.50
TOTAL = 57.75
\`\`\``,
          tags: ['Primitives', 'Beecrowd I/O', 'toFixed'],
          hints: [
            'Split the trimmed input string on whitespace (`input.trim().split(/\\s+/)`) and convert each token with `Number(...)`.',
            'Format both numbers with `.toFixed(2)` and join the two output lines with `"\\n"`.',
          ],
          entryFunction: 'solve',
          playgroundInput: '15.00 3 12.50 10',
          starterCode: `export function solve(input: string): string {
  // Parse setupFee, quantity, unitPrice, and feePct from input
  return '';
}
`,
          referenceSolution: `export function solve(input: string): string {
  const parts = input.trim().split(/\\s+/);
  const setupFee = Number(parts[0]);
  const quantity = Number(parts[1]);
  const unitPrice = Number(parts[2]);
  const feePct = Number(parts[3]);

  const subtotal = setupFee + quantity * unitPrice;
  const total = subtotal * (1 + feePct / 100);

  return \`SUBTOTAL = \${subtotal.toFixed(2)}\\nTOTAL = \${total.toFixed(2)}\`;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Standard workshop order with 10% fee',
              args: ['15.00 3 12.50 10'],
              expected: 'SUBTOTAL = 52.50\nTOTAL = 57.75',
            },
            {
              id: 'tc-2',
              name: 'Zero setup fee with 8% service fee',
              args: ['0 4 25.00 8'],
              expected: 'SUBTOTAL = 100.00\nTOTAL = 108.00',
            },
            {
              id: 'tc-3',
              name: 'Setup fee only (zero quantity and zero fee)',
              args: ['10.50 0 99.99 0'],
              expected: 'SUBTOTAL = 10.50\nTOTAL = 10.50',
            },
            {
              id: 'tc-4',
              name: 'Extra whitespace padding in input',
              args: ['  20   2   15.25   20  \n'],
              expected: 'SUBTOTAL = 50.50\nTOTAL = 60.60',
            },
            {
              id: 'tc-5',
              name: 'Small unit order with 5% fee',
              args: ['5.00 5 3.00 5'],
              expected: 'SUBTOTAL = 20.00\nTOTAL = 21.00',
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Larger batch with 25% rush fee',
              args: ['12.00 8 4.50 25'],
              expected: 'SUBTOTAL = 48.00\nTOTAL = 60.00',
              hidden: true,
            },
          ],
        },
        {
          id: 's1-p1-c2',
          title: 'Thermal Lab Unit Converter',
          style: 'beecrowd',
          difficulty: 'beginner',
          description: `### Problem

A materials testing lab records temperatures in either Celsius (\`C\`) or Kelvin (\`K\`). Write \`solve(input)\` to convert a reading into all three scales: Celsius, Fahrenheit, and Kelvin.

### Conversion Rules

- If input scale is \`C\`:
  - \`K = C + 273.15\`
  - \`F = C * 1.8 + 32\`
- If input scale is \`K\`:
  - \`C = K - 273.15\`
  - \`F = C * 1.8 + 32\`

### Input & Output Format

- **Input:** \`"<value> <scale>"\` where \`<scale>\` is \`C\` or \`K\` (e.g. \`"25 C"\` or \`"300 K"\`).
- **Output:** \`"C: <c> | F: <f> | K: <k>"\` with every value formatted using \`.toFixed(2)\`.

### Examples

- \`"0 C"\` → \`"C: 0.00 | F: 32.00 | K: 273.15"\`
- \`"273.15 K"\` → \`"C: 0.00 | F: 32.00 | K: 273.15"\``,
          tags: ['Number Parsing', 'Unit Conversion', 'Formatted Output'],
          hints: [
            'Normalize the scale token (`scale.toUpperCase()`) and compute `celsius` first so `fahrenheit` and `kelvin` follow from a single formula.',
            'Use template literals with `.toFixed(2)` for `celsius`, `fahrenheit`, and `kelvin`.',
          ],
          entryFunction: 'solve',
          playgroundInput: '25 C',
          starterCode: `export function solve(input: string): string {
  // Convert between Celsius, Fahrenheit, and Kelvin
  return '';
}
`,
          referenceSolution: `export function solve(input: string): string {
  const [rawVal, rawScale] = input.trim().split(/\\s+/);
  const value = Number(rawVal);
  const scale = rawScale.toUpperCase();

  const celsius = scale === 'K' ? value - 273.15 : value;
  const kelvin = scale === 'K' ? value : celsius + 273.15;
  const fahrenheit = celsius * 1.8 + 32;

  return \`C: \${celsius.toFixed(2)} | F: \${fahrenheit.toFixed(2)} | K: \${kelvin.toFixed(2)}\`;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Freezing point of water from Celsius',
              args: ['0 C'],
              expected: 'C: 0.00 | F: 32.00 | K: 273.15',
            },
            {
              id: 'tc-2',
              name: 'Boiling point of water from Celsius',
              args: ['100 C'],
              expected: 'C: 100.00 | F: 212.00 | K: 373.15',
            },
            {
              id: 'tc-3',
              name: 'Freezing point from Kelvin',
              args: ['273.15 K'],
              expected: 'C: 0.00 | F: 32.00 | K: 273.15',
            },
            {
              id: 'tc-4',
              name: 'Sub-zero crossover (-40 C == -40 F)',
              args: ['-40 C'],
              expected: 'C: -40.00 | F: -40.00 | K: 233.15',
            },
            {
              id: 'tc-5',
              name: 'Boiling point from Kelvin',
              args: ['373.15 K'],
              expected: 'C: 100.00 | F: 212.00 | K: 373.15',
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Room temperature 25 C',
              args: ['25 C'],
              expected: 'C: 25.00 | F: 77.00 | K: 298.15',
              hidden: true,
            },
          ],
        },
        {
          id: 's1-p1-c3',
          title: 'Primitive & Literal Telemetry Contracts',
          style: 'type-challenge',
          difficulty: 'beginner',
          description: `### Problem

Tighten the exported telemetry types in \`solution.ts\` so invalid packet versions, unknown severity labels, and accidental property mutations are rejected at compile time:

1. \`PacketVersion\`: exact numeric literal union \`1 | 2 | 3\`.
2. \`SeverityLevel\`: exact string literal union \`'info' | 'warn' | 'critical'\`.
3. \`SensorReading\`: an object type with **all \`readonly\` properties**:
   - \`readonly sensorId: string\`
   - \`readonly value: number\`
   - \`readonly active: boolean\`
   - \`readonly severity: SeverityLevel\`

### Example

\`\`\`ts
const sample: SensorReading = {
  sensorId: 'temp-01',
  value: 21.5,
  active: true,
  severity: 'info',
};
\`\`\``,
          tags: ['Literal Types', 'Readonly Properties', 'Type Aliases'],
          hints: [
            'Replace wide `number` and `string` aliases with union literals using `|` (e.g. `1 | 2 | 3`).',
            'Prefix every field in `SensorReading` with `readonly` and type `severity` as `SeverityLevel`.',
          ],
          astRules: { requireInterfaceOrType: true },
          starterCode: `export type PacketVersion = number;

export type SeverityLevel = string;

export interface SensorReading {
  sensorId: string;
  value: number;
  active: boolean;
  severity: string;
}
`,
          referenceSolution: `export type PacketVersion = 1 | 2 | 3;

export type SeverityLevel = 'info' | 'warn' | 'critical';

export interface SensorReading {
  readonly sensorId: string;
  readonly value: number;
  readonly active: boolean;
  readonly severity: SeverityLevel;
}
`,
          typeAssertionPrelude: `import type { PacketVersion, SeverityLevel, SensorReading } from './solution';`,
          typeAssertions: [
            {
              id: 'ta-1',
              name: 'PacketVersion narrows to 1 | 2 | 3',
              assertion: `Expect<Equal<PacketVersion, 1 | 2 | 3>>`,
            },
            {
              id: 'ta-2',
              name: 'SeverityLevel narrows to info | warn | critical',
              assertion: `Expect<Equal<SeverityLevel, 'info' | 'warn' | 'critical'>>`,
            },
            {
              id: 'ta-3',
              name: 'SensorReading.severity uses SeverityLevel',
              assertion: `Expect<Equal<SensorReading['severity'], 'info' | 'warn' | 'critical'>>`,
            },
            {
              id: 'ta-4',
              name: 'SensorReading matches exact readonly shape',
              assertion: `Expect<Equal<SensorReading, { readonly sensorId: string; readonly value: number; readonly active: boolean; readonly severity: 'info' | 'warn' | 'critical' }>>`,
            },
            {
              id: 'ta-5',
              name: 'PacketVersion is not wide number',
              assertion: `ExpectFalse<Equal<PacketVersion, number>>`,
              hidden: true,
            },
            {
              id: 'ta-6',
              name: 'SensorReading primitive field types are exact',
              assertion: `Expect<Equal<[SensorReading['sensorId'], SensorReading['value'], SensorReading['active']], [string, number, boolean]>>`,
              hidden: true,
            },
          ],
          testCases: [],
        },
        {
          id: 's1-p1-c4',
          title: 'Integer Basis-Point Split',
          style: 'leetcode',
          difficulty: 'beginner',
          description: `### Problem

Payment processors work in integer cents and **basis points** (\`10,000 bps = 100%\`, so \`250 bps = 2.5%\`) to prevent floating-point rounding drift.

Implement \`computeNetPayout(grossCents, platformFeeBps, fixedFeeCents)\`:

1. If \`grossCents <= 0\`, return \`{ feeCents: 0, netCents: 0 }\`.
2. Compute the variable fee as \`Math.round((grossCents * platformFeeBps) / 10000)\`.
3. Add \`fixedFeeCents\` to get the raw fee, then cap \`feeCents\` so it never exceeds \`grossCents\` (and is never less than \`0\`).
4. Set \`netCents = grossCents - feeCents\`.

### Examples

- \`computeNetPayout(10000, 250, 30)\` → \`{ feeCents: 280, netCents: 9720 }\`
- \`computeNetPayout(25, 500, 30)\` → \`{ feeCents: 25, netCents: 0 }\``,
          tags: ['Integer Arithmetic', 'Type Annotations', 'Object Return'],
          hints: [
            'Guard `grossCents <= 0` first so zero or negative gross amounts immediately return `{ feeCents: 0, netCents: 0 }`.',
            'Use `Math.min(grossCents, Math.max(0, variableFee + fixedFeeCents))` to clamp the total fee safely.',
          ],
          entryFunction: 'computeNetPayout',
          playgroundInput: '[10000, 250, 30]',
          starterCode: `export interface PayoutSplit {
  feeCents: number;
  netCents: number;
}

export function computeNetPayout(
  grossCents: number,
  platformFeeBps: number,
  fixedFeeCents: number
): PayoutSplit {
  return { feeCents: 0, netCents: grossCents };
}
`,
          referenceSolution: `export interface PayoutSplit {
  feeCents: number;
  netCents: number;
}

export function computeNetPayout(
  grossCents: number,
  platformFeeBps: number,
  fixedFeeCents: number
): PayoutSplit {
  if (grossCents <= 0) {
    return { feeCents: 0, netCents: 0 };
  }

  const variableFee = Math.round((grossCents * platformFeeBps) / 10000);
  const rawFee = variableFee + fixedFeeCents;
  const feeCents = Math.min(grossCents, Math.max(0, rawFee));

  return {
    feeCents,
    netCents: grossCents - feeCents,
  };
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: '$100.00 gross at 2.5% + $0.30 fixed',
              args: [10000, 250, 30],
              expected: { feeCents: 280, netCents: 9720 },
            },
            {
              id: 'tc-2',
              name: '$5.00 gross at 3.0% + $0.30 fixed',
              args: [500, 300, 30],
              expected: { feeCents: 45, netCents: 455 },
            },
            {
              id: 'tc-3',
              name: 'Micro-payment capped at grossCents',
              args: [25, 500, 30],
              expected: { feeCents: 25, netCents: 0 },
            },
            {
              id: 'tc-4',
              name: 'Zero gross amount incurs no fee',
              args: [0, 290, 30],
              expected: { feeCents: 0, netCents: 0 },
            },
            {
              id: 'tc-5',
              name: 'Half-cent rounding check (333 * 290 bps)',
              args: [333, 290, 0],
              expected: { feeCents: 10, netCents: 323 },
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Zero fee promo payout',
              args: [100000, 0, 0],
              expected: { feeCents: 0, netCents: 100000 },
              hidden: true,
            },
          ],
        },
      ],
    },
    {
      id: 's1-p2',
      number: 2,
      title: 'Conditionals, Guards & Tax Brackets',
      subtitle: 'Marginal tier math, calendar invariants, discriminated branching, and nullish coalescing',
      conceptSummary: `Clean conditional logic separates boundary invariants at the top (guard clauses) from core domain rules.

- **Marginal Brackets:** In progressive pricing or tax brackets, each rate applies only to the slice within that bracket—never multiply the entire total by the top bracket rate.
- **\`??\` vs \`||\`:** Logical OR (\`||\`) treats \`0\`, \`false\`, and \`""\` as falsy and overwrites them. Nullish coalescing (\`??\`) only falls back when a value is \`null\` or \`undefined\`.`,
      challenges: [
        {
          id: 's1-p2-c1',
          title: 'Progressive Energy Tariff',
          style: 'leetcode',
          difficulty: 'beginner',
          description: `### Problem

Compute a monthly electricity bill in dollars using **marginal (progressive) consumption tiers** plus a fixed **$8.00** grid connection charge:

- **Grid connection fee:** \`$8.00\` (always charged; if \`kwh < 0\`, treat consumption as \`0\`).
- **Tier 1 (first \`100\` kWh, \`0..100\`):** \`$0.12\` per kWh
- **Tier 2 (next \`200\` kWh, \`100..300\`):** \`$0.18\` per kWh
- **Tier 3 (above \`300\` kWh):** \`$0.25\` per kWh

Round the returned number to 2 decimal places (\`Math.round(total * 100) / 100\`).

### Examples

- \`calculateEnergyBill(50)\` → \`8 + 50 * 0.12 = 14\`
- \`calculateEnergyBill(250)\` → \`8 + 100 * 0.12 + 150 * 0.18 = 47\``,
          tags: ['Conditionals', 'Marginal Brackets', 'Guard Clauses'],
          hints: [
            'Clamp `usage = Math.max(0, kwh)` at the start of the function.',
            'Compute each slice independently: `tier1 = Math.min(usage, 100)`, `tier2 = Math.min(Math.max(0, usage - 100), 200)`, and `tier3 = Math.max(0, usage - 300)`.',
          ],
          entryFunction: 'calculateEnergyBill',
          playgroundInput: '[250]',
          starterCode: `export function calculateEnergyBill(kwh: number): number {
  return 0;
}
`,
          referenceSolution: `export function calculateEnergyBill(kwh: number): number {
  const usage = Math.max(0, kwh);
  const tier1 = Math.min(usage, 100);
  const tier2 = Math.min(Math.max(0, usage - 100), 200);
  const tier3 = Math.max(0, usage - 300);

  const total = 8 + tier1 * 0.12 + tier2 * 0.18 + tier3 * 0.25;
  return Math.round(total * 100) / 100;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Zero usage pays base connection charge',
              args: [0],
              expected: 8,
            },
            {
              id: 'tc-2',
              name: 'Within Tier 1 (50 kWh)',
              args: [50],
              expected: 14,
            },
            {
              id: 'tc-3',
              name: 'Exact Tier 1 boundary (100 kWh)',
              args: [100],
              expected: 20,
            },
            {
              id: 'tc-4',
              name: 'Spans Tier 1 and Tier 2 (250 kWh)',
              args: [250],
              expected: 47,
            },
            {
              id: 'tc-5',
              name: 'Spans all three tiers (400 kWh)',
              args: [400],
              expected: 81,
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Negative kWh clamped to 0 usage',
              args: [-15],
              expected: 8,
              hidden: true,
            },
          ],
        },
        {
          id: 's1-p2-c2',
          title: 'Calendar & Quarter Validator',
          style: 'beecrowd',
          difficulty: 'easy',
          description: `### Problem

Given a single line containing three integers \`"YYYY MM DD"\`, validate whether the date exists in the Gregorian calendar and classify its year type and fiscal quarter.

### Rules

1. Valid bounds: \`year >= 1\`, \`1 <= month <= 12\`, and \`1 <= day <= daysInMonth(year, month)\`.
2. A year is a **leap year** if \`(year % 4 === 0 && year % 100 !== 0) || year % 400 === 0\` (February has \`29\` days in leap years, \`28\` otherwise).
3. Quarters: months \`1..3\` = \`Q1\`, \`4..6\` = \`Q2\`, \`7..9\` = \`Q3\`, \`10..12\` = \`Q4\`.

### Output Format

- Invalid date: \`"INVALID DATE"\`
- Valid date: \`"VALID | <LEAP|COMMON> | QUARTER Q<1..4>"\`

### Examples

- \`"2024 2 29"\` → \`"VALID | LEAP | QUARTER Q1"\`
- \`"1900 2 29"\` → \`"INVALID DATE"\``,
          tags: ['Boolean Logic', 'Leap Year', 'Validation'],
          hints: [
            'Check century years carefully: `1900` is divisible by `100` (not leap), while `2000` is divisible by `400` (leap).',
            'Compute the quarter from a valid `month` (`1..12`) via `Math.ceil(month / 3)`.',
          ],
          entryFunction: 'solve',
          playgroundInput: '2024 2 29',
          starterCode: `export function solve(input: string): string {
  return 'INVALID DATE';
}
`,
          referenceSolution: `export function solve(input: string): string {
  const parts = input.trim().split(/\\s+/);
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    year < 1 ||
    month < 1 ||
    month > 12
  ) {
    return 'INVALID DATE';
  }

  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const monthDays = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const maxDay = monthDays[month - 1];

  if (day < 1 || day > maxDay) {
    return 'INVALID DATE';
  }

  const quarter = Math.ceil(month / 3);
  return \`VALID | \${isLeap ? 'LEAP' : 'COMMON'} | QUARTER Q\${quarter}\`;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Feb 29 on standard leap year',
              args: ['2024 2 29'],
              expected: 'VALID | LEAP | QUARTER Q1',
            },
            {
              id: 'tc-2',
              name: 'Feb 29 on common year is invalid',
              args: ['2023 2 29'],
              expected: 'INVALID DATE',
            },
            {
              id: 'tc-3',
              name: 'Century non-leap year 1900',
              args: ['1900 2 29'],
              expected: 'INVALID DATE',
            },
            {
              id: 'tc-4',
              name: '400-year leap year in Q4',
              args: ['2000 11 30'],
              expected: 'VALID | LEAP | QUARTER Q4',
            },
            {
              id: 'tc-5',
              name: '30-day month overflow (April 31)',
              args: ['2025 4 31'],
              expected: 'INVALID DATE',
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Mid-summer common year date in Q3',
              args: ['2025 8 15'],
              expected: 'VALID | COMMON | QUARTER Q3',
              hidden: true,
            },
          ],
        },
        {
          id: 's1-p2-c3',
          title: 'Freight Zone Quote',
          style: 'leetcode',
          difficulty: 'easy',
          description: `### Problem

Calculate shipping cost in integer cents for a parcel given \`weightKg\`, \`zone\`, and \`fragile\`:

1. If \`weightKg <= 0\`, return \`0\`.
2. Round weight **up** to billable whole kilograms: \`billableKg = Math.ceil(weightKg)\`.
3. Base + per-kg zone rates:
   - \`'local'\`: \`400\` + \`120 * billableKg\`
   - \`'regional'\`: \`700\` + \`250 * billableKg\`
   - \`'international'\`: \`1500\` + \`600 * billableKg\`
4. **Heavy surcharge:** if \`billableKg > 20\`, add \`1000\` cents.
5. **Fragile surcharge:** if \`fragile\` is \`true\`, add \`800\` cents for \`'international'\` or \`500\` cents for other zones.

### Examples

- \`quoteFreightCents(2.3, 'local', false)\` → \`400 + 3 * 120 = 760\`
- \`quoteFreightCents(10, 'international', true)\` → \`1500 + 6000 + 800 = 8300\``,
          tags: ['Switch', 'Union Literals', 'Pricing Logic'],
          hints: [
            'Compute `billableKg = Math.ceil(weightKg)` once after guarding `weightKg <= 0`, and use `billableKg` for both per-kg pricing and the `> 20` heavy check.',
            'Use a `switch (zone)` statement so every `ShippingZone` literal is handled explicitly.',
          ],
          entryFunction: 'quoteFreightCents',
          playgroundInput: '[2.3, "local", false]',
          starterCode: `export type ShippingZone = 'local' | 'regional' | 'international';

export function quoteFreightCents(
  weightKg: number,
  zone: ShippingZone,
  fragile: boolean
): number {
  return 0;
}
`,
          referenceSolution: `export type ShippingZone = 'local' | 'regional' | 'international';

export function quoteFreightCents(
  weightKg: number,
  zone: ShippingZone,
  fragile: boolean
): number {
  if (weightKg <= 0) {
    return 0;
  }

  const billableKg = Math.ceil(weightKg);
  let total = 0;

  switch (zone) {
    case 'local':
      total = 400 + 120 * billableKg;
      break;
    case 'regional':
      total = 700 + 250 * billableKg;
      break;
    case 'international':
      total = 1500 + 600 * billableKg;
      break;
  }

  if (billableKg > 20) {
    total += 1000;
  }

  if (fragile) {
    total += zone === 'international' ? 800 : 500;
  }

  return total;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Fractional local weight rounds up to 3 kg',
              args: [2.3, 'local', false],
              expected: 760,
            },
            {
              id: 'tc-2',
              name: 'Regional fragile parcel',
              args: [5, 'regional', true],
              expected: 2450,
            },
            {
              id: 'tc-3',
              name: 'International fragile parcel',
              args: [10, 'international', true],
              expected: 8300,
            },
            {
              id: 'tc-4',
              name: 'Heavy parcel over 20 billable kg',
              args: [25, 'local', false],
              expected: 4400,
            },
            {
              id: 'tc-5',
              name: 'Zero weight returns 0 even if fragile',
              args: [0, 'international', true],
              expected: 0,
              hidden: true,
            },
            {
              id: 'tc-6',
              name: '20.1 kg rounds to 21 kg and triggers heavy surcharge',
              args: [20.1, 'regional', false],
              expected: 6950,
              hidden: true,
            },
          ],
        },
        {
          id: 's1-p2-c4',
          title: 'Nullish Config Resolver',
          style: 'leetcode',
          difficulty: 'easy',
          description: `### Problem

Normalize an incoming \`RawServerConfig\` into a complete \`ResolvedServerConfig\` without accidentally clobbering intentional \`0\` or \`false\` settings:

- \`port\`: default to \`8080\` when \`null\` or \`undefined\`. Preserve \`0\` (OS ephemeral port!), but if \`port < 0\`, fall back to \`8080\`.
- \`retries\`: default to \`3\` when \`null\` or \`undefined\`. Preserve \`0\`, and clamp negative numbers to \`0\`.
- \`host\`: trim surrounding whitespace; if \`null\`, \`undefined\`, or empty after trimming, default to \`'127.0.0.1'\`.
- \`debug\`: default to \`false\` when \`null\` or \`undefined\`; otherwise keep its boolean value.

### Examples

- \`resolveServerConfig({ port: 0, retries: 0, host: '0.0.0.0', debug: true })\`  
  → \`{ port: 0, retries: 0, host: '0.0.0.0', debug: true }\`
- \`resolveServerConfig({ host: '   ' })\`  
  → \`{ port: 8080, retries: 3, host: '127.0.0.1', debug: false }\``,
          tags: ['Nullish Coalescing', 'Optional Properties', 'Config Defaults'],
          hints: [
            'Using `raw.port || 8080` or `raw.retries || 3` will fail when `0` is passed—use `??` instead.',
            'For `host`, trim `raw.host ?? ""` first and check whether the trimmed string has length `> 0`.',
          ],
          entryFunction: 'resolveServerConfig',
          playgroundInput: '[{"port": 0, "retries": 0, "host": "  ", "debug": true}]',
          starterCode: `export interface RawServerConfig {
  port?: number | null;
  retries?: number | null;
  host?: string | null;
  debug?: boolean | null;
}

export interface ResolvedServerConfig {
  port: number;
  retries: number;
  host: string;
  debug: boolean;
}

export function resolveServerConfig(raw: RawServerConfig): ResolvedServerConfig {
  return {
    port: 8080,
    retries: 3,
    host: '127.0.0.1',
    debug: false,
  };
}
`,
          referenceSolution: `export interface RawServerConfig {
  port?: number | null;
  retries?: number | null;
  host?: string | null;
  debug?: boolean | null;
}

export interface ResolvedServerConfig {
  port: number;
  retries: number;
  host: string;
  debug: boolean;
}

export function resolveServerConfig(raw: RawServerConfig): ResolvedServerConfig {
  const candidatePort = raw.port ?? 8080;
  const port = candidatePort < 0 ? 8080 : candidatePort;

  const candidateRetries = raw.retries ?? 3;
  const retries = Math.max(0, candidateRetries);

  const trimmedHost = (raw.host ?? '').trim();
  const host = trimmedHost.length > 0 ? trimmedHost : '127.0.0.1';

  const debug = raw.debug ?? false;

  return { port, retries, host, debug };
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Empty config applies all defaults',
              args: [{}],
              expected: { port: 8080, retries: 3, host: '127.0.0.1', debug: false },
            },
            {
              id: 'tc-2',
              name: 'Preserves explicit 0 port and 0 retries',
              args: [{ port: 0, retries: 0, host: '0.0.0.0', debug: true }],
              expected: { port: 0, retries: 0, host: '0.0.0.0', debug: true },
            },
            {
              id: 'tc-3',
              name: 'Null fields and whitespace-only host fall back cleanly',
              args: [{ port: null, retries: null, host: '   ', debug: null }],
              expected: { port: 8080, retries: 3, host: '127.0.0.1', debug: false },
            },
            {
              id: 'tc-4',
              name: 'Trims valid host and preserves explicit false',
              args: [{ port: 3000, retries: 5, host: ' api.internal ', debug: false }],
              expected: { port: 3000, retries: 5, host: 'api.internal', debug: false },
            },
            {
              id: 'tc-5',
              name: 'Negative port resets to 8080 and negative retries clamp to 0',
              args: [{ port: -1, retries: -4, host: '' }],
              expected: { port: 8080, retries: 0, host: '127.0.0.1', debug: false },
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Partial override with HTTPS port and zero retries',
              args: [{ port: 443, retries: 0 }],
              expected: { port: 443, retries: 0, host: '127.0.0.1', debug: false },
              hidden: true,
            },
          ],
        },
      ],
    },
    {
      id: 's1-p3',
      number: 3,
      title: 'Loops, Accumulators & Sequence Patterns',
      subtitle: 'Iterative series, state transitions, unordered range bounds, and fencepost safety',
      conceptSummary: `Iterative algorithms rely on clear loop invariants: what your accumulator represents before, during, and after the final iteration.

- **Unordered Ranges:** In competitive I/O, bounds \`A\` and \`B\` may arrive with \`A > B\`; normalize with \`Math.min(A, B)\` and \`Math.max(A, B)\`.
- **Fencepost / Trailing State:** When tracking contiguous streaks inside a loop, always check whether an active streak is still open when the loop finishes.`,
      challenges: [
        {
          id: 's1-p3-c1',
          title: 'Alternating Square-Step Series',
          style: 'leetcode',
          difficulty: 'beginner',
          description: `### Problem

Given an integer \`n\`, compute the alternating square sum:

$$S(n) = 1^2 - 2^2 + 3^2 - 4^2 + \\dots + (-1)^{n+1} n^2$$

If \`n <= 0\`, return \`0\`.

### Examples

- \`alternatingSeriesSum(1)\` → \`1\`
- \`alternatingSeriesSum(3)\` → \`1 - 4 + 9 = 6\`
- \`alternatingSeriesSum(4)\` → \`1 - 4 + 9 - 16 = -10\``,
          tags: ['For Loop', 'Accumulator', 'Series'],
          hints: [
            'Loop `k` from `1` through `n` inclusive; odd `k` adds `k * k` while even `k` subtracts `k * k`.',
            'Return `0` immediately when `n <= 0`.',
          ],
          entryFunction: 'alternatingSeriesSum',
          playgroundInput: '[4]',
          starterCode: `export function alternatingSeriesSum(n: number): number {
  return 0;
}
`,
          referenceSolution: `export function alternatingSeriesSum(n: number): number {
  if (n <= 0) {
    return 0;
  }

  let sum = 0;
  for (let k = 1; k <= n; k++) {
    const term = k * k;
    sum += k % 2 === 1 ? term : -term;
  }
  return sum;
}
`,
          testCases: [
            { id: 'tc-1', name: 'Single term n = 1', args: [1], expected: 1 },
            { id: 'tc-2', name: 'Two terms n = 2', args: [2], expected: -3 },
            { id: 'tc-3', name: 'Three terms n = 3', args: [3], expected: 6 },
            { id: 'tc-4', name: 'Four terms n = 4', args: [4], expected: -10 },
            { id: 'tc-5', name: 'Non-positive n = 0 returns 0', args: [0], expected: 0, hidden: true },
            { id: 'tc-6', name: 'Seven terms n = 7', args: [7], expected: 28, hidden: true },
          ],
        },
        {
          id: 's1-p3-c2',
          title: 'Hailstone Orbit Metrics',
          style: 'leetcode',
          difficulty: 'easy',
          description: `### Problem

Starting from a positive integer \`start\`, generate the hailstone sequence until reaching \`1\`:

- If the current number is even: \`next = current / 2\`
- If the current number is odd: \`next = 3 * current + 1\`

Return \`{ steps, peak }\`, where \`steps\` is the number of transitions taken to reach \`1\` and \`peak\` is the maximum value visited (including \`start\`). If \`start < 1\`, return \`{ steps: 0, peak: 0 }\`.

### Examples

- \`hailstoneMetrics(1)\` → \`{ steps: 0, peak: 1 }\`
- \`hailstoneMetrics(6)\` → \`6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1\` → \`{ steps: 8, peak: 16 }\``,
          tags: ['While Loop', 'State Tracking', 'Simulation'],
          hints: [
            'Initialize `steps = 0` and `peak = start`, then run `while (current > 1)` updating `current`, `steps`, and `peak`.',
            'Be sure to update `peak = Math.max(peak, current)` after computing each transition.',
          ],
          entryFunction: 'hailstoneMetrics',
          playgroundInput: '[6]',
          starterCode: `export interface OrbitMetrics {
  steps: number;
  peak: number;
}

export function hailstoneMetrics(start: number): OrbitMetrics {
  return { steps: 0, peak: 0 };
}
`,
          referenceSolution: `export interface OrbitMetrics {
  steps: number;
  peak: number;
}

export function hailstoneMetrics(start: number): OrbitMetrics {
  if (start < 1) {
    return { steps: 0, peak: 0 };
  }

  let current = Math.trunc(start);
  let steps = 0;
  let peak = current;

  while (current > 1) {
    current = current % 2 === 0 ? current / 2 : 3 * current + 1;
    steps++;
    if (current > peak) {
      peak = current;
    }
  }

  return { steps, peak };
}
`,
          testCases: [
            { id: 'tc-1', name: 'Start at 1 requires 0 steps', args: [1], expected: { steps: 0, peak: 1 } },
            { id: 'tc-2', name: 'Orbit from 6 peaks at 16 in 8 steps', args: [6], expected: { steps: 8, peak: 16 } },
            { id: 'tc-3', name: 'Orbit from 7 peaks at 52 in 16 steps', args: [7], expected: { steps: 16, peak: 52 } },
            { id: 'tc-4', name: 'Power of two descends straight down', args: [16], expected: { steps: 4, peak: 16 } },
            { id: 'tc-5', name: 'Zero or negative start returns zeros', args: [0], expected: { steps: 0, peak: 0 }, hidden: true },
            { id: 'tc-6', name: 'Orbit from 9', args: [9], expected: { steps: 19, peak: 52 }, hidden: true },
          ],
        },
        {
          id: 's1-p3-c3',
          title: 'Range Divisor Statistics',
          style: 'beecrowd',
          difficulty: 'easy',
          description: `### Problem

Given three space-separated integers \`A B D\` (with \`D > 0\`), inspect every integer in the inclusive interval between \`A\` and \`B\` (note that \`A\` may be greater than \`B\`!) and find all integers divisible by \`D\`.

### Output Format

\`\`\`
COUNT = <number of multiples>
SUM = <sum of multiples>
\`\`\`

### Examples

- \`"1 10 3"\` → multiples \`3, 6, 9\` →
  \`\`\`
  COUNT = 3
  SUM = 18
  \`\`\`
- \`"20 5 5"\` → multiples \`5, 10, 15, 20\` →
  \`\`\`
  COUNT = 4
  SUM = 50
  \`\`\``,
          tags: ['Range Iteration', 'Modulo', 'Beecrowd I/O'],
          hints: [
            'Normalize the interval bounds with `low = Math.min(a, b)` and `high = Math.max(a, b)`.',
            'In JavaScript, `-6 % 3 === -0`, so test divisibility with `n % d === 0` (which is `true` for both `0` and `-0`).',
          ],
          entryFunction: 'solve',
          playgroundInput: '20 5 5',
          starterCode: `export function solve(input: string): string {
  return '';
}
`,
          referenceSolution: `export function solve(input: string): string {
  const [rawA, rawB, rawD] = input.trim().split(/\\s+/);
  const a = Number(rawA);
  const b = Number(rawB);
  const d = Number(rawD);

  const low = Math.min(a, b);
  const high = Math.max(a, b);

  let count = 0;
  let sum = 0;

  for (let n = low; n <= high; n++) {
    if (n % d === 0) {
      count++;
      sum += n;
    }
  }

  return \`COUNT = \${count}\\nSUM = \${sum}\`;
}
`,
          testCases: [
            { id: 'tc-1', name: 'Ascending positive range', args: ['1 10 3'], expected: 'COUNT = 3\nSUM = 18' },
            { id: 'tc-2', name: 'Reversed bounds (A > B)', args: ['20 5 5'], expected: 'COUNT = 4\nSUM = 50' },
            { id: 'tc-3', name: 'Symmetric negative-to-positive range', args: ['-6 6 3'], expected: 'COUNT = 5\nSUM = 0' },
            { id: 'tc-4', name: 'Single multiple inside range', args: ['7 11 10'], expected: 'COUNT = 1\nSUM = 10' },
            { id: 'tc-5', name: 'No multiples in range', args: ['1 4 9'], expected: 'COUNT = 0\nSUM = 0', hidden: true },
            { id: 'tc-6', name: 'Degenerate single-point range (A == B)', args: ['12 12 4'], expected: 'COUNT = 1\nSUM = 12', hidden: true },
          ],
        },
        {
          id: 's1-p3-c4',
          title: 'Fencepost Streak Counter',
          style: 'leetcode',
          difficulty: 'easy',
          description: `### Problem

Given an array of sensor \`readings\`, a \`threshold\`, and a \`minLength\` (\`>= 1\`), count how many **maximal contiguous streaks** of readings with \`value >= threshold\` have length at least \`minLength\`.

### Examples

- \`countThresholdRuns([70, 75, 80, 60, 85, 90], 70, 2)\` → \`2\` (streaks \`[70, 75, 80]\` and \`[85, 90]\`)
- \`countThresholdRuns([90, 95, 100], 80, 3)\` → \`1\` (streak extends to the end of the array)`,
          tags: ['Off-By-One Safety', 'Arrays', 'Streak Counting'],
          hints: [
            'Track `currentRun = 0`. Increment it when `reading >= threshold`; when a reading drops below `threshold`, check `if (currentRun >= minLength)` and reset `currentRun = 0`.',
            'Do not forget the fencepost check after the loop ends in case the array finishes inside a qualifying streak!',
          ],
          entryFunction: 'countThresholdRuns',
          playgroundInput: '[[70, 75, 80, 60, 85, 90], 70, 2]',
          starterCode: `export function countThresholdRuns(
  readings: readonly number[],
  threshold: number,
  minLength: number
): number {
  return 0;
}
`,
          referenceSolution: `export function countThresholdRuns(
  readings: readonly number[],
  threshold: number,
  minLength: number
): number {
  let runs = 0;
  let currentRun = 0;

  for (const value of readings) {
    if (value >= threshold) {
      currentRun++;
    } else {
      if (currentRun >= minLength) {
        runs++;
      }
      currentRun = 0;
    }
  }

  if (currentRun >= minLength) {
    runs++;
  }

  return runs;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Two streaks including trailing streak',
              args: [[70, 75, 80, 60, 85, 90], 70, 2],
              expected: 2,
              checkImmutability: true,
            },
            {
              id: 'tc-2',
              name: 'Stricter minLength filters shorter streak',
              args: [[70, 75, 80, 60, 85, 90], 70, 3],
              expected: 1,
              checkImmutability: true,
            },
            {
              id: 'tc-3',
              name: 'No readings reach threshold',
              args: [[50, 60, 55], 70, 1],
              expected: 0,
              checkImmutability: true,
            },
            {
              id: 'tc-4',
              name: 'Entire array is a single streak',
              args: [[90, 95, 100], 80, 3],
              expected: 1,
              checkImmutability: true,
            },
            {
              id: 'tc-5',
              name: 'Empty input array',
              args: [[], 10, 1],
              expected: 0,
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Alternating single-element streaks',
              args: [[10, 5, 12, 5, 15], 10, 1],
              expected: 3,
              hidden: true,
            },
          ],
        },
      ],
    },
    {
      id: 's1-p4',
      number: 4,
      title: 'Multi-Line Stdin Parsing & Formatted Output',
      subtitle: 'Line-by-line batch processing, CRLF resilience, invoice tables, and padded durations',
      conceptSummary: `Real-world CLI tools and Beecrowd problems process multi-line text batches that may use Unix (\`\\n\`) or Windows (\`\\r\\n\`) line endings.

- **Splitting Lines Safely:** Use \`input.trim().split(/\\r?\\n/)\` and skip empty lines when appropriate.
- **Zero-Padded Fields:** Use \`String(value).padStart(2, '0')\` for clock fields like \`HH:MM:SS\`.`,
      challenges: [
        {
          id: 's1-p4-c1',
          title: 'Warehouse Ledger Batch Balance',
          style: 'beecrowd',
          difficulty: 'easy',
          description: `### Problem

Process a multi-line warehouse stock ledger:

- **Line 1:** Initial integer stock \`S\`.
- **Remaining lines:** Commands of the form \`"IN <qty>"\` or \`"OUT <qty>"\`.
  - \`IN <qty>\` increases stock by \`qty\`.
  - \`OUT <qty>\` decreases stock by \`qty\` **only if** \`qty <= stock\`; otherwise the command is **rejected** (stock is unchanged and the rejected count increments by \`1\`).

### Output Format

\`\`\`
FINAL_STOCK = <stock>
REJECTED = <rejectedCount>
\`\`\`

### Example

**Input:**
\`\`\`
100
IN 40
OUT 60
OUT 90
IN 15
\`\`\`
**Output:**
\`\`\`
FINAL_STOCK = 95
REJECTED = 1
\`\`\``,
          tags: ['Multi-Line Stdin', 'Simulation', 'CRLF Safe'],
          hints: [
            'Split lines using `input.trim().split(/\\r?\\n/)`; line `0` is the starting stock and lines `1..` are operations.',
            'Guard the loop when there are no transaction lines after the initial stock.',
          ],
          entryFunction: 'solve',
          playgroundInput: '100\nIN 40\nOUT 60\nOUT 90\nIN 15',
          starterCode: `export function solve(input: string): string {
  return '';
}
`,
          referenceSolution: `export function solve(input: string): string {
  const lines = input.trim().split(/\\r?\\n/);
  let stock = Number(lines[0]);
  let rejected = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const [op, rawQty] = line.split(/\\s+/);
    const qty = Number(rawQty);

    if (op === 'IN') {
      stock += qty;
    } else if (op === 'OUT') {
      if (qty <= stock) {
        stock -= qty;
      } else {
        rejected++;
      }
    }
  }

  return \`FINAL_STOCK = \${stock}\\nREJECTED = \${rejected}\`;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Mixed IN/OUT with one overdraft rejection',
              args: ['100\nIN 40\nOUT 60\nOUT 90\nIN 15'],
              expected: 'FINAL_STOCK = 95\nREJECTED = 1',
            },
            {
              id: 'tc-2',
              name: 'Exact depletion to zero followed by rejection',
              args: ['10\nOUT 10\nOUT 1'],
              expected: 'FINAL_STOCK = 0\nREJECTED = 1',
            },
            {
              id: 'tc-3',
              name: 'Handles CRLF line endings cleanly',
              args: ['0\r\nIN 25\r\nIN 25\r\nOUT 50'],
              expected: 'FINAL_STOCK = 0\nREJECTED = 0',
            },
            {
              id: 'tc-4',
              name: 'Initial stock with zero commands',
              args: ['50'],
              expected: 'FINAL_STOCK = 50\nREJECTED = 0',
            },
            {
              id: 'tc-5',
              name: 'Multiple rejections before valid withdrawal',
              args: ['5\nOUT 6\nOUT 7\nOUT 5'],
              expected: 'FINAL_STOCK = 0\nREJECTED = 2',
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Zero-quantity operations',
              args: ['20\nIN 0\nOUT 0'],
              expected: 'FINAL_STOCK = 20\nREJECTED = 0',
              hidden: true,
            },
          ],
        },
        {
          id: 's1-p4-c2',
          title: 'Formatted Invoice Line Summary',
          style: 'beecrowd',
          difficulty: 'easy',
          description: `### Problem

Each line of input represents an invoice entry: \`"<CODE> <QTY> <UNIT_PRICE>"\`.

For each entry, compute \`lineTotal = QTY * UNIT_PRICE\` and emit:

\`\`\`
<CODE>: <QTY> x <UNIT_PRICE> = <LINE_TOTAL>
\`\`\`

After all items, emit a final line:

\`\`\`
GRAND TOTAL: <SUM>
\`\`\`

Format \`UNIT_PRICE\`, \`LINE_TOTAL\`, and \`SUM\` to **2 decimal places**.

### Example

**Input:**
\`\`\`
BOLT 10 0.75
WRENCH 2 14.50
\`\`\`
**Output:**
\`\`\`
BOLT: 10 x 0.75 = 7.50
WRENCH: 2 x 14.50 = 29.00
GRAND TOTAL: 36.50
\`\`\``,
          tags: ['String Formatting', 'Batch Parsing', 'Accumulator'],
          hints: [
            'Collect formatted item lines in a `string[]` array, push the `GRAND TOTAL` line at the end, and `.join("\\n")`.',
            'Use `.toFixed(2)` on `unitPrice`, `lineTotal`, and `grandTotal`.',
          ],
          entryFunction: 'solve',
          playgroundInput: 'BOLT 10 0.75\nWRENCH 2 14.50',
          starterCode: `export function solve(input: string): string {
  return '';
}
`,
          referenceSolution: `export function solve(input: string): string {
  const lines = input.trim().split(/\\r?\\n/);
  const output: string[] = [];
  let grandTotal = 0;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;
    const [code, rawQty, rawPrice] = trimmed.split(/\\s+/);
    const qty = Number(rawQty);
    const unitPrice = Number(rawPrice);
    const lineTotal = qty * unitPrice;
    grandTotal += lineTotal;
    output.push(\`\${code}: \${qty} x \${unitPrice.toFixed(2)} = \${lineTotal.toFixed(2)}\`);
  }

  output.push(\`GRAND TOTAL: \${grandTotal.toFixed(2)}\`);
  return output.join('\\n');
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Two hardware items',
              args: ['BOLT 10 0.75\nWRENCH 2 14.50'],
              expected: 'BOLT: 10 x 0.75 = 7.50\nWRENCH: 2 x 14.50 = 29.00\nGRAND TOTAL: 36.50',
            },
            {
              id: 'tc-2',
              name: 'Single item invoice',
              args: ['CABLE 1 9.99'],
              expected: 'CABLE: 1 x 9.99 = 9.99\nGRAND TOTAL: 9.99',
            },
            {
              id: 'tc-3',
              name: 'CRLF input lines',
              args: ['PAD 4 2.50\r\nPEN 3 1.20'],
              expected: 'PAD: 4 x 2.50 = 10.00\nPEN: 3 x 1.20 = 3.60\nGRAND TOTAL: 13.60',
            },
            {
              id: 'tc-4',
              name: 'Zero quantity sample line',
              args: ['SAMPLE 0 50.00'],
              expected: 'SAMPLE: 0 x 50.00 = 0.00\nGRAND TOTAL: 0.00',
            },
            {
              id: 'tc-5',
              name: 'Whole-number unit prices still print .00',
              args: ['A 2 10\nB 5 4\nC 1 0.5'],
              expected: 'A: 2 x 10.00 = 20.00\nB: 5 x 4.00 = 20.00\nC: 1 x 0.50 = 0.50\nGRAND TOTAL: 40.50',
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Bulk small-cent item',
              args: ['NUT 100 0.05'],
              expected: 'NUT: 100 x 0.05 = 5.00\nGRAND TOTAL: 5.00',
              hidden: true,
            },
          ],
        },
        {
          id: 's1-p4-c3',
          title: 'Sensor Batch Anomaly Summary',
          style: 'beecrowd',
          difficulty: 'medium',
          description: `### Problem

Audit a batch of greenhouse sensor readings against safe operating bounds:

- **Line 1:** \`"<MIN> <MAX>"\` inclusive safe range.
- **Subsequent lines:** \`"<SENSOR_ID> <VALUE>"\`.

Readings within \`[MIN, MAX]\` inclusive count as **valid**; readings strictly outside \`[MIN, MAX]\` trigger an **alert**.

### Output Format

\`\`\`
VALID = <validCount>
MEAN = <mean of valid readings toFixed(2), or N/A if validCount === 0>
ALERTS = <comma-separated SENSOR_IDs in input order, or NONE>
\`\`\`

### Example

**Input:**
\`\`\`
18.0 26.0
S1 22.5
S2 27.1
S3 19.5
\`\`\`
**Output:**
\`\`\`
VALID = 2
MEAN = 21.00
ALERTS = S2
\`\`\``,
          tags: ['Data Filtering', 'Batch Summary', 'Edge Cases'],
          hints: [
            'Guard division by zero: when `validCount === 0`, output `MEAN = N/A`.',
            'Format `ALERTS` with `alerts.length > 0 ? alerts.join(",") : "NONE"`.',
          ],
          entryFunction: 'solve',
          playgroundInput: '18.0 26.0\nS1 22.5\nS2 27.1\nS3 19.5',
          starterCode: `export function solve(input: string): string {
  return '';
}
`,
          referenceSolution: `export function solve(input: string): string {
  const lines = input.trim().split(/\\r?\\n/);
  const [rawMin, rawMax] = lines[0].trim().split(/\\s+/);
  const minVal = Number(rawMin);
  const maxVal = Number(rawMax);

  let validCount = 0;
  let validSum = 0;
  const alerts: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const [sensorId, rawValue] = line.split(/\\s+/);
    const val = Number(rawValue);

    if (val >= minVal && val <= maxVal) {
      validCount++;
      validSum += val;
    } else {
      alerts.push(sensorId);
    }
  }

  const meanStr = validCount === 0 ? 'N/A' : (validSum / validCount).toFixed(2);
  const alertStr = alerts.length === 0 ? 'NONE' : alerts.join(',');

  return \`VALID = \${validCount}\\nMEAN = \${meanStr}\\nALERTS = \${alertStr}\`;
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'Mixed valid and high-temperature alert',
              args: ['18.0 26.0\nS1 22.5\nS2 27.1\nS3 19.5'],
              expected: 'VALID = 2\nMEAN = 21.00\nALERTS = S2',
            },
            {
              id: 'tc-2',
              name: 'Exact boundary values are valid',
              args: ['10 20\nA1 10\nA2 20'],
              expected: 'VALID = 2\nMEAN = 15.00\nALERTS = NONE',
            },
            {
              id: 'tc-3',
              name: 'All out-of-range produces N/A mean',
              args: ['0 5\nX1 -1.5\nX2 8.2'],
              expected: 'VALID = 0\nMEAN = N/A\nALERTS = X1,X2',
            },
            {
              id: 'tc-4',
              name: 'Negative bounds and CRLF endings',
              args: ['-10 10\r\nT1 -5\r\nT2 5\r\nT3 15\r\nT4 -12'],
              expected: 'VALID = 2\nMEAN = 0.00\nALERTS = T3,T4',
            },
            {
              id: 'tc-5',
              name: 'Single valid reading',
              args: ['50 100\nP1 75.25'],
              expected: 'VALID = 1\nMEAN = 75.25\nALERTS = NONE',
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Tight decimal boundaries',
              args: ['1 2\nZ1 0.99\nZ2 2.01\nZ3 1.50'],
              expected: 'VALID = 1\nMEAN = 1.50\nALERTS = Z1,Z2',
              hidden: true,
            },
          ],
        },
        {
          id: 's1-p4-c4',
          title: 'Broadcast Duration Formatter',
          style: 'leetcode',
          difficulty: 'easy',
          description: `### Problem

Convert \`totalSeconds\` into a zero-padded broadcast clock string:

1. Clamp negative inputs to \`0\` and drop fractional seconds via \`Math.floor(Math.max(0, totalSeconds))\`.
2. Let \`1 day = 86400\` seconds, \`1 hour = 3600\` seconds, \`1 minute = 60\` seconds.
3. If \`days > 0\`, return \`"<days>d <HH>:<MM>:<SS>"\`; otherwise return \`"<HH>:<MM>:<SS>"\`, where \`HH\`, \`MM\`, and \`SS\` are always 2 digits.

### Examples

- \`formatDurationHMS(65)\` → \`"00:01:05"\`
- \`formatDurationHMS(90061)\` → \`"1d 01:01:01"\``,
          tags: ['Integer Division', 'padStart', 'Time Formatting'],
          hints: [
            'Extract `days = Math.floor(sec / 86400)` and `rem = sec % 86400`, then repeat for `3600` and `60`.',
            'Write a tiny helper `pad2(n: number): string` using `String(n).padStart(2, "0")`.',
          ],
          entryFunction: 'formatDurationHMS',
          playgroundInput: '[90061]',
          starterCode: `export function formatDurationHMS(totalSeconds: number): string {
  return '00:00:00';
}
`,
          referenceSolution: `function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function formatDurationHMS(totalSeconds: number): string {
  const sec = Math.floor(Math.max(0, totalSeconds));
  const days = Math.floor(sec / 86400);
  const afterDays = sec % 86400;
  const hours = Math.floor(afterDays / 3600);
  const afterHours = afterDays % 3600;
  const minutes = Math.floor(afterHours / 60);
  const seconds = afterHours % 60;

  const hms = \`\${pad2(hours)}:\${pad2(minutes)}:\${pad2(seconds)}\`;
  return days > 0 ? \`\${days}d \${hms}\` : hms;
}
`,
          testCases: [
            { id: 'tc-1', name: 'Zero seconds', args: [0], expected: '00:00:00' },
            { id: 'tc-2', name: 'Minutes and seconds padding', args: [65], expected: '00:01:05' },
            { id: 'tc-3', name: 'One hour, one minute, one second', args: [3661], expected: '01:01:01' },
            { id: 'tc-4', name: 'Multi-day prefix format', args: [90061], expected: '1d 01:01:01' },
            { id: 'tc-5', name: 'One second shy of a full day', args: [86399], expected: '23:59:59', hidden: true },
            { id: 'tc-6', name: 'Truncates fractional seconds cleanly', args: [172800.9], expected: '2d 00:00:00', hidden: true },
          ],
        },
      ],
    },
    {
      id: 's1-p5',
      number: 5,
      title: 'Tuples, Readonly Primitives & Strict Type Safety',
      subtitle: 'Fixed-length coordinate tuples, RGB hex parsing, runtime typeof narrowing, and tuple type queries',
      conceptSummary: `Unlike \`number[]\` (which allows any length), a **tuple** like \`readonly [number, number]\` locks both the exact element count and the type at each position.

- **\`readonly\` Tuples:** Prevent accidental \`.push()\` or index reassignment on coordinate pairs and RGB triples.
- **\`typeof\` Guards:** Narrow \`string | number | boolean | null | undefined\` safely at runtime before performing arithmetic.`,
      challenges: [
        {
          id: 's1-p5-c1',
          title: 'Immutable 2D Tuple Vector Step',
          style: 'leetcode',
          difficulty: 'easy',
          description: `### Problem

Simulate a sequence of cardinal movements starting from \`origin: Point2D\` (\`readonly [number, number]\`):

- \`['N', d]\` increases \`y\` by \`d\`
- \`['S', d]\` decreases \`y\` by \`d\`
- \`['E', d]\` increases \`x\` by \`d\`
- \`['W', d]\` decreases \`x\` by \`d\`

Return the final \`[x, y]\` tuple without mutating \`origin\` or \`moves\`.

### Example

- \`stepPoint2D([0, 0], [['N', 3], ['E', 4]])\` → \`[4, 3]\``,
          tags: ['Readonly Tuples', 'Immutability', 'Coordinates'],
          hints: [
            'Destructure `let [x, y] = origin;` and iterate over `const [dir, dist] of moves`.',
            'Return `[x, y]` as a fresh 2-element tuple.',
          ],
          entryFunction: 'stepPoint2D',
          playgroundInput: '[[0, 0], [["N", 3], ["E", 4]]]',
          starterCode: `export type Point2D = readonly [number, number];
export type CardinalMove = readonly ['N' | 'S' | 'E' | 'W', number];

export function stepPoint2D(
  origin: Point2D,
  moves: readonly CardinalMove[]
): Point2D {
  return [0, 0];
}
`,
          referenceSolution: `export type Point2D = readonly [number, number];
export type CardinalMove = readonly ['N' | 'S' | 'E' | 'W', number];

export function stepPoint2D(
  origin: Point2D,
  moves: readonly CardinalMove[]
): Point2D {
  let [x, y] = origin;

  for (const [dir, dist] of moves) {
    switch (dir) {
      case 'N':
        y += dist;
        break;
      case 'S':
        y -= dist;
        break;
      case 'E':
        x += dist;
        break;
      case 'W':
        x -= dist;
        break;
    }
  }

  return [x, y];
}
`,
          testCases: [
            {
              id: 'tc-1',
              name: 'North then East from origin',
              args: [[0, 0], [['N', 3], ['E', 4]]],
              expected: [4, 3],
              checkImmutability: true,
            },
            {
              id: 'tc-2',
              name: 'Crosses into negative quadrant',
              args: [[10, -5], [['W', 12], ['S', 5], ['N', 2]]],
              expected: [-2, -8],
              checkImmutability: true,
            },
            {
              id: 'tc-3',
              name: 'Empty move list returns origin coordinates',
              args: [[3, 7], []],
              expected: [3, 7],
              checkImmutability: true,
            },
            {
              id: 'tc-4',
              name: 'Closed loop returns to start',
              args: [[0, 0], [['E', 5], ['W', 5], ['N', 5], ['S', 5]]],
              expected: [0, 0],
              checkImmutability: true,
            },
            {
              id: 'tc-5',
              name: 'Zero-distance move mixed with West',
              args: [[-4, 2], [['N', 0], ['W', 6]]],
              expected: [-10, 2],
              checkImmutability: true,
              hidden: true,
            },
            {
              id: 'tc-6',
              name: 'Large step displacement',
              args: [[100, 200], [['S', 250], ['E', 50]]],
              expected: [150, -50],
              checkImmutability: true,
              hidden: true,
            },
          ],
        },
        {
          id: 's1-p5-c2',
          title: 'Strict Hex RGB Tuple Parser',
          style: 'leetcode',
          difficulty: 'easy',
          description: `### Problem

Parse a CSS-style hexadecimal color string into an \`RgbTuple\` (\`[number, number, number]\`) of integers in \`0..255\`, or return \`null\` if invalid:

- Trim leading/trailing whitespace and strip an optional leading \`'#'\`.
- Support both **6-digit** (\`RRGGBB\`) and **3-digit shorthand** (\`RGB\`, where each hex digit doubles, e.g. \`'09c'\` → \`'0099cc'\`), case-insensitive.
- If the remaining characters are not strictly 3 or 6 valid hex digits (\`0-9\`, \`a-f\`, \`A-F\`), return \`null\`.

### Examples

- \`parseHexRgb('#61afef')\` → \`[97, 175, 239]\`
- \`parseHexRgb('#fff')\` → \`[255, 255, 255]\`
- \`parseHexRgb('#12G456')\` → \`null\``,
          tags: ['Tuples', 'Hex Parsing', 'Validation'],
          hints: [
            'Validate the cleaned string with `/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/` before calling `Number.parseInt(slice, 16)`.',
            'Expand 3-character hex `c` into `c[0] + c[0] + c[1] + c[1] + c[2] + c[2]`.',
          ],
          entryFunction: 'parseHexRgb',
          playgroundInput: '["#61afef"]',
          starterCode: `export type RgbTuple = [number, number, number];

export function parseHexRgb(hex: string): RgbTuple | null {
  return null;
}
`,
          referenceSolution: `export type RgbTuple = [number, number, number];

export function parseHexRgb(hex: string): RgbTuple | null {
  const trimmed = hex.trim();
  const raw = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;

  if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(raw)) {
    return null;
  }

  const full =
    raw.length === 3
      ? \`\${raw[0]}\${raw[0]}\${raw[1]}\${raw[1]}\${raw[2]}\${raw[2]}\`
      : raw;

  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);

  return [r, g, b];
}
`,
          testCases: [
            { id: 'tc-1', name: '6-digit lowercase hex with #', args: ['#61afef'], expected: [97, 175, 239] },
            { id: 'tc-2', name: '3-digit shorthand white', args: ['#fff'], expected: [255, 255, 255] },
            { id: 'tc-3', name: '6-digit uppercase without #', args: ['00FF80'], expected: [0, 255, 128] },
            { id: 'tc-4', name: 'Non-hex character returns null', args: ['#12G456'], expected: null },
            { id: 'tc-5', name: 'Padded 3-digit shorthand #09c', args: [' #09c '], expected: [0, 153, 204], hidden: true },
            { id: 'tc-6', name: 'Invalid 5-digit length returns null', args: ['#12345'], expected: null, hidden: true },
          ],
        },
        {
          id: 's1-p5-c3',
          title: 'Runtime typeof Metric Normalizer',
          style: 'leetcode',
          difficulty: 'easy',
          description: `### Problem

Telemetry payloads arrive from heterogeneous clients as \`string | number | boolean | null | undefined\`. Use runtime \`typeof\` narrowing to normalize \`raw\` into a finite \`number\` or \`null\`:

- \`number\`: return \`raw\` if \`Number.isFinite(raw)\`, otherwise \`null\`.
- \`boolean\`: return \`1\` for \`true\` and \`0\` for \`false\`.
- \`string\`: trim whitespace; if empty return \`null\`; parse with \`Number(trimmed)\` and return it if finite, otherwise \`null\`.
- \`null\` or \`undefined\`: return \`null\`.

### Examples

- \`normalizeMetricInput(' -18.25 ')\` → \`-18.25\`
- \`normalizeMetricInput(true)\` → \`1\`
- \`normalizeMetricInput('12px')\` → \`null\``,
          tags: ['typeof Narrowing', 'Union Types', 'Number.isFinite'],
          hints: [
            'Check `typeof raw === "number"`, `typeof raw === "boolean"`, and `typeof raw === "string"` in order.',
            'Remember `Number("   ")` evaluates to `0` in JavaScript—always check `trimmed.length === 0` before calling `Number(trimmed)`!',
          ],
          entryFunction: 'normalizeMetricInput',
          astRules: { requireTypeNarrowing: true },
          playgroundInput: '[" -18.25 "]',
          starterCode: `export function normalizeMetricInput(
  raw: string | number | boolean | null | undefined
): number | null {
  return null;
}
`,
          referenceSolution: `export function normalizeMetricInput(
  raw: string | number | boolean | null | undefined
): number | null {
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? raw : null;
  }
  if (typeof raw === 'boolean') {
    return raw ? 1 : 0;
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      return null;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
`,
          testCases: [
            { id: 'tc-1', name: 'Finite number passes through', args: [42.5], expected: 42.5 },
            { id: 'tc-2', name: 'Padded numeric string parses cleanly', args: ['  -18.25 '], expected: -18.25 },
            { id: 'tc-3', name: 'Boolean true becomes 1', args: [true], expected: 1 },
            { id: 'tc-4', name: 'Boolean false becomes 0', args: [false], expected: 0 },
            { id: 'tc-5', name: 'Whitespace-only string returns null (not 0)', args: ['   '], expected: null, hidden: true },
            { id: 'tc-6', name: 'Unit-suffixed string returns null', args: ['12px'], expected: null, hidden: true },
          ],
        },
        {
          id: 's1-p5-c4',
          title: 'Tuple Length & Head Type Queries',
          style: 'type-challenge',
          difficulty: 'easy',
          description: `### Problem

Implement two generic tuple helper types that work on both mutable and \`readonly\` tuples:

1. \`TupleLength<T extends readonly unknown[]>\`: extracts the exact literal length of \`T\` (e.g. \`TupleLength<['a', 'b', 'c']>\` is \`3\`).
2. \`FirstOrNever<T extends readonly unknown[]>\`: extracts the type of the first element of \`T\`, or \`never\` when \`T\` is an empty tuple \`[]\`.

### Examples

\`\`\`ts
type L = TupleLength<readonly [10, 20]>; // 2
type H = FirstOrNever<[string, number]>; // string
type E = FirstOrNever<[]>;               // never
\`\`\``,
          tags: ['Tuple Types', 'Indexed Access', 'Type Inference'],
          hints: [
            'Every tuple exposes its literal length via the indexed access type `T["length"]`.',
            'Use `T extends readonly [infer First, ...unknown[]] ? First : never` (or check `T extends readonly [] ? never : T[0]`).',
          ],
          astRules: { requireGenerics: true },
          starterCode: `export type TupleLength<T extends readonly unknown[]> = number;

export type FirstOrNever<T extends readonly unknown[]> = unknown;
`,
          referenceSolution: `export type TupleLength<T extends readonly unknown[]> = T['length'];

export type FirstOrNever<T extends readonly unknown[]> =
  T extends readonly [infer First, ...unknown[]] ? First : never;
`,
          typeAssertionPrelude: `import type { TupleLength, FirstOrNever } from './solution';`,
          typeAssertions: [
            {
              id: 'ta-1',
              name: 'TupleLength of 3-element tuple is 3',
              assertion: `Expect<Equal<TupleLength<['a', 'b', 'c']>, 3>>`,
            },
            {
              id: 'ta-2',
              name: 'TupleLength of empty readonly tuple is 0',
              assertion: `Expect<Equal<TupleLength<readonly []>, 0>>`,
            },
            {
              id: 'ta-3',
              name: 'FirstOrNever extracts first tuple member',
              assertion: `Expect<Equal<FirstOrNever<[number, string, boolean]>, number>>`,
            },
            {
              id: 'ta-4',
              name: 'FirstOrNever works on readonly singleton tuple',
              assertion: `Expect<Equal<FirstOrNever<readonly ['only']>, 'only'>>`,
            },
            {
              id: 'ta-5',
              name: 'FirstOrNever on empty tuple resolves to never',
              assertion: `Expect<Equal<FirstOrNever<[]>, never>>`,
              hidden: true,
            },
            {
              id: 'ta-6',
              name: 'TupleLength of 5-element readonly tuple is 5',
              assertion: `Expect<Equal<TupleLength<readonly [1, 2, 3, 4, 5]>, 5>>`,
              hidden: true,
            },
          ],
          testCases: [],
        },
      ],
    },
  ],
  miniProject: {
    id: 's1-mp',
    title: 'CLI Receipt, Discount & Tax Engine',
    subtitle: '4-module billing engine with tiered subtotal discounts, promo codes, and category tax exemptions',
    difficulty: 'medium',
    description: `### Mini-Project Overview

Build a deterministic 4-file **Receipt, Discount & Tax Engine** that computes integer-cent subtotals, tiered volume discounts, promo codes, and category-aware sales taxes before rendering a clean CLI receipt.

### Business Rules

1. **Active Line Items (\`engine.ts\`):** Ignore items with \`qty <= 0\`. If no active items remain, return:
   \`\`\`
   RECEIPT
   (empty cart)
   TOTAL: $0.00
   \`\`\`
2. **Tiered Subtotal Discount (\`discounts.ts\`):**
   - \`subtotalCents >= 20000\` ($200.00+): \`Math.round(subtotalCents * 0.10)\` (10%)
   - \`subtotalCents >= 10000\` ($100.00+): \`Math.round(subtotalCents * 0.05)\` (5%)
   - Otherwise: \`0\`
3. **Promo Code Discount (\`discounts.ts\`):** Applied to \`afterTierCents = subtotalCents - tierDiscountCents\`:
   - \`'NONE'\` (default when omitted): \`0\`
   - \`'SAVE10'\`: \`Math.round(afterTierCents * 0.10)\`
   - \`'FLAT500'\`: \`Math.min(500, afterTierCents)\`
   - \`'VIP15'\`: \`Math.round(afterTierCents * 0.15)\`
   - \`totalDiscountCents = tierDiscountCents + promoDiscountCents\`
4. **Category Tax Rates & Proportional Tax (\`taxes.ts\`):**
   - \`'food'\`: \`0\` bps (exempt)
   - \`'books'\`: \`0\` bps (exempt)
   - \`'apparel'\`: \`500\` bps (5%)
   - \`'electronics'\`: \`1000\` bps (10%)
   - Discounts reduce taxable amounts proportionally across the cart: let \`taxableRatio = (subtotalCents - totalDiscountCents) / subtotalCents\`, sum \`lineCents * taxableRatio * (bps / 10000)\` across active items, and round once with \`Math.round(...)\`.
5. **Receipt Output Format (\`engine.ts\`):**
   \`\`\`
   RECEIPT
   <name> (<category>) x<qty>: $<lineDollars>
   ...
   SUBTOTAL: $<subtotal>
   DISCOUNT: -$<totalDiscount>
   TAX: $<tax>
   TOTAL: $<subtotal - totalDiscount + tax>
   \`\`\``,
    architectureNotes: `- \`types.ts\`: Domain union literals (\`ItemCategory\`, \`PromoCode\`) and readonly input interfaces.
- \`discounts.ts\`: Pure integer-cent functions \`computeTierDiscountCents\` and \`computePromoDiscountCents\`.
- \`taxes.ts\`: Category basis-point lookup \`getCategoryTaxBps\` and proportional tax calculator \`computeTaxCents\`.
- \`engine.ts\`: Currency formatter \`formatCents\` and orchestrator \`generateReceipt(request)\`.`,
    tags: ['Multi-File Architecture', 'Integer Cents', 'Tax & Discounts', 'Formatted Receipt'],
    hints: [
      'Implement `discounts.ts` and `taxes.ts` first, importing shared types with `import type { ... } from "./types"`.',
      'In `formatCents(cents)`, `(cents / 100).toFixed(2)` converts integer cents like `1250` into `"12.50"`.',
      'Always display `DISCOUNT: -$<amount>` even when the discount is `$0.00` (e.g. `DISCOUNT: -$0.00`).',
    ],
    entryFile: 'engine.ts',
    entryFunction: 'generateReceipt',
    playgroundInput: JSON.stringify(
      {
        promo: 'SAVE10',
        items: [
          { name: 'Mechanical Keyboard', category: 'electronics', qty: 1, unitCents: 12000 },
          { name: 'TypeScript Handbook', category: 'books', qty: 1, unitCents: 3000 },
        ],
      },
      null,
      2
    ),
    files: [
      {
        path: 'types.ts',
        description: 'Domain literal types and receipt request interfaces',
        starterCode: `export type ItemCategory = 'food' | 'books' | 'electronics' | 'apparel';

export type PromoCode = 'NONE' | 'SAVE10' | 'FLAT500' | 'VIP15';

export interface ReceiptLineInput {
  readonly name: string;
  readonly category: ItemCategory;
  readonly qty: number;
  readonly unitCents: number;
}

export interface ReceiptRequest {
  readonly items: readonly ReceiptLineInput[];
  readonly promo?: PromoCode;
}
`,
        referenceSolution: `export type ItemCategory = 'food' | 'books' | 'electronics' | 'apparel';

export type PromoCode = 'NONE' | 'SAVE10' | 'FLAT500' | 'VIP15';

export interface ReceiptLineInput {
  readonly name: string;
  readonly category: ItemCategory;
  readonly qty: number;
  readonly unitCents: number;
}

export interface ReceiptRequest {
  readonly items: readonly ReceiptLineInput[];
  readonly promo?: PromoCode;
}
`,
      },
      {
        path: 'discounts.ts',
        description: 'Tiered volume discount and promo code calculations in integer cents',
        starterCode: `import type { PromoCode } from './types';

export function computeTierDiscountCents(subtotalCents: number): number {
  // 10% for >= 20000, 5% for >= 10000, else 0
  return 0;
}

export function computePromoDiscountCents(afterTierCents: number, promo: PromoCode): number {
  // Handle NONE, SAVE10, FLAT500, and VIP15
  return 0;
}
`,
        referenceSolution: `import type { PromoCode } from './types';

export function computeTierDiscountCents(subtotalCents: number): number {
  if (subtotalCents >= 20000) {
    return Math.round(subtotalCents * 0.1);
  }
  if (subtotalCents >= 10000) {
    return Math.round(subtotalCents * 0.05);
  }
  return 0;
}

export function computePromoDiscountCents(afterTierCents: number, promo: PromoCode): number {
  if (afterTierCents <= 0) {
    return 0;
  }
  switch (promo) {
    case 'NONE':
      return 0;
    case 'SAVE10':
      return Math.round(afterTierCents * 0.1);
    case 'FLAT500':
      return Math.min(500, afterTierCents);
    case 'VIP15':
      return Math.round(afterTierCents * 0.15);
  }
}
`,
      },
      {
        path: 'taxes.ts',
        description: 'Category tax basis points and proportional post-discount tax calculation',
        starterCode: `import type { ItemCategory, ReceiptLineInput } from './types';

export function getCategoryTaxBps(category: ItemCategory): number {
  // food & books: 0, apparel: 500, electronics: 1000
  return 0;
}

export function computeTaxCents(
  activeItems: readonly ReceiptLineInput[],
  subtotalCents: number,
  totalDiscountCents: number
): number {
  return 0;
}
`,
        referenceSolution: `import type { ItemCategory, ReceiptLineInput } from './types';

export function getCategoryTaxBps(category: ItemCategory): number {
  switch (category) {
    case 'food':
    case 'books':
      return 0;
    case 'apparel':
      return 500;
    case 'electronics':
      return 1000;
  }
}

export function computeTaxCents(
  activeItems: readonly ReceiptLineInput[],
  subtotalCents: number,
  totalDiscountCents: number
): number {
  if (subtotalCents <= 0) {
    return 0;
  }

  const taxableRatio = (subtotalCents - totalDiscountCents) / subtotalCents;
  let rawTax = 0;

  for (const item of activeItems) {
    const lineCents = item.qty * item.unitCents;
    const bps = getCategoryTaxBps(item.category);
    rawTax += lineCents * taxableRatio * (bps / 10000);
  }

  return Math.round(rawTax);
}
`,
      },
      {
        path: 'engine.ts',
        description: 'Receipt orchestrator and currency formatting entry point',
        starterCode: `import type { ReceiptRequest } from './types';
import { computePromoDiscountCents, computeTierDiscountCents } from './discounts';
import { computeTaxCents } from './taxes';

export function formatCents(cents: number): string {
  return '$0.00';
}

export function generateReceipt(request: ReceiptRequest): string {
  void computeTierDiscountCents;
  void computePromoDiscountCents;
  void computeTaxCents;
  return '';
}
`,
        referenceSolution: `import type { ReceiptRequest } from './types';
import { computePromoDiscountCents, computeTierDiscountCents } from './discounts';
import { computeTaxCents } from './taxes';

export function formatCents(cents: number): string {
  return \`$\${(cents / 100).toFixed(2)}\`;
}

export function generateReceipt(request: ReceiptRequest): string {
  const activeItems = request.items.filter((item) => item.qty > 0);

  if (activeItems.length === 0) {
    return ['RECEIPT', '(empty cart)', 'TOTAL: $0.00'].join('\\n');
  }

  const lines: string[] = ['RECEIPT'];
  let subtotalCents = 0;

  for (const item of activeItems) {
    const lineCents = item.qty * item.unitCents;
    subtotalCents += lineCents;
    lines.push(\`\${item.name} (\${item.category}) x\${item.qty}: \${formatCents(lineCents)}\`);
  }

  const tierDiscount = computeTierDiscountCents(subtotalCents);
  const afterTier = subtotalCents - tierDiscount;
  const promoDiscount = computePromoDiscountCents(afterTier, request.promo ?? 'NONE');
  const totalDiscount = tierDiscount + promoDiscount;

  const taxCents = computeTaxCents(activeItems, subtotalCents, totalDiscount);
  const finalTotalCents = subtotalCents - totalDiscount + taxCents;

  lines.push(\`SUBTOTAL: \${formatCents(subtotalCents)}\`);
  lines.push(\`DISCOUNT: -\${formatCents(totalDiscount)}\`);
  lines.push(\`TAX: \${formatCents(taxCents)}\`);
  lines.push(\`TOTAL: \${formatCents(finalTotalCents)}\`);

  return lines.join('\\n');
}
`,
      },
    ],
    testCases: [
      {
        id: 'mp-tc-1',
        name: 'Tax-exempt items below discount tier',
        args: [
          {
            items: [
              { name: 'Organic Apples', category: 'food', qty: 3, unitCents: 400 },
              { name: 'Pocket Atlas', category: 'books', qty: 1, unitCents: 1800 },
            ],
          },
        ],
        expected: [
          'RECEIPT',
          'Organic Apples (food) x3: $12.00',
          'Pocket Atlas (books) x1: $18.00',
          'SUBTOTAL: $30.00',
          'DISCOUNT: -$0.00',
          'TAX: $0.00',
          'TOTAL: $30.00',
        ].join('\n'),
      },
      {
        id: 'mp-tc-2',
        name: '5% tier discount + SAVE10 promo with mixed tax exemptions',
        args: [
          {
            promo: 'SAVE10',
            items: [
              { name: 'Mechanical Keyboard', category: 'electronics', qty: 1, unitCents: 12000 },
              { name: 'TypeScript Handbook', category: 'books', qty: 1, unitCents: 8000 },
            ],
          },
        ],
        // subtotal = 20000 -> tier 10% = 2000 -> afterTier = 18000 -> SAVE10 = 1800 -> totalDiscount = 3800
        // remaining ratio = 16200 / 20000 = 0.81
        // electronics 12000 * 0.81 * 0.10 = 972 cents, books = 0 -> total = 16200 + 972 = 17172
        expected: [
          'RECEIPT',
          'Mechanical Keyboard (electronics) x1: $120.00',
          'TypeScript Handbook (books) x1: $80.00',
          'SUBTOTAL: $200.00',
          'DISCOUNT: -$38.00',
          'TAX: $9.72',
          'TOTAL: $171.72',
        ].join('\n'),
      },
      {
        id: 'mp-tc-3',
        name: '5% subtotal bracket ($100) with apparel 5% tax and no promo',
        args: [
          {
            promo: 'NONE',
            items: [{ name: 'Merino Hoodie', category: 'apparel', qty: 2, unitCents: 5000 }],
          },
        ],
        // subtotal = 10000 -> tier 5% = 500 -> after = 9500 -> apparel 5% of 9500 = 475 -> total = 9975
        expected: [
          'RECEIPT',
          'Merino Hoodie (apparel) x2: $100.00',
          'SUBTOTAL: $100.00',
          'DISCOUNT: -$5.00',
          'TAX: $4.75',
          'TOTAL: $99.75',
        ].join('\n'),
      },
      {
        id: 'mp-tc-4',
        name: 'Empty or zero-quantity cart renders empty receipt',
        args: [
          {
            promo: 'FLAT500',
            items: [{ name: 'Cancelled Cable', category: 'electronics', qty: 0, unitCents: 1500 }],
          },
        ],
        expected: ['RECEIPT', '(empty cart)', 'TOTAL: $0.00'].join('\n'),
      },
      {
        id: 'mp-tc-5',
        name: 'FLAT500 capped at small cart subtotal ($3.00)',
        args: [
          {
            promo: 'FLAT500',
            items: [{ name: 'USB Adapter', category: 'electronics', qty: 1, unitCents: 300 }],
          },
        ],
        expected: [
          'RECEIPT',
          'USB Adapter (electronics) x1: $3.00',
          'SUBTOTAL: $3.00',
          'DISCOUNT: -$3.00',
          'TAX: $0.00',
          'TOTAL: $0.00',
        ].join('\n'),
        hidden: true,
      },
      {
        id: 'mp-tc-6',
        name: 'VIP15 promo on $80 electronics cart',
        args: [
          {
            promo: 'VIP15',
            items: [{ name: 'Studio Mic', category: 'electronics', qty: 1, unitCents: 8000 }],
          },
        ],
        // subtotal 8000 -> tier 0 -> VIP15 = 1200 -> remaining 6800 -> 10% tax = 680 -> total 7480
        expected: [
          'RECEIPT',
          'Studio Mic (electronics) x1: $80.00',
          'SUBTOTAL: $80.00',
          'DISCOUNT: -$12.00',
          'TAX: $6.80',
          'TOTAL: $74.80',
        ].join('\n'),
        hidden: true,
      },
    ],
  },
  exam: {
    id: 's1-exam',
    title: 'Section 1 Cumulative Exam: Foundations, Control Flow & I/O',
    subtitle: 'Prove mastery of multi-line I/O formatting, tiered conditionals, digit loops, and tuple types',
    coveredSections: [1],
    passingScore: 1,
    description:
      'Complete all 4 exam tasks with hints disabled to unlock Section 2. Every solution must compile strictly with zero `any` or compiler suppressions and pass all visible and hidden verification cases.',
    tasks: [
      {
        id: 's1-exam-t1',
        title: 'Data Center Power & Cooling Report',
        style: 'beecrowd',
        difficulty: 'easy',
        description: `### Problem

Analyze power usage across server racks:

- **Line 1:** \`"<PUE_FACTOR> <RATE_PER_KWH>"\` (two floating-point numbers).
- **Remaining lines:** \`"<RACK_ID> <IT_KWH>"\` (at least one rack).

Compute:
- \`IT_KWH\`: sum of all rack \`IT_KWH\` values
- \`FACILITY_KWH = IT_KWH * PUE_FACTOR\`
- \`COST = FACILITY_KWH * RATE_PER_KWH\`
- \`PEAK_RACK\`: \`RACK_ID\` with the highest \`IT_KWH\` (keep the earliest rack on ties)

### Output Format

Format numeric totals to **2 decimal places**:

\`\`\`
IT_KWH = <it>
FACILITY_KWH = <facility>
COST = <cost>
PEAK_RACK = <rackId>
\`\`\``,
        tags: ['Beecrowd I/O', 'Precision Math', 'Peak Tracking'],
        hints: [],
        entryFunction: 'solve',
        playgroundInput: '1.40 0.15\nR1 100\nR2 150',
        starterCode: `export function solve(input: string): string {
  return '';
}
`,
        referenceSolution: `export function solve(input: string): string {
  const lines = input.trim().split(/\\r?\\n/);
  const [rawPue, rawRate] = lines[0].trim().split(/\\s+/);
  const pue = Number(rawPue);
  const rate = Number(rawRate);

  let totalIt = 0;
  let peakRack = '';
  let peakKwh = -Infinity;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const [rackId, rawKwh] = line.split(/\\s+/);
    const kwh = Number(rawKwh);
    totalIt += kwh;
    if (kwh > peakKwh) {
      peakKwh = kwh;
      peakRack = rackId;
    }
  }

  const facilityKwh = totalIt * pue;
  const cost = facilityKwh * rate;

  return [
    \`IT_KWH = \${totalIt.toFixed(2)}\`,
    \`FACILITY_KWH = \${facilityKwh.toFixed(2)}\`,
    \`COST = \${cost.toFixed(2)}\`,
    \`PEAK_RACK = \${peakRack}\`,
  ].join('\\n');
}
`,
        testCases: [
          {
            id: 'tc-1',
            name: 'Two racks at PUE 1.40',
            args: ['1.40 0.15\nR1 100\nR2 150'],
            expected: 'IT_KWH = 250.00\nFACILITY_KWH = 350.00\nCOST = 52.50\nPEAK_RACK = R2',
          },
          {
            id: 'tc-2',
            name: 'Tie keeps earliest rack',
            args: ['1.20 0.10\nA1 200\nA2 200\nA3 100'],
            expected: 'IT_KWH = 500.00\nFACILITY_KWH = 600.00\nCOST = 60.00\nPEAK_RACK = A1',
          },
          {
            id: 'tc-3',
            name: 'Single rack with CRLF input',
            args: ['1.50 0.20\r\nGPU-7 80'],
            expected: 'IT_KWH = 80.00\nFACILITY_KWH = 120.00\nCOST = 24.00\nPEAK_RACK = GPU-7',
          },
          {
            id: 'tc-4',
            name: 'Zero load rack',
            args: ['1.25 0.12\nIDLE-1 0'],
            expected: 'IT_KWH = 0.00\nFACILITY_KWH = 0.00\nCOST = 0.00\nPEAK_RACK = IDLE-1',
          },
          {
            id: 'tc-5',
            name: 'Fractional rack usage',
            args: ['1.20 0.25\nN1 12.5\nN2 37.5\nN3 50.0'],
            expected: 'IT_KWH = 100.00\nFACILITY_KWH = 120.00\nCOST = 30.00\nPEAK_RACK = N3',
            hidden: true,
          },
          {
            id: 'tc-6',
            name: 'Peak in middle of four racks',
            args: ['1.10 0.20\nB1 40\nB2 90\nB3 70\nB4 90'],
            expected: 'IT_KWH = 290.00\nFACILITY_KWH = 319.00\nCOST = 63.80\nPEAK_RACK = B2',
            hidden: true,
          },
        ],
      },
      {
        id: 's1-exam-t2',
        title: 'Tiered SLA Credit Calculator',
        style: 'leetcode',
        difficulty: 'easy',
        description: `### Problem

Compute the monthly service-credit percentage owed for an uptime SLA:

- \`uptimePct >= 99.9\`: \`0\`
- \`99.0 <= uptimePct < 99.9\`: \`10\`
- \`95.0 <= uptimePct < 99.0\`: \`25\`
- \`uptimePct < 95.0\`: \`50\`

If \`isEnterprise ?? false\` is \`true\` **and** the base credit is \`> 0\`, add \`+10\` percentage points (capped at \`100\`).

### Examples

- \`calculateSlaCreditPct(99.95, true)\` → \`0\`
- \`calculateSlaCreditPct(99.5, true)\` → \`20\``,
        tags: ['Conditionals', 'Nullish Coalescing', 'SLA Tiers'],
        hints: [],
        entryFunction: 'calculateSlaCreditPct',
        playgroundInput: '[99.5, true]',
        starterCode: `export function calculateSlaCreditPct(
  uptimePct: number,
  isEnterprise?: boolean | null
): number {
  return 0;
}
`,
        referenceSolution: `export function calculateSlaCreditPct(
  uptimePct: number,
  isEnterprise?: boolean | null
): number {
  let credit = 0;
  if (uptimePct >= 99.9) {
    credit = 0;
  } else if (uptimePct >= 99.0) {
    credit = 10;
  } else if (uptimePct >= 95.0) {
    credit = 25;
  } else {
    credit = 50;
  }

  if (credit > 0 && (isEnterprise ?? false)) {
    credit = Math.min(100, credit + 10);
  }

  return credit;
}
`,
        testCases: [
          { id: 'tc-1', name: 'Meets 99.9% SLA on enterprise plan (0 credit)', args: [99.9, true], expected: 0 },
          { id: 'tc-2', name: '99.5% standard plan receives 10%', args: [99.5, false], expected: 10 },
          { id: 'tc-3', name: '99.5% enterprise plan receives 20%', args: [99.5, true], expected: 20 },
          { id: 'tc-4', name: '96.0% with omitted flag defaults to standard 25%', args: [96.0], expected: 25 },
          { id: 'tc-5', name: 'Severe outage < 95% on enterprise receives 60%', args: [91.2, true], expected: 60, hidden: true },
          { id: 'tc-6', name: 'Null enterprise flag treated as false at 95.0% boundary', args: [95.0, null], expected: 25, hidden: true },
        ],
      },
      {
        id: 's1-exam-t3',
        title: 'Digital Root & Persistence Tuple',
        style: 'leetcode',
        difficulty: 'easy',
        description: `### Problem

Given an integer \`n\`, normalize \`val = Math.abs(Math.trunc(n))\` and repeatedly replace \`val\` with the sum of its base-10 digits until \`val < 10\`.

Return a \`readonly [number, number]\` tuple \`[digitalRoot, passes]\`, where \`passes\` is how many digit-summation steps were executed (\`0\` when \`val < 10\` initially).

### Examples

- \`digitalRootProfile(7)\` → \`[7, 0]\`
- \`digitalRootProfile(9875)\` → \`9+8+7+5 = 29 → 2+9 = 11 → 1+1 = 2\` → \`[2, 3]\``,
        tags: ['Nested Loops', 'Digit Math', 'Readonly Tuples'],
        hints: [],
        entryFunction: 'digitalRootProfile',
        playgroundInput: '[9875]',
        starterCode: `export function digitalRootProfile(n: number): readonly [number, number] {
  return [0, 0];
}
`,
        referenceSolution: `export function digitalRootProfile(n: number): readonly [number, number] {
  let current = Math.abs(Math.trunc(n));
  let passes = 0;

  while (current >= 10) {
    let digitSum = 0;
    let temp = current;
    while (temp > 0) {
      digitSum += temp % 10;
      temp = Math.floor(temp / 10);
    }
    current = digitSum;
    passes++;
  }

  return [current, passes];
}
`,
        testCases: [
          { id: 'tc-1', name: 'Single digit requires 0 passes', args: [7], expected: [7, 0] },
          { id: 'tc-2', name: 'Multi-pass reduction 9875 -> [2, 3]', args: [9875], expected: [2, 3] },
          { id: 'tc-3', name: 'Negative input uses absolute value', args: [-49], expected: [4, 2] },
          { id: 'tc-4', name: 'Zero returns [0, 0]', args: [0], expected: [0, 0] },
          { id: 'tc-5', name: 'Exact power of 10 (1000 -> [1, 1])', args: [1000], expected: [1, 1], hidden: true },
          { id: 'tc-6', name: 'Four-step persistence (199 -> 19 -> 10 -> 1)', args: [199], expected: [1, 3], hidden: true },
        ],
      },
      {
        id: 's1-exam-t4',
        title: 'Route Tuple & Second Element Types',
        style: 'type-challenge',
        difficulty: 'easy',
        description: `### Problem

Define three strict type-level constructs in \`solution.ts\`:

1. \`HttpMethod\`: exact union \`'GET' | 'POST' | 'PUT' | 'DELETE'\`.
2. \`RouteTuple<M extends HttpMethod, P extends string>\`: produces \`readonly [M, P]\`.
3. \`SecondElement<T extends readonly [unknown, unknown, ...unknown[]]>\`: extracts the type at index \`1\` of tuple \`T\`.`,
        tags: ['Literal Unions', 'Readonly Tuples', 'Indexed Access'],
        hints: [],
        astRules: { requireGenerics: true, requireInterfaceOrType: true },
        starterCode: `export type HttpMethod = string;

export type RouteTuple<M extends HttpMethod, P extends string> = [M, P];

export type SecondElement<T extends readonly [unknown, unknown, ...unknown[]]> = unknown;
`,
        referenceSolution: `export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type RouteTuple<M extends HttpMethod, P extends string> = readonly [M, P];

export type SecondElement<T extends readonly [unknown, unknown, ...unknown[]]> = T[1];
`,
        typeAssertionPrelude: `import type { HttpMethod, RouteTuple, SecondElement } from './solution';`,
        typeAssertions: [
          {
            id: 'ta-1',
            name: 'HttpMethod matches exact 4 verbs',
            assertion: `Expect<Equal<HttpMethod, 'GET' | 'POST' | 'PUT' | 'DELETE'>>`,
          },
          {
            id: 'ta-2',
            name: 'RouteTuple produces a readonly 2-tuple',
            assertion: `Expect<Equal<RouteTuple<'GET', '/users'>, readonly ['GET', '/users']>>`,
          },
          {
            id: 'ta-3',
            name: 'SecondElement extracts path from RouteTuple',
            assertion: `Expect<Equal<SecondElement<RouteTuple<'POST', '/orders'>>, '/orders'>>`,
          },
          {
            id: 'ta-4',
            name: 'SecondElement works on longer tuples',
            assertion: `Expect<Equal<SecondElement<[boolean, 42, 'tail']>, 42>>`,
          },
          {
            id: 'ta-5',
            name: 'RouteTuple is not mutable tuple',
            assertion: `ExpectFalse<Equal<RouteTuple<'DELETE', '/sessions'>, ['DELETE', '/sessions']>>`,
            hidden: true,
          },
          {
            id: 'ta-6',
            name: 'SecondElement preserves union at index 1',
            assertion: `Expect<Equal<SecondElement<readonly ['id', string | number]>, string | number>>`,
            hidden: true,
          },
        ],
        testCases: [],
      },
    ],
  },
};
