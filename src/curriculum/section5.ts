import type { Section } from '../types/curriculum';

export const section5: Section = {
  id: 'section-5',
  number: 5,
  slug: 'classes-architecture-async',
  title: 'Classes, Architecture & Async TypeScript',
  subtitle: 'Encapsulation, Design Patterns, Typed Event Systems & Concurrent Promises',
  accentColor: '#d19a66',
  description:
    'Master stateful object-oriented invariants, composable strategy and immutable builder architectures, strongly-typed event buses, resilient retry/timeout combinators, and bounded-concurrency async pipelines.',
  phases: [
    {
      id: 's5-p1',
      number: 1,
      title: 'Classes, Encapsulation & Invariants',
      subtitle: 'Protecting internal state with private fields, defensive snapshots, and constructor introspection',
      conceptSummary: `### Encapsulation & Domain Invariants

Well-designed TypeScript classes enforce invariants at construction time and across every state transition:

- **Explicit Private State**: Declare \`private\` or \`readonly\` fields explicitly on the class body so callers cannot mutate internal buffers or balances directly.
- **Fail-Fast Validation**: Reject invalid capacities, negative amounts, or non-integer counts immediately in constructors and mutators.
- **Defensive Snapshots**: Return shallow or structural copies from query methods so external consumers cannot corrupt internal collections by mutating returned arrays.
- **Constructor Introspection**: Conditional types with \`abstract new (...args: infer P) => infer R\` let you extract constructor tuples and instance types statically without \`any\`.`,
      challenges: [
        {
          id: 's5-p1-c1',
          title: 'Immutable Snapshot Ledger (MoneyWallet)',
          style: 'leetcode',
          difficulty: 'easy',
          description: `Implement a strongly-typed \`MoneyWallet\` ledger class that tracks balances in integer cents and exposes tamper-proof snapshots.

### Requirements
1. **Constructor** \`new MoneyWallet(owner: string, initialCents = 0)\`:
   - Throw an \`Error\` if \`owner.trim().length === 0\`, \`initialCents < 0\`, or \`!Number.isInteger(initialCents)\`.
   - If \`initialCents > 0\`, record an opening entry \`{ id: 1, type: 'credit', amountCents: initialCents, note: 'opening' }\`.
2. \`credit(amountCents: number, note: string): number\`:
   - Throw an \`Error\` if \`amountCents <= 0\` or \`!Number.isInteger(amountCents)\`.
   - Append a \`'credit'\` entry with auto-incrementing \`id\` (starting at \`1\`) and return the updated balance.
3. \`debit(amountCents: number, note: string): boolean\`:
   - Throw an \`Error\` if \`amountCents <= 0\` or \`!Number.isInteger(amountCents)\`.
   - If \`amountCents > balance\`, leave state unchanged and return \`false\`.
   - Otherwise deduct \`amountCents\`, append a \`'debit'\` entry, and return \`true\`.
4. \`getBalance(): number\` & \`snapshot(): WalletSnapshot\`:
   - \`snapshot()\` must return defensive copies of \`entries\` and entry objects so external mutation does not alter future snapshots.`,
          tags: ['Classes', 'Encapsulation', 'Immutability', 'Invariants'],
          hints: [
            'Validate Number.isInteger(amountCents) and amountCents > 0 before mutating balance or incrementing nextId.',
            'In snapshot(), map each internal entry to a fresh object ({ ...entry }) so external callers cannot mutate internal records.',
          ],
          starterCode: `export interface LedgerEntry {
  readonly id: number;
  readonly type: 'credit' | 'debit';
  readonly amountCents: number;
  readonly note: string;
}

export interface WalletSnapshot {
  readonly owner: string;
  readonly balanceCents: number;
  readonly entries: LedgerEntry[];
}

export class MoneyWallet {
  private readonly owner: string;
  private balanceCents: number;

  constructor(owner: string, initialCents = 0) {
    this.owner = owner;
    this.balanceCents = initialCents;
  }

  credit(_amountCents: number, _note: string): number {
    return this.balanceCents;
  }

  debit(_amountCents: number, _note: string): boolean {
    return false;
  }

  getBalance(): number {
    return this.balanceCents;
  }

  snapshot(): WalletSnapshot {
    return { owner: this.owner, balanceCents: this.balanceCents, entries: [] };
  }
}
`,
          referenceSolution: `export interface LedgerEntry {
  readonly id: number;
  readonly type: 'credit' | 'debit';
  readonly amountCents: number;
  readonly note: string;
}

export interface WalletSnapshot {
  readonly owner: string;
  readonly balanceCents: number;
  readonly entries: LedgerEntry[];
}

export class MoneyWallet {
  private readonly owner: string;
  private balanceCents: number;
  private readonly entries: LedgerEntry[];
  private nextId: number;

  constructor(owner: string, initialCents = 0) {
    if (owner.trim().length === 0) {
      throw new Error('Owner must be non-empty');
    }
    if (!Number.isInteger(initialCents) || initialCents < 0) {
      throw new Error('Initial cents must be a non-negative integer');
    }
    this.owner = owner;
    this.balanceCents = initialCents;
    this.entries = [];
    this.nextId = 1;

    if (initialCents > 0) {
      this.entries.push({
        id: this.nextId++,
        type: 'credit',
        amountCents: initialCents,
        note: 'opening',
      });
    }
  }

  private assertPositiveInt(amountCents: number): void {
    if (!Number.isInteger(amountCents) || amountCents <= 0) {
      throw new Error('Amount must be a positive integer');
    }
  }

  credit(amountCents: number, note: string): number {
    this.assertPositiveInt(amountCents);
    this.balanceCents += amountCents;
    this.entries.push({
      id: this.nextId++,
      type: 'credit',
      amountCents,
      note,
    });
    return this.balanceCents;
  }

  debit(amountCents: number, note: string): boolean {
    this.assertPositiveInt(amountCents);
    if (amountCents > this.balanceCents) {
      return false;
    }
    this.balanceCents -= amountCents;
    this.entries.push({
      id: this.nextId++,
      type: 'debit',
      amountCents,
      note,
    });
    return true;
  }

  getBalance(): number {
    return this.balanceCents;
  }

  snapshot(): WalletSnapshot {
    return {
      owner: this.owner,
      balanceCents: this.balanceCents,
      entries: this.entries.map((entry) => ({ ...entry })),
    };
  }
}
`,
          astRules: { requireClass: true },
          testCases: [
            {
              id: 's5-p1-c1-t1',
              name: 'Credits, debits, and insufficient funds handling',
              harnessCode: `
                const { MoneyWallet } = exports as { MoneyWallet: new (o: string, i?: number) => any };
                const w = new MoneyWallet('Ada', 1000);
                const afterCredit = w.credit(500, 'salary');
                const okDebit = w.debit(400, 'books');
                const badDebit = w.debit(2000, 'laptop');
                return { afterCredit, okDebit, badDebit, final: w.getBalance(), count: w.snapshot().entries.length };
              `,
              expected: { afterCredit: 1500, okDebit: true, badDebit: false, final: 1100, count: 3 },
            },
            {
              id: 's5-p1-c1-t2',
              name: 'Zero initial balance starts with empty ledger',
              harnessCode: `
                const { MoneyWallet } = exports as { MoneyWallet: new (o: string, i?: number) => any };
                const w = new MoneyWallet('Grace');
                w.credit(250, 'refund');
                return w.snapshot();
              `,
              expected: {
                owner: 'Grace',
                balanceCents: 250,
                entries: [{ id: 1, type: 'credit', amountCents: 250, note: 'refund' }],
              },
            },
            {
              id: 's5-p1-c1-t3',
              name: 'Snapshot returns defensive copies immune to external mutation',
              harnessCode: `
                const { MoneyWallet } = exports as { MoneyWallet: new (o: string, i?: number) => any };
                const w = new MoneyWallet('Linus', 500);
                const snap1 = w.snapshot();
                snap1.entries.push({ id: 99, type: 'credit', amountCents: 99999, note: 'hacked' });
                snap1.entries[0].amountCents = 0;
                const snap2 = w.snapshot();
                return { len: snap2.entries.length, firstAmount: snap2.entries[0].amountCents, bal: w.getBalance() };
              `,
              expected: { len: 1, firstAmount: 500, bal: 500 },
            },
            {
              id: 's5-p1-c1-t4',
              name: 'Hidden: Rejects negative, zero, fractional, or blank constructor/mutator inputs',
              hidden: true,
              harnessCode: `
                const { MoneyWallet } = exports as { MoneyWallet: new (o: string, i?: number) => any };
                const checks: boolean[] = [];
                const expectThrows = (fn: () => void) => {
                  try { fn(); checks.push(false); } catch { checks.push(true); }
                };
                expectThrows(() => new MoneyWallet('   ', 100));
                expectThrows(() => new MoneyWallet('Ada', -1));
                expectThrows(() => new MoneyWallet('Ada', 12.5));
                const w = new MoneyWallet('Ada', 100);
                expectThrows(() => w.credit(0, 'zero'));
                expectThrows(() => w.debit(1.5, 'frac'));
                return checks;
              `,
              expected: [true, true, true, true, true],
            },
            {
              id: 's5-p1-c1-t5',
              name: 'Hidden: Failed debit does not consume an entry ID',
              hidden: true,
              harnessCode: `
                const { MoneyWallet } = exports as { MoneyWallet: new (o: string, i?: number) => any };
                const w = new MoneyWallet('Alan', 100);
                w.debit(500, 'rejected');
                w.debit(100, 'exact');
                return w.snapshot().entries.map((e: any) => ({ id: e.id, type: e.type, amount: e.amountCents }));
              `,
              expected: [
                { id: 1, type: 'credit', amount: 100 },
                { id: 2, type: 'debit', amount: 100 },
              ],
            },
          ],
        },
        {
          id: 's5-p1-c2',
          title: 'Generic Bounded Ring Buffer (CircularBuffer<T>)',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Implement a fixed-capacity generic ring buffer \`CircularBuffer<T>\` with $O(1)$ \`push\`, \`shift\`, and \`peek\`.

### Specification
- \`constructor(capacity: number)\`: throws an \`Error\` if \`!Number.isInteger(capacity) || capacity < 1\`.
- \`push(item: T): T | undefined\`: appends \`item\` as the newest element. If the buffer is already full, overwrites the oldest element and returns that evicted element; otherwise returns \`undefined\`.
- \`shift(): T | undefined\`: removes and returns the oldest element, or \`undefined\` when empty.
- \`peek(): T | undefined\`: returns the oldest element without removing it, or \`undefined\` when empty.
- \`toArray(): T[]\`: returns elements ordered from oldest to newest.
- \`size(): number\` and \`isFull(): boolean\`.`,
          tags: ['Classes', 'Generics', 'Data Structures', 'Ring Buffer'],
          hints: [
            'Maintain head (index of oldest element), count (number of stored items), and write index (head + count) % capacity.',
            'When count === capacity during push(item), capture storage[head] as evicted, write item at head, and advance head = (head + 1) % capacity.',
          ],
          starterCode: `export class CircularBuffer<T> {
  private readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  push(_item: T): T | undefined {
    return undefined;
  }

  shift(): T | undefined {
    return undefined;
  }

  peek(): T | undefined {
    return undefined;
  }

  toArray(): T[] {
    return [];
  }

  size(): number {
    return this.capacity * 0;
  }

  isFull(): boolean {
    return false;
  }
}
`,
          referenceSolution: `export class CircularBuffer<T> {
  private readonly storage: (T | undefined)[];
  private readonly capacity: number;
  private head = 0;
  private count = 0;

  constructor(capacity: number) {
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new Error('Capacity must be a positive integer');
    }
    this.capacity = capacity;
    this.storage = new Array<T | undefined>(capacity);
  }

  push(item: T): T | undefined {
    if (this.count === this.capacity) {
      const evicted = this.storage[this.head];
      this.storage[this.head] = item;
      this.head = (this.head + 1) % this.capacity;
      return evicted;
    }
    const writeIdx = (this.head + this.count) % this.capacity;
    this.storage[writeIdx] = item;
    this.count++;
    return undefined;
  }

  shift(): T | undefined {
    if (this.count === 0) {
      return undefined;
    }
    const val = this.storage[this.head];
    this.storage[this.head] = undefined;
    this.head = (this.head + 1) % this.capacity;
    this.count--;
    return val;
  }

  peek(): T | undefined {
    return this.count === 0 ? undefined : this.storage[this.head];
  }

  toArray(): T[] {
    const out: T[] = [];
    for (let i = 0; i < this.count; i++) {
      out.push(this.storage[(this.head + i) % this.capacity] as T);
    }
    return out;
  }

  size(): number {
    return this.count;
  }

  isFull(): boolean {
    return this.count === this.capacity;
  }
}
`,
          astRules: { requireClass: true, requireGenerics: true },
          testCases: [
            {
              id: 's5-p1-c2-t1',
              name: 'Overwrites oldest items when full and returns evicted values',
              harnessCode: `
                const { CircularBuffer } = exports as { CircularBuffer: new <T>(c: number) => any };
                const buf = new CircularBuffer<string>(3);
                const e1 = buf.push('a');
                const e2 = buf.push('b');
                const e3 = buf.push('c');
                const e4 = buf.push('d');
                const e5 = buf.push('e');
                return { evicted: [e1, e2, e3, e4, e5], items: buf.toArray(), full: buf.isFull() };
              `,
              expected: { evicted: [undefined, undefined, undefined, 'a', 'b'], items: ['c', 'd', 'e'], full: true },
            },
            {
              id: 's5-p1-c2-t2',
              name: 'Interleaved shift, peek, and wrap-around pushes',
              harnessCode: `
                const { CircularBuffer } = exports as { CircularBuffer: new <T>(c: number) => any };
                const buf = new CircularBuffer<number>(3);
                buf.push(10);
                buf.push(20);
                const first = buf.shift();
                buf.push(30);
                buf.push(40);
                return { first, peek: buf.peek(), arr: buf.toArray(), size: buf.size() };
              `,
              expected: { first: 10, peek: 20, arr: [20, 30, 40], size: 3 },
            },
            {
              id: 's5-p1-c2-t3',
              name: 'Empty buffer operations return undefined safely',
              harnessCode: `
                const { CircularBuffer } = exports as { CircularBuffer: new <T>(c: number) => any };
                const buf = new CircularBuffer<number>(2);
                return { shift: buf.shift(), peek: buf.peek(), size: buf.size(), full: buf.isFull(), arr: buf.toArray() };
              `,
              expected: { shift: undefined, peek: undefined, size: 0, full: false, arr: [] },
            },
            {
              id: 's5-p1-c2-t4',
              name: 'Hidden: Capacity 1 edge case and invalid capacity rejection',
              hidden: true,
              harnessCode: `
                const { CircularBuffer } = exports as { CircularBuffer: new <T>(c: number) => any };
                let threwZero = false;
                try { new CircularBuffer(0); } catch { threwZero = true; }
                const single = new CircularBuffer<string>(1);
                const r1 = single.push('x');
                const r2 = single.push('y');
                const r3 = single.shift();
                const r4 = single.shift();
                return { threwZero, r1, r2, r3, r4 };
              `,
              expected: { threwZero: true, r1: undefined, r2: 'x', r3: 'y', r4: undefined },
            },
            {
              id: 's5-p1-c2-t5',
              name: 'Hidden: Stores undefined values accurately when T includes undefined',
              hidden: true,
              harnessCode: `
                const { CircularBuffer } = exports as { CircularBuffer: new <T>(c: number) => any };
                const buf = new CircularBuffer<number | undefined>(2);
                buf.push(undefined);
                buf.push(7);
                return { size: buf.size(), full: buf.isFull(), arr: buf.toArray() };
              `,
              expected: { size: 2, full: true, arr: [undefined, 7] },
            },
          ],
        },
        {
          id: 's5-p1-c3',
          title: 'Sliding Time-Window Counter (TimeWindowCounter)',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Build a \`TimeWindowCounter\` class that tracks telemetry event counts over a trailing sliding window of \`windowMs\` milliseconds.

### Rules
- \`constructor(windowMs: number)\`: throws an \`Error\` if \`windowMs <= 0\` or \`!Number.isFinite(windowMs)\`.
- \`record(timestampMs: number, count = 1): void\`: throws an \`Error\` if \`!Number.isInteger(count) || count <= 0\`. Records \`count\` hits at \`timestampMs\` (timestamps are monotonically non-decreasing in normal operation, though multiple \`record\` calls may share the same timestamp).
- \`countAt(nowMs: number): number\`: returns the total count of hits with timestamps strictly within \`(nowMs - windowMs, nowMs]\` (i.e. \`t > nowMs - windowMs && t <= nowMs\`), pruning expired entries older than or equal to \`nowMs - windowMs\`.
- \`ratePerSecond(nowMs: number): number\`: returns \`(this.countAt(nowMs) * 1000) / this.windowMs\`.`,
          tags: ['Classes', 'Sliding Window', 'Telemetry', 'Time Series'],
          hints: [
            'Coalesce consecutive hits with the exact same timestampMs into one bucket { timestampMs, count } to keep memory compact.',
            'During countAt(nowMs), advance a pointer or shift buckets whose timestampMs <= nowMs - this.windowMs.',
          ],
          starterCode: `export class TimeWindowCounter {
  private readonly windowMs: number;

  constructor(windowMs: number) {
    this.windowMs = windowMs;
  }

  record(_timestampMs: number, _count = 1): void {
    // TODO
  }

  countAt(_nowMs: number): number {
    return 0;
  }

  ratePerSecond(nowMs: number): number {
    return (this.countAt(nowMs) * 1000) / this.windowMs;
  }
}
`,
          referenceSolution: `interface HitBucket {
  readonly timestampMs: number;
  count: number;
}

export class TimeWindowCounter {
  private readonly windowMs: number;
  private buckets: HitBucket[] = [];

  constructor(windowMs: number) {
    if (!Number.isFinite(windowMs) || windowMs <= 0) {
      throw new Error('windowMs must be a positive finite number');
    }
    this.windowMs = windowMs;
  }

  record(timestampMs: number, count = 1): void {
    if (!Number.isInteger(count) || count <= 0) {
      throw new Error('count must be a positive integer');
    }
    const last = this.buckets[this.buckets.length - 1];
    if (last && last.timestampMs === timestampMs) {
      last.count += count;
    } else {
      this.buckets.push({ timestampMs, count });
    }
  }

  private pruneExpired(nowMs: number): void {
    const cutoff = nowMs - this.windowMs;
    let keepIdx = 0;
    while (keepIdx < this.buckets.length && this.buckets[keepIdx].timestampMs <= cutoff) {
      keepIdx++;
    }
    if (keepIdx > 0) {
      this.buckets = this.buckets.slice(keepIdx);
    }
  }

  countAt(nowMs: number): number {
    this.pruneExpired(nowMs);
    let total = 0;
    const cutoff = nowMs - this.windowMs;
    for (const bucket of this.buckets) {
      if (bucket.timestampMs > cutoff && bucket.timestampMs <= nowMs) {
        total += bucket.count;
      }
    }
    return total;
  }

  ratePerSecond(nowMs: number): number {
    return (this.countAt(nowMs) * 1000) / this.windowMs;
  }
}
`,
          astRules: { requireClass: true },
          testCases: [
            {
              id: 's5-p1-c3-t1',
              name: 'Counts active events in (nowMs - windowMs, nowMs] and evicts boundary',
              harnessCode: `
                const { TimeWindowCounter } = exports as { TimeWindowCounter: new (w: number) => any };
                const c = new TimeWindowCounter(1000);
                c.record(100, 2);
                c.record(500, 3);
                c.record(1100, 4);
                return {
                  at1000: c.countAt(1000),
                  at1100: c.countAt(1100),
                  at1500: c.countAt(1500),
                };
              `,
              expected: { at1000: 5, at1100: 7, at1500: 4 },
            },
            {
              id: 's5-p1-c3-t2',
              name: 'Computes accurate per-second rate across custom window sizes',
              harnessCode: `
                const { TimeWindowCounter } = exports as { TimeWindowCounter: new (w: number) => any };
                const c = new TimeWindowCounter(500);
                c.record(100, 3);
                c.record(100, 2);
                c.record(400, 5);
                return { count: c.countAt(450), rps: c.ratePerSecond(450) };
              `,
              expected: { count: 10, rps: 20 },
            },
            {
              id: 's5-p1-c3-t3',
              name: 'Returns 0 after long idle gap',
              harnessCode: `
                const { TimeWindowCounter } = exports as { TimeWindowCounter: new (w: number) => any };
                const c = new TimeWindowCounter(200);
                c.record(10, 8);
                return { active: c.countAt(50), idle: c.countAt(5000), rpsIdle: c.ratePerSecond(5000) };
              `,
              expected: { active: 8, idle: 0, rpsIdle: 0 },
            },
            {
              id: 's5-p1-c3-t4',
              name: 'Hidden: Validates windowMs and count invariants',
              hidden: true,
              harnessCode: `
                const { TimeWindowCounter } = exports as { TimeWindowCounter: new (w: number) => any };
                const errs: boolean[] = [];
                const check = (fn: () => void) => { try { fn(); errs.push(false); } catch { errs.push(true); } };
                check(() => new TimeWindowCounter(0));
                check(() => new TimeWindowCounter(-50));
                const c = new TimeWindowCounter(100);
                check(() => c.record(10, 0));
                check(() => c.record(10, -2));
                check(() => c.record(10, 1.25));
                return errs;
              `,
              expected: [true, true, true, true, true],
            },
            {
              id: 's5-p1-c3-t5',
              name: 'Hidden: Same-timestamp bursts coalesce accurately',
              hidden: true,
              harnessCode: `
                const { TimeWindowCounter } = exports as { TimeWindowCounter: new (w: number) => any };
                const c = new TimeWindowCounter(100);
                for (let i = 0; i < 25; i++) c.record(50, 2);
                return { at149: c.countAt(149), at150: c.countAt(150) };
              `,
              expected: { at149: 50, at150: 0 },
            },
          ],
        },
        {
          id: 's5-p1-c4',
          title: 'Constructor & Instance Introspection Types',
          style: 'type-challenge',
          difficulty: 'medium',
          description: `Implement three compile-time constructor introspection utilities **without** using \`any\`:

1. \`ConstructorArgs<C>\`: extracts the constructor parameter tuple of a concrete or \`abstract\` class constructor \`C\`.
2. \`InstanceOf<C>\`: extracts the instance type produced by a concrete or \`abstract\` class constructor \`C\`.
3. \`FactoryFn<C>\`: transforms a **concrete** class constructor \`C\` into a callable factory signature \`(...args: ConstructorArgs<C>) => InstanceOf<C>\`.

> **Tip**: Because constructor parameters are contravariant, \`abstract new (...args: never) => unknown\` is the safe top constraint for all constructors without touching \`any\`!`,
          tags: ['Type Challenge', 'Constructors', 'infer', 'Variance'],
          hints: [
            'Constrain C to `abstract new (...args: never) => unknown` for ConstructorArgs and InstanceOf, and `new (...args: never) => unknown` for FactoryFn.',
            'Match `C extends abstract new (...args: infer P) => unknown ? P : never` to infer the exact constructor parameter tuple.',
          ],
          starterCode: `export type ConstructorArgs<C> = unknown;

export type InstanceOf<C> = unknown;

export type FactoryFn<C> = unknown;
`,
          referenceSolution: `export type ConstructorArgs<C extends abstract new (...args: never) => unknown> =
  C extends abstract new (...args: infer P) => unknown ? P : never;

export type InstanceOf<C extends abstract new (...args: never) => unknown> =
  C extends abstract new (...args: never) => infer R ? R : never;

export type FactoryFn<C extends new (...args: never) => unknown> = (
  ...args: ConstructorArgs<C>
) => InstanceOf<C>;
`,
          astRules: { requireGenerics: true },
          typeAssertionPrelude: `import type { ConstructorArgs, InstanceOf, FactoryFn } from './solution';

class ZeroArgService {
  readonly ready = true;
}

class HttpClient {
  readonly baseUrl: string;
  readonly timeoutMs: number;
  constructor(baseUrl: string, timeoutMs?: number) {
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs ?? 1000;
  }
}

abstract class BaseEntity {
  readonly id: string;
  constructor(id: string) {
    this.id = id;
  }
}

class KeyValueBox<K, V> {
  readonly key: K;
  readonly value: V;
  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}`,
          typeAssertions: [
            {
              id: 's5-p1-c4-a1',
              name: 'Extracts multi-argument constructor tuple with optional parameters',
              assertion: `Expect<Equal<ConstructorArgs<typeof HttpClient>, [baseUrl: string, timeoutMs?: number]>>`,
            },
            {
              id: 's5-p1-c4-a2',
              name: 'Extracts empty tuple from zero-arg constructor',
              assertion: `Expect<Equal<ConstructorArgs<typeof ZeroArgService>, []>>`,
            },
            {
              id: 's5-p1-c4-a3',
              name: 'Extracts instance type from concrete class',
              assertion: `Expect<Equal<InstanceOf<typeof HttpClient>, HttpClient>>`,
            },
            {
              id: 's5-p1-c4-a4',
              name: 'Builds exact FactoryFn signature from concrete constructor',
              assertion: `Expect<Equal<FactoryFn<typeof HttpClient>, (baseUrl: string, timeoutMs?: number) => HttpClient>>`,
            },
            {
              id: 's5-p1-c4-a5',
              name: 'Hidden: Supports abstract class constructors in ConstructorArgs and InstanceOf',
              hidden: true,
              assertion: `Expect<Equal<[ConstructorArgs<typeof BaseEntity>, InstanceOf<typeof BaseEntity>], [[id: string], BaseEntity]>>`,
            },
            {
              id: 's5-p1-c4-a6',
              name: 'Hidden: Works with instantiated generic constructor signatures',
              hidden: true,
              assertion: `Expect<Equal<FactoryFn<new (key: 'id', value: number) => KeyValueBox<'id', number>>, (key: 'id', value: number) => KeyValueBox<'id', number>>>`,
            },
          ],
          testCases: [],
        },
      ],
    },
    {
      id: 's5-p2',
      number: 2,
      title: 'Abstract Contracts, Strategy & Builder Patterns',
      subtitle: 'Swappable algorithms, immutable fluent generics, undo/redo timelines, and middleware pipelines',
      conceptSummary: `### Composable Architectural Patterns

TypeScript elevates classic software design patterns by encoding structural guarantees directly in types:

- **Strategy Pattern**: Program against a narrow \`interface\` (e.g. \`PricingStrategy\`) so policies can be swapped at runtime without branching conditionals.
- **Immutable Fluent Builders**: Returning a new \`QueryBuilder<Pick<T, K>>\` on \`.select(...)\` narrows the static projection type while keeping intermediate builders reusable.
- **Command / Memento History**: Modeling state transitions as immutable snapshots gives predictable \`undo()\` / \`redo()\` semantics.
- **Onion Middleware**: Composing \`(ctx, next) => void\` stages enables cross-cutting concerns and short-circuiting with single-\`next()\` safety guards.`,
      challenges: [
        {
          id: 's5-p2-c1',
          title: 'Pluggable Pricing Strategy Engine',
          style: 'leetcode',
          difficulty: 'easy',
          description: `Implement a strategy-driven \`CheckoutEngine\` with three concrete \`PricingStrategy\` implementations:

1. \`StandardPricing\`: \`name = 'standard'\`, returns exact subtotal \`sum(unitCents * quantity)\`.
2. \`PercentageDiscountPricing\`: \`name = 'percentage'\`, constructed with \`(percentOff: number)\` (\`0 <= percentOff <= 100\`, throw \`Error\` otherwise). Computes \`Math.round((subtotal * (100 - percentOff)) / 100)\`.
3. \`BulkTierPricing\`: \`name = 'bulk-tier'\`, constructed with \`(minQuantity: number, discountPercent: number)\`. For each line item whose \`quantity >= minQuantity\`, its line total is \`Math.round((lineSubtotal * (100 - discountPercent)) / 100)\`; other lines pay full \`lineSubtotal\`.
4. \`CheckoutEngine\`: constructed with an initial \`PricingStrategy\`, supports \`setStrategy(strategy: PricingStrategy): void\` and \`quote(items: readonly CartItem[]): QuoteSummary\`.`,
          tags: ['Strategy Pattern', 'Interfaces', 'Classes', 'Domain Modeling'],
          hints: [
            'Compute raw subtotalCents = items.reduce((acc, item) => acc + item.unitCents * item.quantity, 0) in CheckoutEngine.quote.',
            'savedCents is always subtotalCents - finalCents.',
          ],
          starterCode: `export interface CartItem {
  readonly sku: string;
  readonly unitCents: number;
  readonly quantity: number;
}

export interface PricingStrategy {
  readonly name: string;
  computeTotalCents(items: readonly CartItem[]): number;
}

export interface QuoteSummary {
  readonly strategy: string;
  readonly subtotalCents: number;
  readonly finalCents: number;
  readonly savedCents: number;
}

export class StandardPricing implements PricingStrategy {
  readonly name = 'standard';
  computeTotalCents(_items: readonly CartItem[]): number {
    return 0;
  }
}

export class PercentageDiscountPricing implements PricingStrategy {
  readonly name = 'percentage';
  constructor(_percentOff: number) {}
  computeTotalCents(_items: readonly CartItem[]): number {
    return 0;
  }
}

export class BulkTierPricing implements PricingStrategy {
  readonly name = 'bulk-tier';
  constructor(_minQuantity: number, _discountPercent: number) {}
  computeTotalCents(_items: readonly CartItem[]): number {
    return 0;
  }
}

export class CheckoutEngine {
  private strategy: PricingStrategy;
  constructor(strategy: PricingStrategy) {
    this.strategy = strategy;
  }
  setStrategy(strategy: PricingStrategy): void {
    this.strategy = strategy;
  }
  quote(_items: readonly CartItem[]): QuoteSummary {
    return { strategy: this.strategy.name, subtotalCents: 0, finalCents: 0, savedCents: 0 };
  }
}
`,
          referenceSolution: `export interface CartItem {
  readonly sku: string;
  readonly unitCents: number;
  readonly quantity: number;
}

export interface PricingStrategy {
  readonly name: string;
  computeTotalCents(items: readonly CartItem[]): number;
}

export interface QuoteSummary {
  readonly strategy: string;
  readonly subtotalCents: number;
  readonly finalCents: number;
  readonly savedCents: number;
}

function sumSubtotal(items: readonly CartItem[]): number {
  let total = 0;
  for (const item of items) {
    total += item.unitCents * item.quantity;
  }
  return total;
}

export class StandardPricing implements PricingStrategy {
  readonly name = 'standard';
  computeTotalCents(items: readonly CartItem[]): number {
    return sumSubtotal(items);
  }
}

export class PercentageDiscountPricing implements PricingStrategy {
  readonly name = 'percentage';
  private readonly percentOff: number;

  constructor(percentOff: number) {
    if (percentOff < 0 || percentOff > 100) {
      throw new Error('percentOff must be between 0 and 100');
    }
    this.percentOff = percentOff;
  }

  computeTotalCents(items: readonly CartItem[]): number {
    const subtotal = sumSubtotal(items);
    return Math.round((subtotal * (100 - this.percentOff)) / 100);
  }
}

export class BulkTierPricing implements PricingStrategy {
  readonly name = 'bulk-tier';
  private readonly minQuantity: number;
  private readonly discountPercent: number;

  constructor(minQuantity: number, discountPercent: number) {
    if (minQuantity < 1 || discountPercent < 0 || discountPercent > 100) {
      throw new Error('Invalid bulk tier parameters');
    }
    this.minQuantity = minQuantity;
    this.discountPercent = discountPercent;
  }

  computeTotalCents(items: readonly CartItem[]): number {
    let total = 0;
    for (const item of items) {
      const line = item.unitCents * item.quantity;
      if (item.quantity >= this.minQuantity) {
        total += Math.round((line * (100 - this.discountPercent)) / 100);
      } else {
        total += line;
      }
    }
    return total;
  }
}

export class CheckoutEngine {
  private strategy: PricingStrategy;

  constructor(strategy: PricingStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PricingStrategy): void {
    this.strategy = strategy;
  }

  quote(items: readonly CartItem[]): QuoteSummary {
    const subtotalCents = sumSubtotal(items);
    const finalCents = this.strategy.computeTotalCents(items);
    return {
      strategy: this.strategy.name,
      subtotalCents,
      finalCents,
      savedCents: subtotalCents - finalCents,
    };
  }
}
`,
          astRules: { requireClass: true, requireInterfaceOrType: true },
          testCases: [
            {
              id: 's5-p2-c1-t1',
              name: 'Swaps cleanly between Standard and Percentage strategies',
              harnessCode: `
                const { CheckoutEngine, StandardPricing, PercentageDiscountPricing } = exports as Record<string, any>;
                const items = [
                  { sku: 'A', unitCents: 1000, quantity: 2 },
                  { sku: 'B', unitCents: 500, quantity: 1 },
                ];
                const engine = new CheckoutEngine(new StandardPricing());
                const q1 = engine.quote(items);
                engine.setStrategy(new PercentageDiscountPricing(20));
                const q2 = engine.quote(items);
                return { q1, q2 };
              `,
              expected: {
                q1: { strategy: 'standard', subtotalCents: 2500, finalCents: 2500, savedCents: 0 },
                q2: { strategy: 'percentage', subtotalCents: 2500, finalCents: 2000, savedCents: 500 },
              },
            },
            {
              id: 's5-p2-c1-t2',
              name: 'BulkTierPricing discounts only qualifying line items',
              harnessCode: `
                const { CheckoutEngine, BulkTierPricing } = exports as Record<string, any>;
                const items = [
                  { sku: 'PEN', unitCents: 200, quantity: 5 },
                  { sku: 'BOOK', unitCents: 1500, quantity: 1 },
                ];
                const engine = new CheckoutEngine(new BulkTierPricing(5, 10));
                return engine.quote(items);
              `,
              expected: { strategy: 'bulk-tier', subtotalCents: 2500, finalCents: 2400, savedCents: 100 },
            },
            {
              id: 's5-p2-c1-t3',
              name: 'Handles empty carts across strategies',
              harnessCode: `
                const { CheckoutEngine, PercentageDiscountPricing } = exports as Record<string, any>;
                const engine = new CheckoutEngine(new PercentageDiscountPricing(50));
                return engine.quote([]);
              `,
              expected: { strategy: 'percentage', subtotalCents: 0, finalCents: 0, savedCents: 0 },
            },
            {
              id: 's5-p2-c1-t4',
              name: 'Hidden: Rounds fractional cent discounts with Math.round',
              hidden: true,
              harnessCode: `
                const { CheckoutEngine, PercentageDiscountPricing } = exports as Record<string, any>;
                const engine = new CheckoutEngine(new PercentageDiscountPricing(15));
                return engine.quote([{ sku: 'X', unitCents: 333, quantity: 1 }]);
              `,
              expected: { strategy: 'percentage', subtotalCents: 333, finalCents: 283, savedCents: 50 },
            },
            {
              id: 's5-p2-c1-t5',
              name: 'Hidden: Rejects out-of-range percentage parameters',
              hidden: true,
              harnessCode: `
                const { PercentageDiscountPricing } = exports as Record<string, any>;
                let threwLow = false;
                let threwHigh = false;
                try { new PercentageDiscountPricing(-5); } catch { threwLow = true; }
                try { new PercentageDiscountPricing(105); } catch { threwHigh = true; }
                return { threwLow, threwHigh };
              `,
              expected: { threwLow: true, threwHigh: true },
            },
          ],
        },
        {
          id: 's5-p2-c2',
          title: 'Immutable Fluent Query Builder (QueryBuilder<T>)',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Implement an immutable, type-safe in-memory \`QueryBuilder<T extends object>\` where every fluent method returns a **new** \`QueryBuilder\` without mutating the source array or prior builder instances:

- \`QueryBuilder.from<T extends object>(rows: readonly T[]): QueryBuilder<T>\`
- \`where(predicate: (row: T) => boolean): QueryBuilder<T>\`
- \`orderBy<K extends keyof T>(key: K, direction: 'asc' | 'desc' = 'asc'): QueryBuilder<T>\` (compare with \`<\` / \`>\`, preserving relative order on ties)
- \`select<K extends keyof T>(...keys: K[]): QueryBuilder<Pick<T, K>>\` (projects each row to only the chosen keys!)
- \`limit(count: number): QueryBuilder<T>\` (caps output to \`Math.max(0, count)\` items)
- \`execute(): T[]\` (returns a fresh array copy)`,
          tags: ['Builder Pattern', 'Generics', 'Pick', 'Immutability'],
          hints: [
            'Store a private readonly rows: readonly T[] inside QueryBuilder and construct a new QueryBuilder(...) in each transformation method.',
            'In select<K extends keyof T>(...keys: K[]), build fresh projected objects containing only keys in K and return new QueryBuilder<Pick<T, K>>(projected).',
          ],
          starterCode: `export class QueryBuilder<T extends object> {
  private readonly rows: readonly T[];

  private constructor(rows: readonly T[]) {
    this.rows = rows;
  }

  static from<T extends object>(rows: readonly T[]): QueryBuilder<T> {
    return new QueryBuilder(rows);
  }

  where(_predicate: (row: T) => boolean): QueryBuilder<T> {
    return this;
  }

  orderBy<K extends keyof T>(_key: K, _direction: 'asc' | 'desc' = 'asc'): QueryBuilder<T> {
    return this;
  }

  select<K extends keyof T>(..._keys: K[]): QueryBuilder<Pick<T, K>> {
    return new QueryBuilder<Pick<T, K>>([]);
  }

  limit(_count: number): QueryBuilder<T> {
    return this;
  }

  execute(): T[] {
    return [...this.rows];
  }
}
`,
          referenceSolution: `export class QueryBuilder<T extends object> {
  private readonly rows: readonly T[];

  private constructor(rows: readonly T[]) {
    this.rows = [...rows];
  }

  static from<T extends object>(rows: readonly T[]): QueryBuilder<T> {
    return new QueryBuilder(rows);
  }

  where(predicate: (row: T) => boolean): QueryBuilder<T> {
    return new QueryBuilder(this.rows.filter((row) => predicate(row)));
  }

  orderBy<K extends keyof T>(key: K, direction: 'asc' | 'desc' = 'asc'): QueryBuilder<T> {
    const mult = direction === 'asc' ? 1 : -1;
    const sorted = [...this.rows].sort((a, b) => {
      const va = a[key];
      const vb = b[key];
      if (va < vb) return -1 * mult;
      if (va > vb) return 1 * mult;
      return 0;
    });
    return new QueryBuilder(sorted);
  }

  select<K extends keyof T>(...keys: K[]): QueryBuilder<Pick<T, K>> {
    const projected = this.rows.map((row) => {
      const picked = {} as Pick<T, K>;
      for (const k of keys) {
        picked[k] = row[k];
      }
      return picked;
    });
    return new QueryBuilder(projected);
  }

  limit(count: number): QueryBuilder<T> {
    const safeCount = Math.max(0, Math.floor(count));
    return new QueryBuilder(this.rows.slice(0, safeCount));
  }

  execute(): T[] {
    return [...this.rows];
  }
}
`,
          astRules: { requireClass: true, requireGenerics: true },
          typeAssertionPrelude: `import { QueryBuilder } from './solution';

interface Employee {
  id: number;
  name: string;
  dept: string;
  salary: number;
}

const sample = QueryBuilder.from<Employee>([])
  .where((e) => e.salary > 100)
  .select('id', 'name')
  .execute();`,
          typeAssertions: [
            {
              id: 's5-p2-c2-a1',
              name: 'select() narrows static row type to Pick<Employee, "id" | "name">',
              assertion: `Expect<Equal<typeof sample, Array<Pick<Employee, 'id' | 'name'>>>>`,
            },
          ],
          testCases: [
            {
              id: 's5-p2-c2-t1',
              name: 'Filters, sorts, projects, and limits rows',
              harnessCode: `
                const { QueryBuilder } = exports as { QueryBuilder: any };
                const data = [
                  { id: 1, name: 'Cara', score: 82 },
                  { id: 2, name: 'Ben', score: 95 },
                  { id: 3, name: 'Ada', score: 91 },
                  { id: 4, name: 'Dan', score: 60 },
                ];
                return QueryBuilder.from(data)
                  .where((r: any) => r.score >= 80)
                  .orderBy('score', 'desc')
                  .select('name', 'score')
                  .limit(2)
                  .execute();
              `,
              expected: [
                { name: 'Ben', score: 95 },
                { name: 'Ada', score: 91 },
              ],
            },
            {
              id: 's5-p2-c2-t2',
              name: 'Branching from a base query keeps builders completely independent',
              harnessCode: `
                const { QueryBuilder } = exports as { QueryBuilder: any };
                const base = QueryBuilder.from([
                  { sku: 'A', price: 30 },
                  { sku: 'B', price: 10 },
                  { sku: 'C', price: 20 },
                ]);
                const cheap = base.where((x: any) => x.price <= 20).orderBy('price', 'asc');
                const pricy = base.where((x: any) => x.price > 20);
                return { cheap: cheap.execute(), pricy: pricy.execute(), allCount: base.execute().length };
              `,
              expected: {
                cheap: [
                  { sku: 'B', price: 10 },
                  { sku: 'C', price: 20 },
                ],
                pricy: [{ sku: 'A', price: 30 }],
                allCount: 3,
              },
            },
            {
              id: 's5-p2-c2-t3',
              name: 'Ascending string sort and zero/negative limit handling',
              harnessCode: `
                const { QueryBuilder } = exports as { QueryBuilder: any };
                const q = QueryBuilder.from([{ tag: 'ts' }, { tag: 'go' }, { tag: 'rust' }]).orderBy('tag');
                return { sorted: q.execute(), zero: q.limit(0).execute(), neg: q.limit(-3).execute() };
              `,
              expected: {
                sorted: [{ tag: 'go' }, { tag: 'rust' }, { tag: 'ts' }],
                zero: [],
                neg: [],
              },
            },
            {
              id: 's5-p2-c2-t4',
              name: 'Hidden: Does not mutate original input array even after orderBy',
              hidden: true,
              harnessCode: `
                const { QueryBuilder } = exports as { QueryBuilder: any };
                const raw = [{ n: 3 }, { n: 1 }, { n: 2 }];
                const res = QueryBuilder.from(raw).orderBy('n', 'asc').execute();
                res.push({ n: 99 });
                return { raw, secondExec: QueryBuilder.from(raw).orderBy('n', 'asc').execute() };
              `,
              expected: {
                raw: [{ n: 3 }, { n: 1 }, { n: 2 }],
                secondExec: [{ n: 1 }, { n: 2 }, { n: 3 }],
              },
            },
          ],
        },
        {
          id: 's5-p2-c3',
          title: 'Generic Undo/Redo State Manager (UndoRedoManager<S>)',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Implement a generic \`UndoRedoManager<S>\` supporting bounded history and branching timelines.

### Specification
- \`constructor(initialState: S, maxHistory = 50)\`: throws \`Error\` if \`!Number.isInteger(maxHistory) || maxHistory < 1\`.
- \`getState(): S\`: returns the current state.
- \`apply(updater: (prev: S) => S): S\`: computes \`next = updater(current)\`, pushes \`current\` onto the undo stack (if undo stack exceeds \`maxHistory\`, drop the oldest undo snapshot), **clears** the redo stack, sets \`current = next\`, and returns \`current\`.
- \`undo(): S\`: if \`canUndo()\`, pushes \`current\` onto redo stack, pops the latest undo state as \`current\`, and returns it; otherwise returns \`current\` unchanged.
- \`redo(): S\`: if \`canRedo()\`, pushes \`current\` onto undo stack, pops the latest redo state as \`current\`, and returns it; otherwise returns \`current\` unchanged.
- \`canUndo(): boolean\`, \`canRedo(): boolean\`, and \`historySizes(): { undo: number; redo: number }\`.`,
          tags: ['Memento Pattern', 'Generics', 'State Management', 'Classes'],
          hints: [
            'Use two private arrays undoStack: S[] and redoStack: S[].',
            'When undoStack.length > maxHistory after pushing in apply(), call undoStack.shift() to drop the oldest entry.',
          ],
          starterCode: `export class UndoRedoManager<S> {
  private current: S;

  constructor(initialState: S, _maxHistory = 50) {
    this.current = initialState;
  }

  getState(): S {
    return this.current;
  }

  apply(updater: (prev: S) => S): S {
    this.current = updater(this.current);
    return this.current;
  }

  undo(): S {
    return this.current;
  }

  redo(): S {
    return this.current;
  }

  canUndo(): boolean {
    return false;
  }

  canRedo(): boolean {
    return false;
  }

  historySizes(): { undo: number; redo: number } {
    return { undo: 0, redo: 0 };
  }
}
`,
          referenceSolution: `export class UndoRedoManager<S> {
  private current: S;
  private readonly maxHistory: number;
  private readonly undoStack: S[] = [];
  private redoStack: S[] = [];

  constructor(initialState: S, maxHistory = 50) {
    if (!Number.isInteger(maxHistory) || maxHistory < 1) {
      throw new Error('maxHistory must be a positive integer');
    }
    this.current = initialState;
    this.maxHistory = maxHistory;
  }

  getState(): S {
    return this.current;
  }

  apply(updater: (prev: S) => S): S {
    const next = updater(this.current);
    this.undoStack.push(this.current);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = [];
    this.current = next;
    return this.current;
  }

  undo(): S {
    if (this.undoStack.length === 0) {
      return this.current;
    }
    this.redoStack.push(this.current);
    this.current = this.undoStack.pop() as S;
    return this.current;
  }

  redo(): S {
    if (this.redoStack.length === 0) {
      return this.current;
    }
    this.undoStack.push(this.current);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.current = this.redoStack.pop() as S;
    return this.current;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  historySizes(): { undo: number; redo: number } {
    return { undo: this.undoStack.length, redo: this.redoStack.length };
  }
}
`,
          astRules: { requireClass: true, requireGenerics: true },
          testCases: [
            {
              id: 's5-p2-c3-t1',
              name: 'Supports multi-step undo and redo transitions',
              harnessCode: `
                const { UndoRedoManager } = exports as { UndoRedoManager: new <S>(s: S, m?: number) => any };
                const mgr = new UndoRedoManager({ text: '' });
                mgr.apply((s: any) => ({ text: s.text + 'A' }));
                mgr.apply((s: any) => ({ text: s.text + 'B' }));
                const u1 = mgr.undo();
                const u2 = mgr.undo();
                const r1 = mgr.redo();
                return { u1, u2, r1, sizes: mgr.historySizes() };
              `,
              expected: { u1: { text: 'A' }, u2: { text: '' }, r1: { text: 'A' }, sizes: { undo: 1, redo: 1 } },
            },
            {
              id: 's5-p2-c3-t2',
              name: 'Applying a new edit after undo clears the redo timeline',
              harnessCode: `
                const { UndoRedoManager } = exports as { UndoRedoManager: new <S>(s: S, m?: number) => any };
                const mgr = new UndoRedoManager(0);
                mgr.apply((n: number) => n + 10);
                mgr.apply((n: number) => n + 20);
                mgr.undo();
                mgr.apply((n: number) => n + 5);
                return { state: mgr.getState(), canRedo: mgr.canRedo(), sizes: mgr.historySizes() };
              `,
              expected: { state: 15, canRedo: false, sizes: { undo: 2, redo: 0 } },
            },
            {
              id: 's5-p2-c3-t3',
              name: 'Evicts oldest undo snapshot when maxHistory is exceeded',
              harnessCode: `
                const { UndoRedoManager } = exports as { UndoRedoManager: new <S>(s: S, m?: number) => any };
                const mgr = new UndoRedoManager('v0', 2);
                mgr.apply(() => 'v1');
                mgr.apply(() => 'v2');
                mgr.apply(() => 'v3');
                const a = mgr.undo();
                const b = mgr.undo();
                const c = mgr.undo();
                return { a, b, c, canUndo: mgr.canUndo() };
              `,
              expected: { a: 'v2', b: 'v1', c: 'v1', canUndo: false },
            },
            {
              id: 's5-p2-c3-t4',
              name: 'Hidden: No-op undo and redo at empty boundaries',
              hidden: true,
              harnessCode: `
                const { UndoRedoManager } = exports as { UndoRedoManager: new <S>(s: S, m?: number) => any };
                const mgr = new UndoRedoManager(42);
                return { u: mgr.undo(), r: mgr.redo(), canU: mgr.canUndo(), canR: mgr.canRedo() };
              `,
              expected: { u: 42, r: 42, canU: false, canR: false },
            },
            {
              id: 's5-p2-c3-t5',
              name: 'Hidden: Rejects non-positive or fractional maxHistory',
              hidden: true,
              harnessCode: `
                const { UndoRedoManager } = exports as { UndoRedoManager: new <S>(s: S, m?: number) => any };
                let e1 = false, e2 = false;
                try { new UndoRedoManager(0, 0); } catch { e1 = true; }
                try { new UndoRedoManager(0, 2.5); } catch { e2 = true; }
                return [e1, e2];
              `,
              expected: [true, true],
            },
          ],
        },
        {
          id: 's5-p2-c4',
          title: 'Typed Onion Middleware Pipeline (MiddlewareChain<Ctx>)',
          style: 'leetcode',
          difficulty: 'hard',
          description: `Implement a Koa-style generic synchronous middleware pipeline \`MiddlewareChain<Ctx>\`.

### Specification
- \`export type Middleware<Ctx> = (ctx: Ctx, next: () => void) => void;\`
- \`use(fn: Middleware<Ctx>): this\`: appends \`fn\` to the pipeline and returns \`this\` for fluent chaining.
- \`run(ctx: Ctx): Ctx\`:
  - Invokes registered middlewares in order. Each middleware controls whether downstream middlewares run by calling \`next()\`, and may run post-processing logic after \`next()\` returns (onion model).
  - If a single middleware invokes its \`next\` callback **more than once** during the same \`run()\`, throw \`new Error('next() called multiple times')\`.
  - Returns \`ctx\`.`,
          tags: ['Middleware', 'Chain of Responsibility', 'Generics', 'Architecture'],
          hints: [
            'Write an internal dispatch(index: number) helper while tracking the highest dispatched index lastDispatched = -1.',
            'If index <= lastDispatched inside dispatch(index), throw new Error("next() called multiple times") immediately.',
          ],
          starterCode: `export type Middleware<Ctx> = (ctx: Ctx, next: () => void) => void;

export class MiddlewareChain<Ctx> {
  use(_fn: Middleware<Ctx>): this {
    return this;
  }

  run(ctx: Ctx): Ctx {
    return ctx;
  }
}
`,
          referenceSolution: `export type Middleware<Ctx> = (ctx: Ctx, next: () => void) => void;

export class MiddlewareChain<Ctx> {
  private readonly middlewares: Middleware<Ctx>[] = [];

  use(fn: Middleware<Ctx>): this {
    this.middlewares.push(fn);
    return this;
  }

  run(ctx: Ctx): Ctx {
    let lastIndex = -1;

    const dispatch = (index: number): void => {
      if (index <= lastIndex) {
        throw new Error('next() called multiple times');
      }
      lastIndex = index;
      const fn = this.middlewares[index];
      if (!fn) {
        return;
      }
      fn(ctx, () => dispatch(index + 1));
    };

    dispatch(0);
    return ctx;
  }
}
`,
          astRules: { requireClass: true, requireGenerics: true },
          testCases: [
            {
              id: 's5-p2-c4-t1',
              name: 'Executes middlewares in full onion before/after order',
              harnessCode: `
                const { MiddlewareChain } = exports as { MiddlewareChain: new <C>() => any };
                const chain = new MiddlewareChain<{ log: string[] }>();
                chain
                  .use((ctx: any, next: () => void) => { ctx.log.push('1-in'); next(); ctx.log.push('1-out'); })
                  .use((ctx: any, next: () => void) => { ctx.log.push('2-in'); next(); ctx.log.push('2-out'); })
                  .use((ctx: any, next: () => void) => { ctx.log.push('3-core'); next(); });
                return chain.run({ log: [] }).log;
              `,
              expected: ['1-in', '2-in', '3-core', '2-out', '1-out'],
            },
            {
              id: 's5-p2-c4-t2',
              name: 'Short-circuits downstream middlewares when next() is omitted',
              harnessCode: `
                const { MiddlewareChain } = exports as { MiddlewareChain: new <C>() => any };
                const chain = new MiddlewareChain<{ auth: boolean; steps: string[] }>();
                chain
                  .use((ctx: any, next: () => void) => {
                    ctx.steps.push('guard');
                    if (ctx.auth) next();
                  })
                  .use((ctx: any) => { ctx.steps.push('handler'); });
                const blocked = chain.run({ auth: false, steps: [] });
                const allowed = chain.run({ auth: true, steps: [] });
                return { blocked: blocked.steps, allowed: allowed.steps };
              `,
              expected: { blocked: ['guard'], allowed: ['guard', 'handler'] },
            },
            {
              id: 's5-p2-c4-t3',
              name: 'Throws when a middleware calls next() multiple times',
              harnessCode: `
                const { MiddlewareChain } = exports as { MiddlewareChain: new <C>() => any };
                const chain = new MiddlewareChain<{ count: number }>();
                chain
                  .use((_ctx: any, next: () => void) => { next(); next(); })
                  .use((ctx: any) => { ctx.count++; });
                try {
                  chain.run({ count: 0 });
                  return 'did-not-throw';
                } catch (e: any) {
                  return e.message;
                }
              `,
              expected: 'next() called multiple times',
            },
            {
              id: 's5-p2-c4-t4',
              name: 'Hidden: Empty middleware chain returns context untouched',
              hidden: true,
              harnessCode: `
                const { MiddlewareChain } = exports as { MiddlewareChain: new <C>() => any };
                const chain = new MiddlewareChain<{ ok: boolean }>();
                return chain.run({ ok: true });
              `,
              expected: { ok: true },
            },
            {
              id: 's5-p2-c4-t5',
              name: 'Hidden: Same chain instance can be executed across multiple independent contexts',
              hidden: true,
              harnessCode: `
                const { MiddlewareChain } = exports as { MiddlewareChain: new <C>() => any };
                const chain = new MiddlewareChain<{ n: number }>().use((c: any, next: () => void) => { c.n *= 2; next(); });
                return [chain.run({ n: 3 }).n, chain.run({ n: 7 }).n];
              `,
              expected: [6, 14],
            },
          ],
        },
      ],
    },
    {
      id: 's5-p3',
      number: 3,
      title: 'Strongly-Typed Event Emitter & Pub/Sub',
      subtitle: 'Key-indexed payload typing, reactive state selectors, pub/sub brokers, and listener map transforms',
      conceptSummary: `### Type-Safe Event-Driven Systems

Untyped \`EventEmitter\` APIs lose payload types across \`on(event: string, cb: (...args: any[]) => void)\`. In modern TypeScript, indexed generic parameters bind every event name \`K extends keyof EventMap\` to its exact payload \`EventMap[K]\`:

- **\`TypedEventBus<EventMap>\`**: Guarantees \`emit(event, payload)\` and \`on(event, listener)\` agree at compile time, while snapshotting listener lists during emission prevents subtle iteration bugs when \`once\` unsubscribes mid-emit.
- **\`ObservableStore<T>\`**: Combines shallow \`Object.is\` change detection with derived slice selectors \`select(selector, onChange)\`.
- **Key Remapping (\`as\`)**: Transforms raw event maps into strongly-typed handler interfaces like \`onLogin\`, \`onLogout\`.`,
      challenges: [
        {
          id: 's5-p3-c1',
          title: 'Strongly-Typed Event Bus (TypedEventBus<EventMap>)',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Implement \`TypedEventBus<EventMap extends object>\` where every method enforces the exact payload type \`EventMap[K]\` for event key \`K extends keyof EventMap\`:

- \`on<K extends keyof EventMap>(event: K, listener: (payload: EventMap[K]) => void): () => void\`: registers \`listener\` and returns an idempotent unsubscribe function.
- \`once<K extends keyof EventMap>(event: K, listener: (payload: EventMap[K]) => void): () => void\`: registers a listener that automatically unsubscribes right before running on the next \`emit\`, and also returns an unsubscribe function.
- \`off<K extends keyof EventMap>(event: K, listener: (payload: EventMap[K]) => void): void\`: removes a registered listener.
- \`emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): number\`: invokes a snapshot of current listeners in registration order and returns how many listeners were invoked.
- \`listenerCount<K extends keyof EventMap>(event: K): number\`.`,
          tags: ['EventBus', 'Generics', 'keyof', 'Pub/Sub'],
          hints: [
            'Store listeners in a Map<keyof EventMap, Set<(payload: never) => void>> or cast safely through a per-key helper.',
            'Snapshot Array.from(set) in emit() before invoking callbacks so once() removals during iteration do not skip subsequent listeners!',
          ],
          starterCode: `export class TypedEventBus<EventMap extends object> {
  on<K extends keyof EventMap>(
    _event: K,
    _listener: (payload: EventMap[K]) => void
  ): () => void {
    return () => {};
  }

  once<K extends keyof EventMap>(
    _event: K,
    _listener: (payload: EventMap[K]) => void
  ): () => void {
    return () => {};
  }

  off<K extends keyof EventMap>(
    _event: K,
    _listener: (payload: EventMap[K]) => void
  ): void {
    // TODO
  }

  emit<K extends keyof EventMap>(_event: K, _payload: EventMap[K]): number {
    return 0;
  }

  listenerCount<K extends keyof EventMap>(_event: K): number {
    return 0;
  }
}
`,
          referenceSolution: `type ErasedListener = (payload: never) => void;

export class TypedEventBus<EventMap extends object> {
  private readonly registry = new Map<keyof EventMap, Set<ErasedListener>>();

  on<K extends keyof EventMap>(
    event: K,
    listener: (payload: EventMap[K]) => void
  ): () => void {
    let bucket = this.registry.get(event);
    if (!bucket) {
      bucket = new Set<ErasedListener>();
      this.registry.set(event, bucket);
    }
    bucket.add(listener as ErasedListener);
    return () => {
      this.off(event, listener);
    };
  }

  once<K extends keyof EventMap>(
    event: K,
    listener: (payload: EventMap[K]) => void
  ): () => void {
    const wrapper = (payload: EventMap[K]): void => {
      this.off(event, wrapper);
      listener(payload);
    };
    return this.on(event, wrapper);
  }

  off<K extends keyof EventMap>(
    event: K,
    listener: (payload: EventMap[K]) => void
  ): void {
    const bucket = this.registry.get(event);
    if (!bucket) return;
    bucket.delete(listener as ErasedListener);
    if (bucket.size === 0) {
      this.registry.delete(event);
    }
  }

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): number {
    const bucket = this.registry.get(event);
    if (!bucket || bucket.size === 0) {
      return 0;
    }
    const snapshot = Array.from(bucket);
    for (const fn of snapshot) {
      (fn as (p: EventMap[K]) => void)(payload);
    }
    return snapshot.length;
  }

  listenerCount<K extends keyof EventMap>(event: K): number {
    return this.registry.get(event)?.size ?? 0;
  }
}
`,
          astRules: { requireClass: true, requireGenerics: true },
          typeAssertionPrelude: `import { TypedEventBus } from './solution';

interface AppEvents {
  orderCreated: { orderId: string; totalCents: number };
  cacheCleared: number;
}

const bus = new TypedEventBus<AppEvents>();
type EmitOrderFn = (payload: AppEvents['orderCreated']) => number;
const checkEmit: EmitOrderFn = (p) => bus.emit('orderCreated', p);`,
          typeAssertions: [
            {
              id: 's5-p3-c1-a1',
              name: 'on() returns an unsubscribe callback () => void and infers listener parameter',
              assertion: `Expect<Equal<ReturnType<typeof bus.on<'orderCreated'>>, () => void>>`,
            },
            {
              id: 's5-p3-c1-a2',
              name: 'emit() enforces EventMap[K] payload and returns listener count number',
              assertion: `Expect<Equal<typeof checkEmit, (payload: { orderId: string; totalCents: number }) => number>>`,
            },
          ],
          testCases: [
            {
              id: 's5-p3-c1-t1',
              name: 'Delivers typed payloads and unsubscribes via returned disposer',
              harnessCode: `
                const { TypedEventBus } = exports as { TypedEventBus: new () => any };
                const bus = new TypedEventBus();
                const seen: number[] = [];
                const unsub = bus.on('tick', (n: number) => seen.push(n));
                const c1 = bus.emit('tick', 1);
                unsub();
                const c2 = bus.emit('tick', 2);
                return { seen, c1, c2, remaining: bus.listenerCount('tick') };
              `,
              expected: { seen: [1], c1: 1, c2: 0, remaining: 0 },
            },
            {
              id: 's5-p3-c1-t2',
              name: 'once() fires exactly once without skipping sibling listeners on emit',
              harnessCode: `
                const { TypedEventBus } = exports as { TypedEventBus: new () => any };
                const bus = new TypedEventBus();
                const order: string[] = [];
                bus.once('boot', (msg: string) => order.push('once:' + msg));
                bus.on('boot', (msg: string) => order.push('on:' + msg));
                const firstCount = bus.emit('boot', 'v1');
                const secondCount = bus.emit('boot', 'v2');
                return { order, firstCount, secondCount };
              `,
              expected: { order: ['once:v1', 'on:v1', 'on:v2'], firstCount: 2, secondCount: 1 },
            },
            {
              id: 's5-p3-c1-t3',
              name: 'Canceling a once() listener before emit prevents execution',
              harnessCode: `
                const { TypedEventBus } = exports as { TypedEventBus: new () => any };
                const bus = new TypedEventBus();
                let called = false;
                const cancel = bus.once('ping', () => { called = true; });
                cancel();
                const count = bus.emit('ping', null);
                return { called, count };
              `,
              expected: { called: false, count: 0 },
            },
            {
              id: 's5-p3-c1-t4',
              name: 'Hidden: off() removes exact listener while keeping others intact',
              hidden: true,
              harnessCode: `
                const { TypedEventBus } = exports as { TypedEventBus: new () => any };
                const bus = new TypedEventBus();
                const log: string[] = [];
                const a = (s: string) => log.push('a:' + s);
                const b = (s: string) => log.push('b:' + s);
                bus.on('ev', a);
                bus.on('ev', b);
                bus.off('ev', a);
                bus.emit('ev', 'ok');
                return { log, count: bus.listenerCount('ev') };
              `,
              expected: { log: ['b:ok'], count: 1 },
            },
          ],
        },
        {
          id: 's5-p3-c2',
          title: 'Reactive Observable Store (ObservableStore<T>)',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Implement a reactive \`ObservableStore<T extends object>\` with shallow structural change detection and derived slice subscriptions:

- \`constructor(initialState: T)\`: clones \`{ ...initialState }\`.
- \`getState(): Readonly<T>\`: returns current state snapshot.
- \`setState(updater: Partial<T> | ((prev: Readonly<T>) => Partial<T>)): void\`:
  - Computes shallowly merged candidate state \`{ ...prev, ...patch }\`.
  - Compares every updated key with \`Object.is(prev[k], next[k])\`. If **no** property value actually changed, do **not** notify any listeners!
- \`subscribe(listener: (next: Readonly<T>, prev: Readonly<T>) => void): () => void\`: called whenever state changes; returns an unsubscribe callback.
- \`select<S>(selector: (state: Readonly<T>) => S, onChange: (nextSlice: S, prevSlice: S) => void): () => void\`: invokes \`onChange\` only when \`!Object.is(prevSlice, nextSlice)\`.`,
          tags: ['Reactive State', 'Generics', 'Observer Pattern', 'Object.is'],
          hints: [
            'Check whether any key k in Object.keys(patch) changed via !Object.is(prev[k], next[k]) before replacing this.state and notifying listeners.',
            'Implement select() on top of subscribe(): compute prevSlice = selector(this.state), and inside subscribe check !Object.is(prevSlice, nextSlice) before updating prevSlice and calling onChange.',
          ],
          starterCode: `export class ObservableStore<T extends object> {
  private state: Readonly<T>;

  constructor(initialState: T) {
    this.state = { ...initialState };
  }

  getState(): Readonly<T> {
    return this.state;
  }

  setState(_updater: Partial<T> | ((prev: Readonly<T>) => Partial<T>)): void {
    // TODO
  }

  subscribe(_listener: (next: Readonly<T>, prev: Readonly<T>) => void): () => void {
    return () => {};
  }

  select<S>(
    _selector: (state: Readonly<T>) => S,
    _onChange: (nextSlice: S, prevSlice: S) => void
  ): () => void {
    return () => {};
  }
}
`,
          referenceSolution: `type StoreListener<T> = (next: Readonly<T>, prev: Readonly<T>) => void;

export class ObservableStore<T extends object> {
  private state: Readonly<T>;
  private readonly listeners = new Set<StoreListener<T>>();

  constructor(initialState: T) {
    this.state = { ...initialState };
  }

  getState(): Readonly<T> {
    return this.state;
  }

  setState(updater: Partial<T> | ((prev: Readonly<T>) => Partial<T>)): void {
    const prev = this.state;
    const patch = typeof updater === 'function' ? updater(prev) : updater;
    const next = { ...prev, ...patch };

    let changed = false;
    for (const key of Object.keys(patch) as Array<keyof T>) {
      if (!Object.is(prev[key], next[key])) {
        changed = true;
        break;
      }
    }

    if (!changed) {
      return;
    }

    this.state = next;
    for (const listener of Array.from(this.listeners)) {
      listener(next, prev);
    }
  }

  subscribe(listener: StoreListener<T>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  select<S>(
    selector: (state: Readonly<T>) => S,
    onChange: (nextSlice: S, prevSlice: S) => void
  ): () => void {
    let currentSlice = selector(this.state);
    return this.subscribe((nextState) => {
      const nextSlice = selector(nextState);
      if (!Object.is(currentSlice, nextSlice)) {
        const prevSlice = currentSlice;
        currentSlice = nextSlice;
        onChange(nextSlice, prevSlice);
      }
    });
  }
}
`,
          astRules: { requireClass: true, requireGenerics: true },
          testCases: [
            {
              id: 's5-p3-c2-t1',
              name: 'Notifies subscribers only when shallow state values actually change',
              harnessCode: `
                const { ObservableStore } = exports as { ObservableStore: new <T extends object>(s: T) => any };
                const store = new ObservableStore({ count: 1, theme: 'dark' });
                let notifications = 0;
                store.subscribe(() => { notifications++; });
                store.setState({ count: 1 });
                store.setState((s: any) => ({ count: s.count + 1 }));
                store.setState({ theme: 'dark' });
                return { notifications, state: store.getState() };
              `,
              expected: { notifications: 1, state: { count: 2, theme: 'dark' } },
            },
            {
              id: 's5-p3-c2-t2',
              name: 'select() fires only when the selected slice changes',
              harnessCode: `
                const { ObservableStore } = exports as { ObservableStore: new <T extends object>(s: T) => any };
                const store = new ObservableStore({ count: 0, label: 'init' });
                const transitions: Array<[number, number]> = [];
                store.select(
                  (s: any) => s.count,
                  (next: number, prev: number) => transitions.push([prev, next])
                );
                store.setState({ label: 'renamed' });
                store.setState({ count: 5 });
                store.setState({ label: 'again' });
                store.setState({ count: 9 });
                return transitions;
              `,
              expected: [
                [0, 5],
                [5, 9],
              ],
            },
            {
              id: 's5-p3-c2-t3',
              name: 'Unsubscribe stops both subscribe() and select() callbacks',
              harnessCode: `
                const { ObservableStore } = exports as { ObservableStore: new <T extends object>(s: T) => any };
                const store = new ObservableStore({ x: 10 });
                const hits: number[] = [];
                const stop = store.select((s: any) => s.x, (n: number) => hits.push(n));
                store.setState({ x: 20 });
                stop();
                store.setState({ x: 30 });
                return hits;
              `,
              expected: [20],
            },
            {
              id: 's5-p3-c2-t4',
              name: 'Hidden: Uses Object.is semantics for NaN and -0/+0',
              hidden: true,
              harnessCode: `
                const { ObservableStore } = exports as { ObservableStore: new <T extends object>(s: T) => any };
                const store = new ObservableStore({ val: Number.NaN, zero: +0 });
                let count = 0;
                store.subscribe(() => { count++; });
                store.setState({ val: Number.NaN });
                store.setState({ zero: -0 });
                return count;
              `,
              expected: 1,
            },
            {
              id: 's5-p3-c2-t5',
              name: 'Hidden: Passes accurate prev and next snapshots to subscribe()',
              hidden: true,
              harnessCode: `
                const { ObservableStore } = exports as { ObservableStore: new <T extends object>(s: T) => any };
                const store = new ObservableStore({ step: 1 });
                let pair: [number, number] = [0, 0];
                store.subscribe((next: any, prev: any) => { pair = [prev.step, next.step]; });
                store.setState({ step: 4 });
                return pair;
              `,
              expected: [1, 4],
            },
          ],
        },
        {
          id: 's5-p3-c3',
          title: 'Pub/Sub Message Broker Simulation',
          style: 'beecrowd',
          difficulty: 'medium',
          entryFunction: 'solve',
          description: `Simulate an in-memory topic message broker processing \`N\` line-oriented commands from standard input.

### Input Format
- Line 1: integer \`N\` (\`1 <= N <= 500\`), the number of commands.
- Next \`N\` lines, each one of:
  - \`SUB <clientId> <topic>\` — subscribes \`<clientId>\` to \`<topic>\` (idempotent if already subscribed).
  - \`UNSUB <clientId> <topic>\` — unsubscribes \`<clientId>\` from \`<topic>\` (no-op if not subscribed).
  - \`PUB <topic> <message>\` — \`<message>\` is the remainder of the line after \`<topic> \`. If \`<topic>\` has active subscribers, deliver to each subscriber in **ASCII-sorted \`<clientId>\` order** (\`a < b ? -1 : 1\`), emitting \`[<topic>] -> <clientId>: <message>\` and incrementing total deliveries per recipient. If there are **zero** active subscribers, emit \`[<topic>] -> (dropped)\`.
  - \`STATS\` — emit \`topics=<activeTopicsWithAtLeastOneSub> deliveries=<totalDeliveredMessages>\`.

Return all emitted lines joined with \`\\n\`.`,
          tags: ['Pub/Sub', 'Simulation', 'Map & Set', 'I/O Parsing'],
          hints: [
            'Maintain Map<string, Set<string>> from topic to active clientIds. Delete the topic entry whenever its Set becomes empty so activeTopics is simply map.size!',
            'For PUB, parse the command and topic as the first two whitespace tokens, and slice the rest of the line as <message> so spaces inside messages are preserved.',
          ],
          playgroundInput: `7
SUB web-2 orders
SUB web-1 orders
PUB orders created #101
UNSUB web-2 orders
PUB alerts disk-high
PUB orders shipped #101
STATS`,
          starterCode: `export function solve(input: string): string {
  const lines = input.trim().split(/\\r?\\n/);
  void lines;
  return '';
}
`,
          referenceSolution: `export function solve(input: string): string {
  const rawLines = input.replace(/\\r/g, '').trim().split('\\n');
  if (rawLines.length === 0 || rawLines[0].trim() === '') return '';

  const n = Number(rawLines[0].trim());
  const topics = new Map<string, Set<string>>();
  let deliveries = 0;
  const output: string[] = [];

  for (let i = 1; i <= n && i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    if (!line) continue;

    if (line === 'STATS') {
      output.push(\`topics=\${topics.size} deliveries=\${deliveries}\`);
      continue;
    }

    const firstSpace = line.indexOf(' ');
    const cmd = firstSpace === -1 ? line : line.slice(0, firstSpace);
    const rest = firstSpace === -1 ? '' : line.slice(firstSpace + 1).trimStart();

    if (cmd === 'SUB') {
      const [clientId, topic] = rest.split(/\\s+/);
      let subs = topics.get(topic);
      if (!subs) {
        subs = new Set<string>();
        topics.set(topic, subs);
      }
      subs.add(clientId);
    } else if (cmd === 'UNSUB') {
      const [clientId, topic] = rest.split(/\\s+/);
      const subs = topics.get(topic);
      if (subs) {
        subs.delete(clientId);
        if (subs.size === 0) {
          topics.delete(topic);
        }
      }
    } else if (cmd === 'PUB') {
      const topicSpace = rest.indexOf(' ');
      const topic = topicSpace === -1 ? rest : rest.slice(0, topicSpace);
      const message = topicSpace === -1 ? '' : rest.slice(topicSpace + 1);
      const subs = topics.get(topic);
      if (!subs || subs.size === 0) {
        output.push(\`[\${topic}] -> (dropped)\`);
      } else {
        const sortedClients = Array.from(subs).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
        for (const client of sortedClients) {
          output.push(\`[\${topic}] -> \${client}: \${message}\`);
          deliveries++;
        }
      }
    }
  }

  return output.join('\\n');
}
`,
          testCases: [
            {
              id: 's5-p3-c3-t1',
              name: 'Standard pub/sub flow with sorted fan-out and dropped topic',
              args: [
                `7\nSUB web-2 orders\nSUB web-1 orders\nPUB orders created #101\nUNSUB web-2 orders\nPUB alerts disk-high\nPUB orders shipped #101\nSTATS`,
              ],
              expected: `[orders] -> web-1: created #101\n[orders] -> web-2: created #101\n[alerts] -> (dropped)\n[orders] -> web-1: shipped #101\ntopics=1 deliveries=3`,
            },
            {
              id: 's5-p3-c3-t2',
              name: 'Duplicate SUB is idempotent and emptying a topic decrements active topic count',
              args: [`6\nSUB c1 news\nSUB c1 news\nPUB news hello world\nUNSUB c1 news\nPUB news after unsub\nSTATS`],
              expected: `[news] -> c1: hello world\n[news] -> (dropped)\ntopics=0 deliveries=1`,
            },
            {
              id: 's5-p3-c3-t3',
              name: 'STATS on fresh broker before any subscriptions',
              args: [`2\nSTATS\nPUB logs boot ok`],
              expected: `topics=0 deliveries=0\n[logs] -> (dropped)`,
            },
            {
              id: 's5-p3-c3-t4',
              name: 'Hidden: Preserves multi-word messages with colons and spaces',
              hidden: true,
              args: [`3\nSUB svc-a metrics\nPUB metrics cpu: 92% | mem: 41%\nSTATS`],
              expected: `[metrics] -> svc-a: cpu: 92% | mem: 41%\ntopics=1 deliveries=1`,
            },
            {
              id: 's5-p3-c3-t5',
              name: 'Hidden: Multiple topics and non-existent UNSUB safety',
              hidden: true,
              args: [
                `7\nUNSUB ghost t1\nSUB b t1\nSUB a t1\nSUB z t2\nPUB t1 msg1\nUNSUB z t2\nSTATS`,
              ],
              expected: `[t1] -> a: msg1\n[t1] -> b: msg1\ntopics=1 deliveries=2`,
            },
          ],
        },
        {
          id: 's5-p3-c4',
          title: 'Event Map & Listener Type Transformations',
          style: 'type-challenge',
          difficulty: 'hard',
          description: `Given an event specification map \`M extends Record<string, unknown>\`, build three compile-time utilities:

1. \`VoidEvents<M>\`: union of string keys \`K\` in \`M\` whose payload is \`void\` (use tuple-wrapped \`[M[K]] extends [void]\` so union payloads like \`string | void\` are **not** misclassified as pure \`void\`!).
2. \`PayloadEvents<M>\`: union of string keys \`K\` in \`M\` whose payload is **not** \`void\`.
3. \`TypedListenerMap<M>\`: mapped object type remapping each string key \`K\` to \`on\${Capitalize<K>}\`:
   - If \`[M[K]] extends [void]\`, handler signature is \`() => void\`.
   - Otherwise handler signature is \`(payload: M[K]) => void\`.`,
          tags: ['Type Challenge', 'Mapped Types', 'Key Remapping', 'Template Literals'],
          hints: [
            'Wrap both sides in single-element tuples `[M[K]] extends [void]` to prevent distributive conditional evaluation over union payloads.',
            'In TypedListenerMap<M>, iterate `[K in keyof M & string as `on${Capitalize<K>}`]`.',
          ],
          starterCode: `export type VoidEvents<M extends Record<string, unknown>> = never;

export type PayloadEvents<M extends Record<string, unknown>> = never;

export type TypedListenerMap<M extends Record<string, unknown>> = {};
`,
          referenceSolution: `export type VoidEvents<M extends Record<string, unknown>> = {
  [K in keyof M & string]: [M[K]] extends [void] ? K : never;
}[keyof M & string];

export type PayloadEvents<M extends Record<string, unknown>> = {
  [K in keyof M & string]: [M[K]] extends [void] ? never : K;
}[keyof M & string];

export type TypedListenerMap<M extends Record<string, unknown>> = {
  [K in keyof M & string as \`on\${Capitalize<K>}\`]: [M[K]] extends [void]
    ? () => void
    : (payload: M[K]) => void;
};
`,
          astRules: { requireGenerics: true },
          typeAssertionPrelude: `import type { VoidEvents, PayloadEvents, TypedListenerMap } from './solution';

type SessionEvents = {
  connect: void;
  disconnect: void;
  message: { id: number; text: string };
  optionalNote: string | void;
};`,
          typeAssertions: [
            {
              id: 's5-p3-c4-a1',
              name: 'VoidEvents extracts exact void-payload event names',
              assertion: `Expect<Equal<VoidEvents<SessionEvents>, 'connect' | 'disconnect'>>`,
            },
            {
              id: 's5-p3-c4-a2',
              name: 'PayloadEvents keeps non-void and union string | void events',
              assertion: `Expect<Equal<PayloadEvents<SessionEvents>, 'message' | 'optionalNote'>>`,
            },
            {
              id: 's5-p3-c4-a3',
              name: 'TypedListenerMap generates capitalized onXxx handlers with zero-arg void callbacks',
              assertion: `Expect<Equal<TypedListenerMap<SessionEvents>, {
                onConnect: () => void;
                onDisconnect: () => void;
                onMessage: (payload: { id: number; text: string }) => void;
                onOptionalNote: (payload: string | void) => void;
              }>>`,
            },
            {
              id: 's5-p3-c4-a4',
              name: 'Handles empty event map cleanly',
              assertion: `Expect<Equal<[VoidEvents<{}>, PayloadEvents<{}>, TypedListenerMap<{}>], [never, never, {}]>>`,
            },
            {
              id: 's5-p3-c4-a5',
              name: 'Hidden: Preserves already-capitalized suffixes after on',
              hidden: true,
              assertion: `Expect<Equal<TypedListenerMap<{ HTTPReady: void; error: Error }>, { onHTTPReady: () => void; onError: (payload: Error) => void }>>`,
            },
          ],
          testCases: [],
        },
      ],
    },
    {
      id: 's5-p4',
      number: 4,
      title: 'Promises, Retry Backoff & Timeout Combinators',
      subtitle: 'Resilient async workflows with selective retry, deadline timers, discriminated settlement, and Awaited',
      conceptSummary: `### Resilient Asynchronous Combinators

Production async code never assumes network calls settle promptly or succeed on the first try:

- **Selective Retry (\`withRetry\`)**: Retries transient failures up to \`maxAttempts\` with stepped backoff while immediately rethrowing fatal validation/auth errors via \`shouldRetry(error, attempt)\`.
- **Deadline Racing (\`promiseTimeout\`)**: Races a task against a timer and **always** calls \`clearTimeout\` in \`finally\` so settled tasks never leave dangling timers.
- **Discriminated Settlement (\`settleAllTyped\`)**: Maps concurrent task thunks into indexed discriminated unions without short-circuiting on a single rejection.
- **Recursive \`MyAwaited<T>\`**: Unwraps nested \`Promise\` and \`PromiseLike\` chains at the type level.`,
      challenges: [
        {
          id: 's5-p4-c1',
          title: 'Configurable Async Retry (withRetry)',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Implement \`withRetry<T>(operation, options)\` to execute a flaky async operation with stepped backoff and conditional retry predicates.

### Specification
- \`options.maxAttempts\`: integer \`>= 1\` (throw \`Error\` immediately if \`maxAttempts < 1\` or \`!Number.isInteger(maxAttempts)\`).
- \`operation(attempt)\` receives the **1-indexed** attempt number (\`1 .. maxAttempts\`).
- If \`operation(attempt)\` resolves, return its value immediately.
- If it rejects with \`err\`:
  - If \`attempt === options.maxAttempts\`, rethrow \`err\`.
  - If \`options.shouldRetry\` is provided and \`options.shouldRetry(err, attempt)\` returns \`false\`, rethrow \`err\` immediately without sleeping.
  - Otherwise sleep \`options.baseDelayMs * attempt\` milliseconds before starting \`attempt + 1\`.`,
          tags: ['Async/Await', 'Promises', 'Retry Backoff', 'Resilience'],
          hints: [
            'Create a small helper sleep(ms) = new Promise<void>((resolve) => setTimeout(resolve, ms)).',
            'Validate maxAttempts before entering a for (let attempt = 1; attempt <= options.maxAttempts; attempt++) loop.',
          ],
          starterCode: `export interface RetryOptions {
  readonly maxAttempts: number;
  readonly baseDelayMs: number;
  readonly shouldRetry?: (error: unknown, attempt: number) => boolean;
}

export async function withRetry<T>(
  operation: (attempt: number) => Promise<T>,
  _options: RetryOptions
): Promise<T> {
  return operation(1);
}
`,
          referenceSolution: `export interface RetryOptions {
  readonly maxAttempts: number;
  readonly baseDelayMs: number;
  readonly shouldRetry?: (error: unknown, attempt: number) => boolean;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, ms));
  });
}

export async function withRetry<T>(
  operation: (attempt: number) => Promise<T>,
  options: RetryOptions
): Promise<T> {
  if (!Number.isInteger(options.maxAttempts) || options.maxAttempts < 1) {
    throw new Error('maxAttempts must be an integer >= 1');
  }

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await operation(attempt);
    } catch (err: unknown) {
      const canRetry =
        attempt < options.maxAttempts &&
        (options.shouldRetry ? options.shouldRetry(err, attempt) : true);
      if (!canRetry) {
        throw err;
      }
      await sleep(options.baseDelayMs * attempt);
    }
  }

  throw new Error('Unreachable');
}
`,
          astRules: { requireAsync: true, requireGenerics: true },
          testCases: [
            {
              id: 's5-p4-c1-t1',
              name: 'Succeeds after transient failures and passes 1-indexed attempt numbers',
              harnessCode: `
                const { withRetry } = exports as { withRetry: any };
                const seenAttempts: number[] = [];
                const val = await withRetry(
                  async (attempt: number) => {
                    seenAttempts.push(attempt);
                    if (attempt < 3) throw new Error('flaky');
                    return 'recovered';
                  },
                  { maxAttempts: 4, baseDelayMs: 3 }
                );
                return { val, seenAttempts };
              `,
              expected: { val: 'recovered', seenAttempts: [1, 2, 3] },
            },
            {
              id: 's5-p4-c1-t2',
              name: 'Aborts early when shouldRetry predicate returns false',
              harnessCode: `
                const { withRetry } = exports as { withRetry: any };
                let calls = 0;
                try {
                  await withRetry(
                    async () => {
                      calls++;
                      throw new Error('AUTH_DENIED');
                    },
                    {
                      maxAttempts: 5,
                      baseDelayMs: 5,
                      shouldRetry: (err: unknown) => err instanceof Error && err.message !== 'AUTH_DENIED',
                    }
                  );
                  return { threw: false, calls };
                } catch (e: any) {
                  return { threw: e.message, calls };
                }
              `,
              expected: { threw: 'AUTH_DENIED', calls: 1 },
            },
            {
              id: 's5-p4-c1-t3',
              name: 'Rethrows final error once maxAttempts is exhausted',
              harnessCode: `
                const { withRetry } = exports as { withRetry: any };
                let count = 0;
                try {
                  await withRetry(
                    async (attempt: number) => {
                      count++;
                      throw new Error('fail-' + attempt);
                    },
                    { maxAttempts: 3, baseDelayMs: 2 }
                  );
                  return 'unexpected';
                } catch (e: any) {
                  return { msg: e.message, count };
                }
              `,
              expected: { msg: 'fail-3', count: 3 },
            },
            {
              id: 's5-p4-c1-t4',
              name: 'Hidden: Rejects invalid maxAttempts <= 0 without invoking operation',
              hidden: true,
              harnessCode: `
                const { withRetry } = exports as { withRetry: any };
                let invoked = false;
                let rejected = false;
                try {
                  await withRetry(async () => { invoked = true; return 1; }, { maxAttempts: 0, baseDelayMs: 1 });
                } catch {
                  rejected = true;
                }
                return { invoked, rejected };
              `,
              expected: { invoked: false, rejected: true },
            },
            {
              id: 's5-p4-c1-t5',
              name: 'Hidden: Waits stepped delay baseDelayMs * attempt between retries',
              hidden: true,
              harnessCode: `
                const { withRetry } = exports as { withRetry: any };
                const t0 = performance.now();
                await withRetry(
                  async (attempt: number) => {
                    if (attempt < 3) throw new Error('wait');
                    return 'ok';
                  },
                  { maxAttempts: 3, baseDelayMs: 6 }
                );
                const elapsed = performance.now() - t0;
                return elapsed >= 14;
              `,
              expected: true,
            },
          ],
        },
        {
          id: 's5-p4-c2',
          title: 'Deadline Combinator (promiseTimeout)',
          style: 'leetcode',
          difficulty: 'easy',
          description: `Implement a custom \`TimeoutError\` class and a \`promiseTimeout<T>\` combinator that enforces a strict deadline on any \`Promise<T>\`:

1. \`export class TimeoutError extends Error\`:
   - \`readonly timeoutMs: number\`
   - \`constructor(timeoutMs: number, label = 'Operation')\` sets \`super(\`\${label} timed out after \${timeoutMs}ms\`)\` and \`this.name = 'TimeoutError'\`.
2. \`export async function promiseTimeout<T>(task: Promise<T>, timeoutMs: number, label?: string): Promise<T>\`:
   - Resolves or rejects with \`task\` if \`task\` settles before \`timeoutMs\`.
   - Otherwise rejects with \`new TimeoutError(timeoutMs, label)\`.
   - Always cleans up its \`setTimeout\` handle via \`clearTimeout\` in \`finally\`.`,
          tags: ['Promises', 'Promise.race', 'Custom Error', 'Timeouts'],
          hints: [
            'Store let timerId: ReturnType<typeof setTimeout> | undefined and pass clearTimeout(timerId) inside a try / finally block wrapping await Promise.race([...]).',
            'Ensure original rejections from task propagate unchanged when task fails before the timeout.',
          ],
          starterCode: `export class TimeoutError extends Error {
  readonly timeoutMs: number;

  constructor(timeoutMs: number, label = 'Operation') {
    super(label);
    this.timeoutMs = timeoutMs;
  }
}

export async function promiseTimeout<T>(
  task: Promise<T>,
  _timeoutMs: number,
  _label?: string
): Promise<T> {
  return task;
}
`,
          referenceSolution: `export class TimeoutError extends Error {
  readonly timeoutMs: number;

  constructor(timeoutMs: number, label = 'Operation') {
    super(\`\${label} timed out after \${timeoutMs}ms\`);
    this.name = 'TimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

export async function promiseTimeout<T>(
  task: Promise<T>,
  timeoutMs: number,
  label = 'Operation'
): Promise<T> {
  let timerId: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      task,
      new Promise<never>((_, reject) => {
        timerId = setTimeout(() => {
          reject(new TimeoutError(timeoutMs, label));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
  }
}
`,
          astRules: { requireAsync: true, requireGenerics: true, requireClass: true },
          testCases: [
            {
              id: 's5-p4-c2-t1',
              name: 'Resolves normally when task completes within deadline',
              harnessCode: `
                const { promiseTimeout } = exports as { promiseTimeout: any };
                const fast = new Promise<string>((r) => setTimeout(() => r('done'), 4));
                return await promiseTimeout(fast, 40, 'FetchUser');
              `,
              expected: 'done',
            },
            {
              id: 's5-p4-c2-t2',
              name: 'Rejects with TimeoutError and exact message when task exceeds deadline',
              harnessCode: `
                const { promiseTimeout, TimeoutError } = exports as { promiseTimeout: any; TimeoutError: any };
                const slow = new Promise<string>((r) => setTimeout(() => r('late'), 45));
                try {
                  await promiseTimeout(slow, 8, 'DBQuery');
                  return { timedOut: false };
                } catch (err: any) {
                  return {
                    isTimeout: err instanceof TimeoutError,
                    name: err.name,
                    ms: err.timeoutMs,
                    msg: err.message,
                  };
                }
              `,
              expected: {
                isTimeout: true,
                name: 'TimeoutError',
                ms: 8,
                msg: 'DBQuery timed out after 8ms',
              },
            },
            {
              id: 's5-p4-c2-t3',
              name: 'Propagates underlying task rejection when it fails before deadline',
              harnessCode: `
                const { promiseTimeout, TimeoutError } = exports as { promiseTimeout: any; TimeoutError: any };
                const failing = new Promise<never>((_, rej) => setTimeout(() => rej(new Error('boom')), 3));
                try {
                  await promiseTimeout(failing, 40);
                  return 'ok';
                } catch (err: any) {
                  return { isTimeout: err instanceof TimeoutError, msg: err.message };
                }
              `,
              expected: { isTimeout: false, msg: 'boom' },
            },
            {
              id: 's5-p4-c2-t4',
              name: 'Hidden: Default label formats as "Operation timed out after <ms>ms"',
              hidden: true,
              harnessCode: `
                const { promiseTimeout } = exports as { promiseTimeout: any };
                const never = new Promise<number>(() => {});
                try {
                  await promiseTimeout(never, 6);
                  return '';
                } catch (e: any) {
                  return e.message;
                }
              `,
              expected: 'Operation timed out after 6ms',
            },
            {
              id: 's5-p4-c2-t5',
              name: 'Hidden: Preserves resolved complex object types',
              hidden: true,
              harnessCode: `
                const { promiseTimeout } = exports as { promiseTimeout: any };
                return await promiseTimeout(Promise.resolve({ ok: true, items: [1, 2] }), 25);
              `,
              expected: { ok: true, items: [1, 2] },
            },
          ],
        },
        {
          id: 's5-p4-c3',
          title: 'Discriminated Settlement Combinator (settleAllTyped)',
          style: 'leetcode',
          difficulty: 'medium',
          description: `Implement \`settleAllTyped<T>(tasks)\` that launches an array of async task thunks \`() => Promise<T>\` **concurrently** and aggregates their outcomes into a structured report without ever rejecting:

\`\`\`ts
export type SettledItem<T> =
  | { readonly ok: true; readonly index: number; readonly value: T }
  | { readonly ok: false; readonly index: number; readonly reason: string };

export interface SettlementReport<T> {
  readonly results: SettledItem<T>[];
  readonly succeeded: T[];
  readonly failedCount: number;
}
\`\`\`

- Preserve exact input index order in both \`results\` and \`succeeded\`.
- Format errors as \`err instanceof Error ? err.message : String(err)\`.
- Safely catch **synchronous** exceptions thrown when invoking \`tasks[i]()\` as failed items too!`,
          tags: ['Promises', 'Discriminated Unions', 'Concurrency', 'Error Handling'],
          hints: [
            'Wrap each thunk invocation in an async IIFE: (async () => { try { const value = await fn(); return { ok: true, index, value }; } catch (err) { ... } })().',
            'Await Promise.all(wrapped) so all tasks run concurrently and resolve in input order.',
          ],
          starterCode: `export type SettledItem<T> =
  | { readonly ok: true; readonly index: number; readonly value: T }
  | { readonly ok: false; readonly index: number; readonly reason: string };

export interface SettlementReport<T> {
  readonly results: SettledItem<T>[];
  readonly succeeded: T[];
  readonly failedCount: number;
}

export async function settleAllTyped<T>(
  _tasks: readonly (() => Promise<T>)[]
): Promise<SettlementReport<T>> {
  return { results: [], succeeded: [], failedCount: 0 };
}
`,
          referenceSolution: `export type SettledItem<T> =
  | { readonly ok: true; readonly index: number; readonly value: T }
  | { readonly ok: false; readonly index: number; readonly reason: string };

export interface SettlementReport<T> {
  readonly results: SettledItem<T>[];
  readonly succeeded: T[];
  readonly failedCount: number;
}

export async function settleAllTyped<T>(
  tasks: readonly (() => Promise<T>)[]
): Promise<SettlementReport<T>> {
  const results = await Promise.all(
    tasks.map(async (task, index): Promise<SettledItem<T>> => {
      try {
        const value = await task();
        return { ok: true, index, value };
      } catch (err: unknown) {
        const reason = err instanceof Error ? err.message : String(err);
        return { ok: false, index, reason };
      }
    })
  );

  const succeeded: T[] = [];
  let failedCount = 0;
  for (const item of results) {
    if (item.ok) {
      succeeded.push(item.value);
    } else {
      failedCount++;
    }
  }

  return { results, succeeded, failedCount };
}
`,
          astRules: { requireAsync: true, requireGenerics: true },
          testCases: [
            {
              id: 's5-p4-c3-t1',
              name: 'Collects mixed successes and rejections in original index order',
              harnessCode: `
                const { settleAllTyped } = exports as { settleAllTyped: any };
                const delay = <V>(ms: number, val: V) => new Promise<V>((r) => setTimeout(() => r(val), ms));
                return await settleAllTyped([
                  () => delay(12, 'first'),
                  async () => { throw new Error('bad-second'); },
                  () => delay(3, 'third'),
                ]);
              `,
              expected: {
                results: [
                  { ok: true, index: 0, value: 'first' },
                  { ok: false, index: 1, reason: 'bad-second' },
                  { ok: true, index: 2, value: 'third' },
                ],
                succeeded: ['first', 'third'],
                failedCount: 1,
              },
            },
            {
              id: 's5-p4-c3-t2',
              name: 'Executes all thunks concurrently rather than sequentially',
              harnessCode: `
                const { settleAllTyped } = exports as { settleAllTyped: any };
                const t0 = performance.now();
                const report = await settleAllTyped([
                  () => new Promise<number>((r) => setTimeout(() => r(1), 12)),
                  () => new Promise<number>((r) => setTimeout(() => r(2), 12)),
                  () => new Promise<number>((r) => setTimeout(() => r(3), 12)),
                ]);
                const elapsed = performance.now() - t0;
                return { succeeded: report.succeeded, concurrent: elapsed < 32 };
              `,
              expected: { succeeded: [1, 2, 3], concurrent: true },
            },
            {
              id: 's5-p4-c3-t3',
              name: 'Catches synchronous throws and non-Error string rejections safely',
              harnessCode: `
                const { settleAllTyped } = exports as { settleAllTyped: any };
                return await settleAllTyped([
                  () => { throw new Error('sync-boom'); },
                  () => Promise.reject('raw-reason'),
                ]);
              `,
              expected: {
                results: [
                  { ok: false, index: 0, reason: 'sync-boom' },
                  { ok: false, index: 1, reason: 'raw-reason' },
                ],
                succeeded: [],
                failedCount: 2,
              },
            },
            {
              id: 's5-p4-c3-t4',
              name: 'Hidden: Handles empty task array cleanly',
              hidden: true,
              harnessCode: `
                const { settleAllTyped } = exports as { settleAllTyped: any };
                return await settleAllTyped([]);
              `,
              expected: { results: [], succeeded: [], failedCount: 0 },
            },
            {
              id: 's5-p4-c3-t5',
              name: 'Hidden: Preserves falsy resolved values (0, false, "") in succeeded',
              hidden: true,
              harnessCode: `
                const { settleAllTyped } = exports as { settleAllTyped: any };
                const rep = await settleAllTyped([
                  async () => 0,
                  async () => false,
                  async () => '',
                ]);
                return { succeeded: rep.succeeded, failedCount: rep.failedCount };
              `,
              expected: { succeeded: [0, false, ''], failedCount: 0 },
            },
          ],
        },
        {
          id: 's5-p4-c4',
          title: 'Recursive Promise Unwrapping (MyAwaited<T>)',
          style: 'type-challenge',
          difficulty: 'medium',
          description: `Implement TypeScript's built-in \`Awaited<T>\` from scratch as \`MyAwaited<T>\` **without** referencing \`Awaited\` or \`any\`:

- Recursively unwraps \`Promise<U>\` and nested \`Promise<Promise<U>>\`.
- Unwraps custom thenables matching \`{ then(onfulfilled: (value: infer V) => never): unknown }\`.
- Distributes over union types (e.g. \`Promise<string> | number\` $\\rightarrow$ \`string | number\`).
- Leaves primitives, objects without callable \`then\`, \`null\`, and \`undefined\` untouched.`,
          tags: ['Type Challenge', 'Promises', 'Recursive Types', 'infer'],
          hints: [
            'Check null | undefined or non-object types first, or match T extends object & { then(onfulfilled: (value: infer V) => never): unknown } ? MyAwaited<V> : T.',
            'Why `(value: infer V) => never`? Because `never` is assignable to any callback return type (`void`, `PromiseLike`, etc.) without needing `any`!',
          ],
          starterCode: `export type MyAwaited<T> = T;
`,
          referenceSolution: `export type MyAwaited<T> = T extends null | undefined
  ? T
  : T extends object & { then(onfulfilled: (value: infer V) => never): unknown }
    ? MyAwaited<V>
    : T;
`,
          astRules: { requireGenerics: true },
          typeAssertionPrelude: `import type { MyAwaited } from './solution';

interface CustomThenable<V> {
  then(cb: (val: V) => void): void;
}`,
          typeAssertions: [
            {
              id: 's5-p4-c4-a1',
              name: 'Unwraps standard Promise<T>',
              assertion: `Expect<Equal<MyAwaited<Promise<string>>, string>>`,
            },
            {
              id: 's5-p4-c4-a2',
              name: 'Recursively unwraps deeply nested Promises',
              assertion: `Expect<Equal<MyAwaited<Promise<Promise<Promise<{ id: number }>>>>, { id: number }>>`,
            },
            {
              id: 's5-p4-c4-a3',
              name: 'Unwraps custom structural thenable objects',
              assertion: `Expect<Equal<MyAwaited<CustomThenable<boolean>>, boolean>>`,
            },
            {
              id: 's5-p4-c4-a4',
              name: 'Distributes cleanly across mixed Promise and non-Promise unions',
              assertion: `Expect<Equal<MyAwaited<Promise<number> | Promise<Promise<'ok'>> | null>, number | 'ok' | null>>`,
            },
            {
              id: 's5-p4-c4-a5',
              name: 'Hidden: Does not unwrap objects whose "then" property is not a callable function',
              hidden: true,
              assertion: `Expect<Equal<MyAwaited<{ then: boolean; value: number }>, { then: boolean; value: number }>>`,
            },
            {
              id: 's5-p4-c4-a6',
              name: 'Hidden: Unwraps custom thenable returning nested Promise',
              hidden: true,
              assertion: `Expect<Equal<MyAwaited<CustomThenable<Promise<readonly [1, 2]>>>, readonly [1, 2]>>`,
            },
          ],
          testCases: [],
        },
      ],
    },
    {
      id: 's5-p5',
      number: 5,
      title: 'Concurrency Control, Semaphores & Async Pipelines',
      subtitle: 'Worker pools, FIFO semaphores, stampede-safe async memoization, and micro-batching',
      conceptSummary: `### Controlling Unbounded Concurrency

Calling \`Promise.all(items.map(fetch))\` on 10,000 items opens 10,000 simultaneous sockets and exhausts rate limits or memory. Senior engineers bound and coalesce async work:

- **Worker-Pool Mapping (\`mapWithConcurrency\`)**: Spawns \`Math.min(concurrency, items.length)\` worker coroutines pulling from a shared cursor \`nextIndex++\` while writing into \`results[index]\`.
- **\`AsyncSemaphore\`**: Queues \`resolve\` callbacks in FIFO order when permits hit \`0\`, handing out idempotent \`release()\` tokens.
- **In-Flight Deduplication (\`memoizeAsync\`)**: Stores the pending \`Promise<R>\` in the cache immediately so concurrent identical requests share one network call, evicting on rejection.
- **Micro-Batching (\`AsyncBatcher\`)**: Coalesces individual \`load(key)\` calls within a time window or batch-size cap into a single bulk query.`,
      challenges: [
        {
          id: 's5-p5-c1',
          title: 'Bounded Concurrency Mapper (mapWithConcurrency)',
          style: 'leetcode',
          difficulty: 'hard',
          description: `Implement \`mapWithConcurrency<T, R>(items, concurrency, worker)\`:

- Throw an \`Error\` if \`!Number.isInteger(concurrency) || concurrency < 1\`.
- Return \`[]\` immediately when \`items.length === 0\`.
- Execute \`worker(item, index)\` across \`items\` such that **at most \`concurrency\` promises are active simultaneously**.
- Return \`R[]\` in the **exact original input order**, regardless of which items finish fastest.
- Reject immediately if any \`worker\` invocation rejects.`,
          tags: ['Concurrency', 'Worker Pool', 'Async/Await', 'Generics'],
          hints: [
            'Share a mutable cursor let cursor = 0 across Math.min(concurrency, items.length) async worker loops.',
            'Inside each loop: while (cursor < items.length) { const idx = cursor++; results[idx] = await worker(items[idx], idx); }.',
          ],
          starterCode: `export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  _concurrency: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  return Promise.all(items.map((item, idx) => worker(item, idx)));
}
`,
          referenceSolution: `export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error('concurrency must be an integer >= 1');
  }
  if (items.length === 0) {
    return [];
  }

  const results = new Array<R>(items.length);
  let cursor = 0;

  const runner = async (): Promise<void> => {
    while (cursor < items.length) {
      const currentIndex = cursor++;
      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  };

  const workerCount = Math.min(concurrency, items.length);
  const pool: Promise<void>[] = [];
  for (let i = 0; i < workerCount; i++) {
    pool.push(runner());
  }

  await Promise.all(pool);
  return results;
}
`,
          astRules: { requireAsync: true, requireGenerics: true },
          testCases: [
            {
              id: 's5-p5-c1-t1',
              name: 'Caps simultaneous active workers while preserving input order',
              harnessCode: `
                const { mapWithConcurrency } = exports as { mapWithConcurrency: any };
                let active = 0;
                let maxActive = 0;
                const delays = [14, 4, 10, 3, 8, 5];
                const out = await mapWithConcurrency(delays, 2, async (ms: number, idx: number) => {
                  active++;
                  if (active > maxActive) maxActive = active;
                  await new Promise((r) => setTimeout(r, ms));
                  active--;
                  return idx * 10 + ms;
                });
                return { maxActive, out };
              `,
              expected: { maxActive: 2, out: [14, 14, 30, 33, 48, 55] },
            },
            {
              id: 's5-p5-c1-t2',
              name: 'Concurrency 1 runs strictly sequentially',
              harnessCode: `
                const { mapWithConcurrency } = exports as { mapWithConcurrency: any };
                const trace: string[] = [];
                const out = await mapWithConcurrency(['a', 'b', 'c'], 1, async (ch: string) => {
                  trace.push('start:' + ch);
                  await new Promise((r) => setTimeout(r, 3));
                  trace.push('end:' + ch);
                  return ch.toUpperCase();
                });
                return { out, trace };
              `,
              expected: {
                out: ['A', 'B', 'C'],
                trace: ['start:a', 'end:a', 'start:b', 'end:b', 'start:c', 'end:c'],
              },
            },
            {
              id: 's5-p5-c1-t3',
              name: 'Propagates worker rejection',
              harnessCode: `
                const { mapWithConcurrency } = exports as { mapWithConcurrency: any };
                try {
                  await mapWithConcurrency([1, 2, 3, 4], 2, async (n: number) => {
                    await new Promise((r) => setTimeout(r, 3));
                    if (n === 3) throw new Error('worker-3-failed');
                    return n;
                  });
                  return 'ok';
                } catch (e: any) {
                  return e.message;
                }
              `,
              expected: 'worker-3-failed',
            },
            {
              id: 's5-p5-c1-t4',
              name: 'Hidden: Empty items array and concurrency larger than items.length',
              hidden: true,
              harnessCode: `
                const { mapWithConcurrency } = exports as { mapWithConcurrency: any };
                const empty = await mapWithConcurrency([], 4, async (x: number) => x);
                const small = await mapWithConcurrency([5, 6], 10, async (x: number) => x * 2);
                return { empty, small };
              `,
              expected: { empty: [], small: [10, 12] },
            },
            {
              id: 's5-p5-c1-t5',
              name: 'Hidden: Rejects invalid concurrency <= 0 or fractional',
              hidden: true,
              harnessCode: `
                const { mapWithConcurrency } = exports as { mapWithConcurrency: any };
                let e1 = false, e2 = false;
                try { await mapWithConcurrency([1], 0, async (x: number) => x); } catch { e1 = true; }
                try { await mapWithConcurrency([1], 1.5, async (x: number) => x); } catch { e2 = true; }
                return [e1, e2];
              `,
              expected: [true, true],
            },
          ],
        },
        {
          id: 's5-p5-c2',
          title: 'Fair FIFO Async Semaphore (AsyncSemaphore)',
          style: 'leetcode',
          difficulty: 'hard',
          description: `Implement a fair FIFO counting semaphore \`AsyncSemaphore\`:

- \`constructor(permits: number)\`: throws \`Error\` if \`!Number.isInteger(permits) || permits < 1\`.
- \`acquire(): Promise<() => void>\`:
  - If a permit is available, decrements available permits immediately and resolves with an **idempotent** \`release()\` function (calling the same \`release()\` multiple times must only release **one** permit!).
  - Otherwise queues the caller in strict FIFO order until a permit is released.
- \`runExclusive<T>(fn: () => Promise<T>): Promise<T>\`: acquires a permit, runs \`fn()\`, and guarantees release in \`finally\`.
- \`availablePermits(): number\` and \`waitingCount(): number\`.`,
          tags: ['Semaphore', 'Synchronization', 'Classes', 'Async/Await'],
          hints: [
            'When releasing: if waiters.length > 0, dequeue the oldest waiter and hand it a fresh one-shot release callback directly without incrementing available permits.',
            'Guard each issued release callback with let released = false so duplicate calls are harmless no-ops.',
          ],
          starterCode: `export class AsyncSemaphore {
  private permits: number;

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<() => void> {
    return () => {};
  }

  async runExclusive<T>(fn: () => Promise<T>): Promise<T> {
    return fn();
  }

  availablePermits(): number {
    return this.permits;
  }

  waitingCount(): number {
    return 0;
  }
}
`,
          referenceSolution: `export class AsyncSemaphore {
  private available: number;
  private readonly waiters: Array<(release: () => void) => void> = [];

  constructor(permits: number) {
    if (!Number.isInteger(permits) || permits < 1) {
      throw new Error('permits must be an integer >= 1');
    }
    this.available = permits;
  }

  private createReleaseToken(): () => void {
    let released = false;
    return () => {
      if (released) return;
      released = true;
      const nextWaiter = this.waiters.shift();
      if (nextWaiter) {
        nextWaiter(this.createReleaseToken());
      } else {
        this.available++;
      }
    };
  }

  acquire(): Promise<() => void> {
    if (this.available > 0) {
      this.available--;
      return Promise.resolve(this.createReleaseToken());
    }
    return new Promise<() => void>((resolve) => {
      this.waiters.push(resolve);
    });
  }

  async runExclusive<T>(fn: () => Promise<T>): Promise<T> {
    const release = await this.acquire();
    try {
      return await fn();
    } finally {
      release();
    }
  }

  availablePermits(): number {
    return this.available;
  }

  waitingCount(): number {
    return this.waiters.length;
  }
}
`,
          astRules: { requireClass: true, requireAsync: true },
          testCases: [
            {
              id: 's5-p5-c2-t1',
              name: 'Enforces FIFO wake order across queued waiters',
              harnessCode: `
                const { AsyncSemaphore } = exports as { AsyncSemaphore: new (p: number) => any };
                const sem = new AsyncSemaphore(1);
                const wakeOrder: string[] = [];
                const r0 = await sem.acquire();
                const p1 = sem.acquire().then((rel: () => void) => { wakeOrder.push('w1'); rel(); });
                const p2 = sem.acquire().then((rel: () => void) => { wakeOrder.push('w2'); rel(); });
                const p3 = sem.acquire().then((rel: () => void) => { wakeOrder.push('w3'); rel(); });
                const waiting = sem.waitingCount();
                r0();
                await Promise.all([p1, p2, p3]);
                return { waiting, wakeOrder, finalPermits: sem.availablePermits() };
              `,
              expected: { waiting: 3, wakeOrder: ['w1', 'w2', 'w3'], finalPermits: 1 },
            },
            {
              id: 's5-p5-c2-t2',
              name: 'Release callback is idempotent when called multiple times',
              harnessCode: `
                const { AsyncSemaphore } = exports as { AsyncSemaphore: new (p: number) => any };
                const sem = new AsyncSemaphore(2);
                const rel = await sem.acquire();
                rel();
                rel();
                rel();
                return sem.availablePermits();
              `,
              expected: 2,
            },
            {
              id: 's5-p5-c2-t3',
              name: 'runExclusive always releases permit when fn rejects',
              harnessCode: `
                const { AsyncSemaphore } = exports as { AsyncSemaphore: new (p: number) => any };
                const sem = new AsyncSemaphore(1);
                let caught = false;
                try {
                  await sem.runExclusive(async () => {
                    throw new Error('crash');
                  });
                } catch {
                  caught = true;
                }
                const afterVal = await sem.runExclusive(async () => 42);
                return { caught, afterVal, avail: sem.availablePermits() };
              `,
              expected: { caught: true, afterVal: 42, avail: 1 },
            },
            {
              id: 's5-p5-c2-t4',
              name: 'Hidden: Caps active critical-section concurrency at permits',
              hidden: true,
              harnessCode: `
                const { AsyncSemaphore } = exports as { AsyncSemaphore: new (p: number) => any };
                const sem = new AsyncSemaphore(2);
                let active = 0, peak = 0;
                await Promise.all([1, 2, 3, 4, 5].map(() =>
                  sem.runExclusive(async () => {
                    active++;
                    if (active > peak) peak = active;
                    await new Promise((r) => setTimeout(r, 5));
                    active--;
                  })
                ));
                return { peak, avail: sem.availablePermits() };
              `,
              expected: { peak: 2, avail: 2 },
            },
            {
              id: 's5-p5-c2-t5',
              name: 'Hidden: Rejects invalid permit count <= 0',
              hidden: true,
              harnessCode: `
                const { AsyncSemaphore } = exports as { AsyncSemaphore: new (p: number) => any };
                try { new AsyncSemaphore(0); return false; } catch { return true; }
              `,
              expected: true,
            },
          ],
        },
        {
          id: 's5-p5-c3',
          title: 'In-Flight Deduplicating Async Memoizer (memoizeAsync)',
          style: 'leetcode',
          difficulty: 'hard',
          description: `Implement \`memoizeAsync<Args, R>(fn, keyResolver)\` to cache resolved promises **and** deduplicate concurrent in-flight calls for the same key:

- When multiple callers request the same key before the first call settles, \`fn\` must be invoked **only once** and all callers receive the shared promise outcome.
- If the promise resolves, keep it cached for future calls.
- If the promise **rejects**, remove that key from the cache (only if the cache still holds that exact promise) so subsequent retries re-execute \`fn\`.
- Attach control methods on the returned function:
  - \`cacheSize(): number\`
  - \`invalidate(key: string): boolean\`
  - \`clear(): void\``,
          tags: ['Memoization', 'Cache Stampede', 'Async/Await', 'Generics'],
          hints: [
            'Store Map<string, Promise<R>> immediately before awaiting! Attach .catch((err) => { if (cache.get(key) === pending) cache.delete(key); throw err; }) or handle inside an async wrapper.',
            'Use Object.assign(wrapper, { cacheSize, invalidate, clear }) to attach typed cache management methods cleanly.',
          ],
          starterCode: `export interface AsyncMemoized<Args extends readonly unknown[], R> {
  (...args: Args): Promise<R>;
  cacheSize(): number;
  invalidate(key: string): boolean;
  clear(): void;
}

export function memoizeAsync<Args extends readonly unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  _keyResolver: (...args: Args) => string
): AsyncMemoized<Args, R> {
  const wrapped = (...args: Args): Promise<R> => fn(...args);
  return Object.assign(wrapped, {
    cacheSize: () => 0,
    invalidate: (_key: string) => false,
    clear: () => {},
  });
}
`,
          referenceSolution: `export interface AsyncMemoized<Args extends readonly unknown[], R> {
  (...args: Args): Promise<R>;
  cacheSize(): number;
  invalidate(key: string): boolean;
  clear(): void;
}

export function memoizeAsync<Args extends readonly unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  keyResolver: (...args: Args) => string
): AsyncMemoized<Args, R> {
  const cache = new Map<string, Promise<R>>();

  const wrapped = (...args: Args): Promise<R> => {
    const key = keyResolver(...args);
    const existing = cache.get(key);
    if (existing !== undefined) {
      return existing;
    }

    let pending: Promise<R> | undefined;
    const execute = async (): Promise<R> => {
      try {
        return await fn(...args);
      } catch (err: unknown) {
        if (cache.get(key) === pending) {
          cache.delete(key);
        }
        throw err;
      }
    };

    pending = execute();
    cache.set(key, pending);
    return pending;
  };

  return Object.assign(wrapped, {
    cacheSize: () => cache.size,
    invalidate: (key: string) => cache.delete(key),
    clear: () => {
      cache.clear();
    },
  });
}
`,
          astRules: { requireAsync: true, requireGenerics: true },
          testCases: [
            {
              id: 's5-p5-c3-t1',
              name: 'Deduplicates concurrent in-flight requests for the same key',
              harnessCode: `
                const { memoizeAsync } = exports as { memoizeAsync: any };
                let executions = 0;
                const getUser = memoizeAsync(
                  async (id: number) => {
                    executions++;
                    await new Promise((r) => setTimeout(r, 8));
                    return { id, name: 'U' + id };
                  },
                  (id: number) => String(id)
                );
                const [a, b, c] = await Promise.all([getUser(7), getUser(7), getUser(7)]);
                const d = await getUser(7);
                return { executions, same: a.name === b.name && c.name === d.name, size: getUser.cacheSize() };
              `,
              expected: { executions: 1, same: true, size: 1 },
            },
            {
              id: 's5-p5-c3-t2',
              name: 'Evicts rejected promises so subsequent retry succeeds',
              harnessCode: `
                const { memoizeAsync } = exports as { memoizeAsync: any };
                let attempt = 0;
                const load = memoizeAsync(
                  async (k: string) => {
                    attempt++;
                    await new Promise((r) => setTimeout(r, 4));
                    if (attempt === 1) throw new Error('transient');
                    return k + '-ok';
                  },
                  (k: string) => k
                );
                let firstErr = '';
                try { await load('item'); } catch (e: any) { firstErr = e.message; }
                const sizeAfterFail = load.cacheSize();
                const secondVal = await load('item');
                return { firstErr, sizeAfterFail, secondVal, attempt };
              `,
              expected: { firstErr: 'transient', sizeAfterFail: 0, secondVal: 'item-ok', attempt: 2 },
            },
            {
              id: 's5-p5-c3-t3',
              name: 'Supports manual invalidate() and clear()',
              harnessCode: `
                const { memoizeAsync } = exports as { memoizeAsync: any };
                let n = 0;
                const fn = memoizeAsync(async (x: string) => \`\${x}:\${++n}\`, (x: string) => x);
                const v1 = await fn('a');
                const v2 = await fn('b');
                const removed = fn.invalidate('a');
                const v3 = await fn('a');
                fn.clear();
                return { v1, v2, removed, v3, finalSize: fn.cacheSize() };
              `,
              expected: { v1: 'a:1', v2: 'b:2', removed: true, v3: 'a:3', finalSize: 0 },
            },
            {
              id: 's5-p5-c3-t4',
              name: 'Hidden: Multi-argument keyResolver distinguishes composite keys',
              hidden: true,
              harnessCode: `
                const { memoizeAsync } = exports as { memoizeAsync: any };
                let calls = 0;
                const sumAsync = memoizeAsync(
                  async (a: number, b: number) => { calls++; return a + b; },
                  (a: number, b: number) => \`\${a}:\${b}\`
                );
                const r1 = await sumAsync(1, 23);
                const r2 = await sumAsync(12, 3);
                const r3 = await sumAsync(1, 23);
                return { r1, r2, r3, calls };
              `,
              expected: { r1: 24, r2: 15, r3: 24, calls: 2 },
            },
            {
              id: 's5-p5-c3-t5',
              name: 'Hidden: Concurrent callers on a failing key all observe the rejection before eviction',
              hidden: true,
              harnessCode: `
                const { memoizeAsync } = exports as { memoizeAsync: any };
                let runs = 0;
                const failOnce = memoizeAsync(
                  async (k: string) => {
                    runs++;
                    await new Promise((r) => setTimeout(r, 5));
                    throw new Error('err-' + k);
                  },
                  (k: string) => k
                );
                const settled = await Promise.allSettled([failOnce('x'), failOnce('x')]);
                return {
                  runs,
                  bothRejected: settled.every((s) => s.status === 'rejected'),
                  size: failOnce.cacheSize(),
                };
              `,
              expected: { runs: 1, bothRejected: true, size: 0 },
            },
          ],
        },
        {
          id: 's5-p5-c4',
          title: 'Micro-Batching Async Processor (AsyncBatcher<K, V>)',
          style: 'leetcode',
          difficulty: 'hard',
          description: `Implement a DataLoader-inspired \`AsyncBatcher<K, V>\` that coalesces individual \`load(key)\` calls into bulk \`batchFn(keys)\` invocations:

- \`constructor(batchFn: (keys: readonly K[]) => Promise<readonly V[]>, options: { maxBatchSize: number; windowMs: number })\`
- \`load(key: K): Promise<V>\`:
  - Appends \`key\` to the current pending batch.
  - Starts a \`windowMs\` flush timer when the first item enters an empty pending batch.
  - If the pending batch reaches \`options.maxBatchSize\`, cancels the pending timer and flushes **immediately**!
- During flush:
  - Calls \`batchFn(keys)\`.
  - If \`batchFn\` returns an array whose \`length !== keys.length\`, reject every item in that batch with \`new Error('Batch result length mismatch')\`.
  - If \`batchFn\` rejects, reject every item in that batch with the same error.
  - Otherwise resolve item \`i\` with \`values[i]\`.`,
          tags: ['Batching', 'DataLoader', 'Async/Await', 'Classes', 'Generics'],
          hints: [
            'Keep pending: Array<{ key: K; resolve: (v: V) => void; reject: (e: unknown) => void }> and timerId: ReturnType<typeof setTimeout> | undefined.',
            'Detach const currentBatch = this.pending; this.pending = []; and clear timerId synchronously at the start of flush() before awaiting batchFn!',
          ],
          starterCode: `export interface BatcherOptions {
  readonly maxBatchSize: number;
  readonly windowMs: number;
}

export class AsyncBatcher<K, V> {
  private readonly batchFn: (keys: readonly K[]) => Promise<readonly V[]>;

  constructor(
    batchFn: (keys: readonly K[]) => Promise<readonly V[]>,
    _options: BatcherOptions
  ) {
    this.batchFn = batchFn;
  }

  async load(key: K): Promise<V> {
    const res = await this.batchFn([key]);
    return res[0];
  }
}
`,
          referenceSolution: `export interface BatcherOptions {
  readonly maxBatchSize: number;
  readonly windowMs: number;
}

interface PendingEntry<K, V> {
  readonly key: K;
  readonly resolve: (value: V) => void;
  readonly reject: (reason: unknown) => void;
}

export class AsyncBatcher<K, V> {
  private readonly batchFn: (keys: readonly K[]) => Promise<readonly V[]>;
  private readonly maxBatchSize: number;
  private readonly windowMs: number;
  private pending: PendingEntry<K, V>[] = [];
  private timerId: ReturnType<typeof setTimeout> | undefined;

  constructor(
    batchFn: (keys: readonly K[]) => Promise<readonly V[]>,
    options: BatcherOptions
  ) {
    if (!Number.isInteger(options.maxBatchSize) || options.maxBatchSize < 1 || options.windowMs < 0) {
      throw new Error('Invalid BatcherOptions');
    }
    this.batchFn = batchFn;
    this.maxBatchSize = options.maxBatchSize;
    this.windowMs = options.windowMs;
  }

  private flush(): void {
    if (this.timerId !== undefined) {
      clearTimeout(this.timerId);
      this.timerId = undefined;
    }
    if (this.pending.length === 0) {
      return;
    }

    const batch = this.pending;
    this.pending = [];
    const keys = batch.map((entry) => entry.key);

    void (async () => {
      try {
        const values = await this.batchFn(keys);
        if (values.length !== batch.length) {
          const mismatch = new Error('Batch result length mismatch');
          for (const entry of batch) {
            entry.reject(mismatch);
          }
          return;
        }
        for (let i = 0; i < batch.length; i++) {
          batch[i].resolve(values[i]);
        }
      } catch (err: unknown) {
        for (const entry of batch) {
          entry.reject(err);
        }
      }
    })();
  }

  load(key: K): Promise<V> {
    return new Promise<V>((resolve, reject) => {
      this.pending.push({ key, resolve, reject });
      if (this.pending.length >= this.maxBatchSize) {
        this.flush();
      } else if (this.timerId === undefined) {
        this.timerId = setTimeout(() => {
          this.flush();
        }, this.windowMs);
      }
    });
  }
}
`,
          astRules: { requireClass: true, requireAsync: true, requireGenerics: true },
          testCases: [
            {
              id: 's5-p5-c4-t1',
              name: 'Coalesces calls within windowMs into a single batch invocation',
              harnessCode: `
                const { AsyncBatcher } = exports as { AsyncBatcher: new <K, V>(fn: any, o: any) => any };
                const batches: number[][] = [];
                const batcher = new AsyncBatcher<number, string>(
                  async (keys: readonly number[]) => {
                    batches.push([...keys]);
                    return keys.map((k) => 'user-' + k);
                  },
                  { maxBatchSize: 10, windowMs: 8 }
                );
                const vals = await Promise.all([batcher.load(1), batcher.load(2), batcher.load(3)]);
                return { batches, vals };
              `,
              expected: { batches: [[1, 2, 3]], vals: ['user-1', 'user-2', 'user-3'] },
            },
            {
              id: 's5-p5-c4-t2',
              name: 'Splits immediately when maxBatchSize is reached',
              harnessCode: `
                const { AsyncBatcher } = exports as { AsyncBatcher: new <K, V>(fn: any, o: any) => any };
                const batches: string[][] = [];
                const batcher = new AsyncBatcher<string, string>(
                  async (keys: readonly string[]) => {
                    batches.push([...keys]);
                    return keys.map((k) => k.toUpperCase());
                  },
                  { maxBatchSize: 2, windowMs: 12 }
                );
                const vals = await Promise.all([
                  batcher.load('a'),
                  batcher.load('b'),
                  batcher.load('c'),
                  batcher.load('d'),
                  batcher.load('e'),
                ]);
                return { batches, vals };
              `,
              expected: {
                batches: [['a', 'b'], ['c', 'd'], ['e']],
                vals: ['A', 'B', 'C', 'D', 'E'],
              },
            },
            {
              id: 's5-p5-c4-t3',
              name: 'Rejects batch items when batchFn returns mismatched array length',
              harnessCode: `
                const { AsyncBatcher } = exports as { AsyncBatcher: new <K, V>(fn: any, o: any) => any };
                const batcher = new AsyncBatcher<number, number>(
                  async () => [100],
                  { maxBatchSize: 5, windowMs: 5 }
                );
                const settled = await Promise.allSettled([batcher.load(1), batcher.load(2)]);
                return settled.map((s: any) => s.status === 'rejected' ? s.reason.message : 'ok');
              `,
              expected: ['Batch result length mismatch', 'Batch result length mismatch'],
            },
            {
              id: 's5-p5-c4-t4',
              name: 'Hidden: Propagates batchFn rejection to all callers in that batch',
              hidden: true,
              harnessCode: `
                const { AsyncBatcher } = exports as { AsyncBatcher: new <K, V>(fn: any, o: any) => any };
                const batcher = new AsyncBatcher<string, number>(
                  async () => { throw new Error('db-offline'); },
                  { maxBatchSize: 2, windowMs: 10 }
                );
                const settled = await Promise.allSettled([batcher.load('x'), batcher.load('y')]);
                return settled.map((s: any) => s.status === 'rejected' ? s.reason.message : '');
              `,
              expected: ['db-offline', 'db-offline'],
            },
            {
              id: 's5-p5-c4-t5',
              name: 'Hidden: Subsequent window creates an independent second batch',
              hidden: true,
              harnessCode: `
                const { AsyncBatcher } = exports as { AsyncBatcher: new <K, V>(fn: any, o: any) => any };
                let batchCalls = 0;
                const batcher = new AsyncBatcher<number, number>(
                  async (keys: readonly number[]) => {
                    batchCalls++;
                    return keys.map((k) => k * 2);
                  },
                  { maxBatchSize: 5, windowMs: 5 }
                );
                const first = await batcher.load(4);
                const second = await batcher.load(9);
                return { first, second, batchCalls };
              `,
              expected: { first: 8, second: 18, batchCalls: 2 },
            },
          ],
        },
      ],
    },
  ],
  miniProject: {
    id: 's5-mp',
    title: 'Priority Async Job Queue & Sliding-Window Rate Limiter',
    subtitle: '4-file production task scheduler with priority ordering, rate limiting, bounded concurrency, and retry telemetry',
    difficulty: 'hard',
    description: `Design and wire together a 4-module **Async Job Queue** capable of scheduling prioritized background jobs under both a **concurrency cap** and a **sliding-window rate limit**, complete with transient-error retries and telemetry counters.

### Module Responsibilities
1. \`types.ts\`: Domain contracts (\`JobPriority\`, \`JobDefinition<T>\`, \`RateLimiterOptions\`, \`RetryPolicyOptions\`, \`JobOutcome<T>\`, \`QueueOptions\`, \`QueueStats\`).
2. \`rateLimiter.ts\`: \`SlidingWindowRateLimiter\` enforcing at most \`maxRequests\` acquisitions per \`windowMs\` window, serializing concurrent callers so bursts never slip past the quota.
3. \`retryPolicy.ts\`: \`executeWithRetry\` running \`(attempt) => Promise<T>\` up to \`maxAttempts\`, honoring \`isTransient\` and \`retryDelayMs\`, and reporting \`{ ok: true, value, attempts }\` or \`{ ok: false, errorMessage, attempts }\`.
4. \`jobQueue.ts\`: \`AsyncJobQueue\` scheduling queued jobs by priority (\`'high' > 'normal' > 'low'\`, FIFO tie-breaker), acquiring a rate-limiter slot before execution, respecting \`concurrency\`, supporting \`onIdle(): Promise<void>\`, and maintaining \`getStats(): QueueStats\`.`,
    architectureNotes: `- Priority weights: \`high = 3\`, \`normal = 2\`, \`low = 1\` (default \`'normal'\`).
- Acquire the concurrency slot first, dequeue the highest-priority waiting job, then await \`rateLimiter.acquire()\` inside \`executeWithRetry\` (or once per job dispatch — acquire once per job start before invoking \`executeWithRetry\`!) so concurrency and rate limits compose cleanly without deadlocking.
- \`enqueue<T>(job)\` resolves with \`JobOutcome<T>\` (never rejects!) and increments \`completed\`, \`failed\`, \`retriedAttempts\` (\`attempts - 1\` across all finished jobs), and \`maxObservedConcurrency\`.`,
    tags: ['Mini-Project', 'Job Queue', 'Rate Limiter', 'Concurrency', 'Retries'],
    hints: [
      'In SlidingWindowRateLimiter, chain acquisitions through a mutex promise chain (`this.chain = this.chain.then(...)`) so concurrent callers inspect and append timestamps one at a time!',
      'In AsyncJobQueue, sort or pick the queued entry with highest priority weight and smallest seq counter whenever activeCount < concurrency.',
      'Track retriedAttempts += outcome.attempts - 1 whenever a job finishes (whether it ultimately succeeded or failed).',
    ],
    entryFile: 'jobQueue.ts',
    astRules: { requireClass: true, requireAsync: true },
    files: [
      {
        path: 'types.ts',
        description: 'Shared priority, retry, rate-limiter, and queue telemetry contracts',
        readOnly: true,
        starterCode: `export type JobPriority = 'high' | 'normal' | 'low';

export interface JobDefinition<T> {
  readonly id: string;
  readonly priority?: JobPriority;
  readonly run: (attempt: number) => Promise<T>;
}

export interface RateLimiterOptions {
  readonly maxRequests: number;
  readonly windowMs: number;
}

export interface RetryPolicyOptions {
  readonly maxAttempts: number;
  readonly retryDelayMs: number;
  readonly isTransient?: (error: unknown) => boolean;
}

export type JobOutcome<T> =
  | { readonly id: string; readonly ok: true; readonly value: T; readonly attempts: number }
  | { readonly id: string; readonly ok: false; readonly error: string; readonly attempts: number };

export interface QueueOptions {
  readonly concurrency: number;
  readonly rateLimit: RateLimiterOptions;
  readonly retry: RetryPolicyOptions;
}

export interface QueueStats {
  readonly completed: number;
  readonly failed: number;
  readonly retriedAttempts: number;
  readonly maxObservedConcurrency: number;
}
`,
        referenceSolution: `export type JobPriority = 'high' | 'normal' | 'low';

export interface JobDefinition<T> {
  readonly id: string;
  readonly priority?: JobPriority;
  readonly run: (attempt: number) => Promise<T>;
}

export interface RateLimiterOptions {
  readonly maxRequests: number;
  readonly windowMs: number;
}

export interface RetryPolicyOptions {
  readonly maxAttempts: number;
  readonly retryDelayMs: number;
  readonly isTransient?: (error: unknown) => boolean;
}

export type JobOutcome<T> =
  | { readonly id: string; readonly ok: true; readonly value: T; readonly attempts: number }
  | { readonly id: string; readonly ok: false; readonly error: string; readonly attempts: number };

export interface QueueOptions {
  readonly concurrency: number;
  readonly rateLimit: RateLimiterOptions;
  readonly retry: RetryPolicyOptions;
}

export interface QueueStats {
  readonly completed: number;
  readonly failed: number;
  readonly retriedAttempts: number;
  readonly maxObservedConcurrency: number;
}
`,
      },
      {
        path: 'rateLimiter.ts',
        description: 'Serialized sliding-window rate limiter enforcing maxRequests per windowMs',
        starterCode: `import type { RateLimiterOptions } from './types';

export class SlidingWindowRateLimiter {
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(options: RateLimiterOptions) {
    this.maxRequests = options.maxRequests;
    this.windowMs = options.windowMs;
  }

  async acquire(): Promise<void> {
    void this.maxRequests;
    void this.windowMs;
  }
}
`,
        referenceSolution: `import type { RateLimiterOptions } from './types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, ms));
  });
}

export class SlidingWindowRateLimiter {
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly timestamps: number[] = [];
  private gate: Promise<void> = Promise.resolve();

  constructor(options: RateLimiterOptions) {
    if (options.maxRequests < 1 || options.windowMs <= 0) {
      throw new Error('Invalid RateLimiterOptions');
    }
    this.maxRequests = options.maxRequests;
    this.windowMs = options.windowMs;
  }

  acquire(): Promise<void> {
    const next = this.gate.then(async () => {
      for (;;) {
        const now = performance.now();
        while (this.timestamps.length > 0 && now - this.timestamps[0] >= this.windowMs) {
          this.timestamps.shift();
        }
        if (this.timestamps.length < this.maxRequests) {
          this.timestamps.push(performance.now());
          return;
        }
        const waitMs = Math.ceil(this.windowMs - (now - this.timestamps[0])) + 1;
        await delay(waitMs);
      }
    });
    this.gate = next.catch(() => {});
    return next;
  }
}
`,
      },
      {
        path: 'retryPolicy.ts',
        description: 'Retry runner returning structured success/failure outcome and attempt count',
        starterCode: `import type { RetryPolicyOptions } from './types';

export type RetryExecutionResult<T> =
  | { readonly ok: true; readonly value: T; readonly attempts: number }
  | { readonly ok: false; readonly error: string; readonly attempts: number };

export async function executeWithRetry<T>(
  operation: (attempt: number) => Promise<T>,
  _policy: RetryPolicyOptions
): Promise<RetryExecutionResult<T>> {
  const value = await operation(1);
  return { ok: true, value, attempts: 1 };
}
`,
        referenceSolution: `import type { RetryPolicyOptions } from './types';

export type RetryExecutionResult<T> =
  | { readonly ok: true; readonly value: T; readonly attempts: number }
  | { readonly ok: false; readonly error: string; readonly attempts: number };

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, ms));
  });
}

export async function executeWithRetry<T>(
  operation: (attempt: number) => Promise<T>,
  policy: RetryPolicyOptions
): Promise<RetryExecutionResult<T>> {
  const maxAttempts = Math.max(1, policy.maxAttempts);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const value = await operation(attempt);
      return { ok: true, value, attempts: attempt };
    } catch (err: unknown) {
      const transient = policy.isTransient ? policy.isTransient(err) : true;
      if (attempt === maxAttempts || !transient) {
        const message = err instanceof Error ? err.message : String(err);
        return { ok: false, error: message, attempts: attempt };
      }
      await wait(policy.retryDelayMs);
    }
  }

  return { ok: false, error: 'Retry exhausted', attempts: maxAttempts };
}
`,
      },
      {
        path: 'jobQueue.ts',
        description: 'Priority AsyncJobQueue coordinating concurrency, rate limiter, retries, and stats',
        starterCode: `import { SlidingWindowRateLimiter } from './rateLimiter';
import { executeWithRetry } from './retryPolicy';
import type { JobDefinition, JobOutcome, QueueOptions, QueueStats } from './types';

export class AsyncJobQueue {
  private readonly limiter: SlidingWindowRateLimiter;
  private readonly options: QueueOptions;

  constructor(options: QueueOptions) {
    this.options = options;
    this.limiter = new SlidingWindowRateLimiter(options.rateLimit);
  }

  async enqueue<T>(job: JobDefinition<T>): Promise<JobOutcome<T>> {
    await this.limiter.acquire();
    const res = await executeWithRetry(job.run, this.options.retry);
    if (res.ok) {
      return { id: job.id, ok: true, value: res.value, attempts: res.attempts };
    }
    return { id: job.id, ok: false, error: res.error, attempts: res.attempts };
  }

  async onIdle(): Promise<void> {}

  getStats(): QueueStats {
    return { completed: 0, failed: 0, retriedAttempts: 0, maxObservedConcurrency: 0 };
  }
}
`,
        referenceSolution: `import { SlidingWindowRateLimiter } from './rateLimiter';
import { executeWithRetry } from './retryPolicy';
import type { JobDefinition, JobOutcome, JobPriority, QueueOptions, QueueStats } from './types';

interface QueuedTask {
  readonly priorityWeight: number;
  readonly seq: number;
  readonly start: () => Promise<void>;
}

const PRIORITY_WEIGHT: Record<JobPriority, number> = {
  high: 3,
  normal: 2,
  low: 1,
};

export class AsyncJobQueue {
  private readonly limiter: SlidingWindowRateLimiter;
  private readonly options: QueueOptions;
  private readonly waiting: QueuedTask[] = [];
  private readonly idleWaiters: Array<() => void> = [];
  private seqCounter = 0;
  private activeCount = 0;
  private completed = 0;
  private failed = 0;
  private retriedAttempts = 0;
  private maxObservedConcurrency = 0;

  constructor(options: QueueOptions) {
    if (!Number.isInteger(options.concurrency) || options.concurrency < 1) {
      throw new Error('concurrency must be an integer >= 1');
    }
    this.options = options;
    this.limiter = new SlidingWindowRateLimiter(options.rateLimit);
  }

  private pickNextTask(): QueuedTask | undefined {
    if (this.waiting.length === 0) return undefined;
    let bestIdx = 0;
    for (let i = 1; i < this.waiting.length; i++) {
      const candidate = this.waiting[i];
      const best = this.waiting[bestIdx];
      if (
        candidate.priorityWeight > best.priorityWeight ||
        (candidate.priorityWeight === best.priorityWeight && candidate.seq < best.seq)
      ) {
        bestIdx = i;
      }
    }
    return this.waiting.splice(bestIdx, 1)[0];
  }

  private drain(): void {
    while (this.activeCount < this.options.concurrency) {
      const nextTask = this.pickNextTask();
      if (!nextTask) break;
      this.activeCount++;
      if (this.activeCount > this.maxObservedConcurrency) {
        this.maxObservedConcurrency = this.activeCount;
      }
      void nextTask.start().finally(() => {
        this.activeCount--;
        this.drain();
        if (this.activeCount === 0 && this.waiting.length === 0) {
          const resolvers = this.idleWaiters.splice(0, this.idleWaiters.length);
          for (const resolve of resolvers) {
            resolve();
          }
        }
      });
    }
  }

  enqueue<T>(job: JobDefinition<T>): Promise<JobOutcome<T>> {
    const weight = PRIORITY_WEIGHT[job.priority ?? 'normal'];
    const seq = this.seqCounter++;

    return new Promise<JobOutcome<T>>((resolve) => {
      this.waiting.push({
        priorityWeight: weight,
        seq,
        start: async () => {
          await this.limiter.acquire();
          const res = await executeWithRetry(job.run, this.options.retry);
          this.retriedAttempts += res.attempts - 1;
          if (res.ok) {
            this.completed++;
            resolve({ id: job.id, ok: true, value: res.value, attempts: res.attempts });
          } else {
            this.failed++;
            resolve({ id: job.id, ok: false, error: res.error, attempts: res.attempts });
          }
        },
      });
      this.drain();
    });
  }

  onIdle(): Promise<void> {
    if (this.activeCount === 0 && this.waiting.length === 0) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      this.idleWaiters.push(resolve);
    });
  }

  getStats(): QueueStats {
    return {
      completed: this.completed,
      failed: this.failed,
      retriedAttempts: this.retriedAttempts,
      maxObservedConcurrency: this.maxObservedConcurrency,
    };
  }
}
`,
      },
    ],
    testCases: [
      {
        id: 's5-mp-t1',
        name: 'Executes waiting jobs in strict high > normal > low priority order with FIFO tie-breaking',
        harnessCode: `
          const { AsyncJobQueue } = exports as { AsyncJobQueue: new (o: any) => any };
          const q = new AsyncJobQueue({
            concurrency: 1,
            rateLimit: { maxRequests: 50, windowMs: 100 },
            retry: { maxAttempts: 1, retryDelayMs: 2 },
          });
          const order: string[] = [];
          const p0 = q.enqueue({
            id: 'blocker',
            run: async () => {
              order.push('blocker');
              await new Promise((r) => setTimeout(r, 8));
              return 'b';
            },
          });
          const p1 = q.enqueue({ id: 'low-1', priority: 'low', run: async () => { order.push('low-1'); return 1; } });
          const p2 = q.enqueue({ id: 'norm-1', priority: 'normal', run: async () => { order.push('norm-1'); return 2; } });
          const p3 = q.enqueue({ id: 'high-1', priority: 'high', run: async () => { order.push('high-1'); return 3; } });
          const p4 = q.enqueue({ id: 'high-2', priority: 'high', run: async () => { order.push('high-2'); return 4; } });
          await Promise.all([p0, p1, p2, p3, p4]);
          return order;
        `,
        expected: ['blocker', 'high-1', 'high-2', 'norm-1', 'low-1'],
      },
      {
        id: 's5-mp-t2',
        name: 'Enforces bounded concurrency cap and records maxObservedConcurrency',
        harnessCode: `
          const { AsyncJobQueue } = exports as { AsyncJobQueue: new (o: any) => any };
          const q = new AsyncJobQueue({
            concurrency: 2,
            rateLimit: { maxRequests: 50, windowMs: 100 },
            retry: { maxAttempts: 1, retryDelayMs: 2 },
          });
          let active = 0, peak = 0;
          await Promise.all([1, 2, 3, 4, 5].map((i) =>
            q.enqueue({
              id: 'j' + i,
              run: async () => {
                active++;
                if (active > peak) peak = active;
                await new Promise((r) => setTimeout(r, 6));
                active--;
                return i;
              },
            })
          ));
          return { peak, stats: q.getStats() };
        `,
        expected: {
          peak: 2,
          stats: { completed: 5, failed: 0, retriedAttempts: 0, maxObservedConcurrency: 2 },
        },
      },
      {
        id: 's5-mp-t3',
        name: 'Retries transient errors automatically and tracks retriedAttempts',
        harnessCode: `
          const { AsyncJobQueue } = exports as { AsyncJobQueue: new (o: any) => any };
          const q = new AsyncJobQueue({
            concurrency: 2,
            rateLimit: { maxRequests: 50, windowMs: 100 },
            retry: {
              maxAttempts: 4,
              retryDelayMs: 3,
              isTransient: (e: unknown) => e instanceof Error && e.message.startsWith('TEMP'),
            },
          });
          const outcome = await q.enqueue({
            id: 'sync-job',
            run: async (attempt: number) => {
              if (attempt < 3) throw new Error('TEMP_NET');
              return 'synced';
            },
          });
          return { outcome, stats: q.getStats() };
        `,
        expected: {
          outcome: { id: 'sync-job', ok: true, value: 'synced', attempts: 3 },
          stats: { completed: 1, failed: 0, retriedAttempts: 2, maxObservedConcurrency: 1 },
        },
      },
      {
        id: 's5-mp-t4',
        name: 'Fails immediately without retrying non-transient errors',
        harnessCode: `
          const { AsyncJobQueue } = exports as { AsyncJobQueue: new (o: any) => any };
          const q = new AsyncJobQueue({
            concurrency: 2,
            rateLimit: { maxRequests: 50, windowMs: 100 },
            retry: {
              maxAttempts: 4,
              retryDelayMs: 3,
              isTransient: (e: unknown) => e instanceof Error && e.message === 'TEMP',
            },
          });
          const outcome = await q.enqueue({
            id: 'fatal-job',
            run: async () => {
              throw new Error('BAD_PAYLOAD');
            },
          });
          return { outcome, stats: q.getStats() };
        `,
        expected: {
          outcome: { id: 'fatal-job', ok: false, error: 'BAD_PAYLOAD', attempts: 1 },
          stats: { completed: 0, failed: 1, retriedAttempts: 0, maxObservedConcurrency: 1 },
        },
      },
      {
        id: 's5-mp-t5',
        name: 'Hidden: SlidingWindowRateLimiter paces bursts exceeding maxRequests per windowMs',
        hidden: true,
        harnessCode: `
          const { AsyncJobQueue } = exports as { AsyncJobQueue: new (o: any) => any };
          const q = new AsyncJobQueue({
            concurrency: 4,
            rateLimit: { maxRequests: 2, windowMs: 16 },
            retry: { maxAttempts: 1, retryDelayMs: 1 },
          });
          const t0 = performance.now();
          await Promise.all([1, 2, 3, 4].map((i) =>
            q.enqueue({ id: 'r' + i, run: async () => i })
          ));
          const elapsed = performance.now() - t0;
          return { throttled: elapsed >= 14, completed: q.getStats().completed };
        `,
        expected: { throttled: true, completed: 4 },
      },
      {
        id: 's5-mp-t6',
        name: 'Hidden: onIdle() resolves only after all queued and retrying jobs finish',
        hidden: true,
        harnessCode: `
          const { AsyncJobQueue } = exports as { AsyncJobQueue: new (o: any) => any };
          const q = new AsyncJobQueue({
            concurrency: 2,
            rateLimit: { maxRequests: 20, windowMs: 50 },
            retry: { maxAttempts: 2, retryDelayMs: 3 },
          });
          const p1 = q.enqueue({
            id: 'a',
            run: async (att: number) => {
              if (att === 1) throw new Error('retry-me');
              return 'ok';
            },
          });
          const p2 = q.enqueue({
            id: 'b',
            run: async () => {
              throw new Error('always-fails');
            },
          });
          p1.catch(() => {});
          p2.catch(() => {});
          await q.onIdle();
          return q.getStats();
        `,
        expected: {
          completed: 1,
          failed: 1,
          retriedAttempts: 2,
          maxObservedConcurrency: 2,
        },
      },
    ],
  },
  exam: {
    id: 's5-exam',
    title: 'Section 5 Cumulative Exam: Architecture, Events & Concurrency',
    subtitle: '5 integrated tasks spanning priority scheduling I/O, generic LRU classes, scoped event hubs, worker pools, and async type inference',
    coveredSections: [1, 2, 3, 4, 5],
    passingScore: 1,
    description:
      'Prove end-to-end mastery of Sections 1–5 without hints: simulate a priority run-queue, implement a generic LRU cache class, engineer a disposable scoped event hub, orchestrate a bounded async worker pool, and author Promise type utilities.',
    tasks: [
      {
        id: 's5-exam-t1',
        title: 'Priority Run-Queue Dispatcher',
        style: 'beecrowd',
        difficulty: 'medium',
        entryFunction: 'solve',
        description: `Simulate a non-preemptive single-CPU run queue processing \`N\` commands:

- \`ADD <jobId> <priority> <durationMs>\`: enqueues \`<jobId>\` with integer \`<priority>\` (higher runs first; break ties by **earliest \`ADD\` order**).
- \`STEP\`: dispatches the highest-priority queued job (if any), advances \`clock += durationMs\`, and outputs \`RUN <jobId> finish=<clock>\`; if queue is empty, outputs \`IDLE\`.
- \`STATUS\`: outputs \`clock=<clock> queued=<queuedCount>\`.

First line is \`N\`. Clock starts at \`0\`. Return output lines joined by \`\\n\`.`,
        tags: ['Exam', 'Simulation', 'Priority Queue', 'Beecrowd'],
        hints: [],
        playgroundInput: `6
ADD build 5 120
ADD lint 8 30
STEP
STATUS
STEP
STEP`,
        starterCode: `export function solve(input: string): string {
  void input;
  return '';
}
`,
        referenceSolution: `interface JobItem {
  readonly id: string;
  readonly priority: number;
  readonly duration: number;
  readonly seq: number;
}

export function solve(input: string): string {
  const lines = input.replace(/\\r/g, '').trim().split('\\n');
  if (lines.length === 0 || lines[0].trim() === '') return '';

  const n = Number(lines[0].trim());
  const queue: JobItem[] = [];
  let clock = 0;
  let seq = 0;
  const out: string[] = [];

  for (let i = 1; i <= n && i < lines.length; i++) {
    const parts = lines[i].trim().split(/\\s+/);
    const cmd = parts[0];
    if (cmd === 'ADD') {
      queue.push({
        id: parts[1],
        priority: Number(parts[2]),
        duration: Number(parts[3]),
        seq: seq++,
      });
    } else if (cmd === 'STEP') {
      if (queue.length === 0) {
        out.push('IDLE');
      } else {
        let best = 0;
        for (let j = 1; j < queue.length; j++) {
          if (
            queue[j].priority > queue[best].priority ||
            (queue[j].priority === queue[best].priority && queue[j].seq < queue[best].seq)
          ) {
            best = j;
          }
        }
        const [job] = queue.splice(best, 1);
        clock += job.duration;
        out.push(\`RUN \${job.id} finish=\${clock}\`);
      }
    } else if (cmd === 'STATUS') {
      out.push(\`clock=\${clock} queued=\${queue.length}\`);
    }
  }

  return out.join('\\n');
}
`,
        testCases: [
          {
            id: 's5-exam-t1-c1',
            name: 'Dispatches higher priority first and tracks clock',
            args: [`6\nADD build 5 120\nADD lint 8 30\nSTEP\nSTATUS\nSTEP\nSTEP`],
            expected: `RUN lint finish=30\nclock=30 queued=1\nRUN build finish=150\nIDLE`,
          },
          {
            id: 's5-exam-t1-c2',
            name: 'Breaks equal-priority ties by FIFO arrival order',
            args: [`5\nADD a 10 5\nADD b 10 7\nADD c 10 3\nSTEP\nSTEP`],
            expected: `RUN a finish=5\nRUN b finish=12`,
          },
          {
            id: 's5-exam-t1-c3',
            name: 'Initial STATUS and IDLE on empty queue',
            args: [`2\nSTATUS\nSTEP`],
            expected: `clock=0 queued=0\nIDLE`,
          },
          {
            id: 's5-exam-t1-c4',
            name: 'Hidden: Interleaved arrivals and negative/zero priorities',
            hidden: true,
            args: [`6\nADD low -1 10\nADD zero 0 4\nSTEP\nADD urgent 99 6\nSTEP\nSTEP`],
            expected: `RUN zero finish=4\nRUN urgent finish=10\nRUN low finish=20`,
          },
          {
            id: 's5-exam-t1-c5',
            name: 'Hidden: Zero-duration task advances order without changing clock',
            hidden: true,
            args: [`4\nADD noop 1 0\nSTEP\nSTATUS\nSTEP`],
            expected: `RUN noop finish=0\nclock=0 queued=0\nIDLE`,
          },
        ],
      },
      {
        id: 's5-exam-t2',
        title: 'Generic LRU Cache Class (LruCache<K, V>)',
        style: 'leetcode',
        difficulty: 'medium',
        description: `Implement a generic Least-Recently-Used cache \`LruCache<K, V>\`:

- \`constructor(capacity: number)\`: throws \`Error\` if \`!Number.isInteger(capacity) || capacity < 1\`.
- \`get(key: K): V | undefined\`: returns value and marks \`key\` as **most recently used**; \`undefined\` if absent.
- \`set(key: K, value: V): void\`: inserts or updates \`key\` as **most recently used**. If inserting a new key exceeds \`capacity\`, evict the **least recently used** key.
- \`has(key: K): boolean\`: checks presence **without** altering recency order.
- \`keys(): K[]\`: returns keys ordered from **most recently used** to **least recently used**.
- \`size(): number\`.`,
        tags: ['Exam', 'Classes', 'Generics', 'LRU Cache'],
        hints: [],
        starterCode: `export class LruCache<K, V> {
  constructor(_capacity: number) {}

  get(_key: K): V | undefined {
    return undefined;
  }

  set(_key: K, _value: V): void {}

  has(_key: K): boolean {
    return false;
  }

  keys(): K[] {
    return [];
  }

  size(): number {
    return 0;
  }
}
`,
        referenceSolution: `export class LruCache<K, V> {
  private readonly capacity: number;
  private readonly map = new Map<K, V>();

  constructor(capacity: number) {
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new Error('capacity must be a positive integer');
    }
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.map.has(key)) {
      return undefined;
    }
    const val = this.map.get(key) as V;
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value as K;
      this.map.delete(oldestKey);
    }
    this.map.set(key, value);
  }

  has(key: K): boolean {
    return this.map.has(key);
  }

  keys(): K[] {
    return Array.from(this.map.keys()).reverse();
  }

  size(): number {
    return this.map.size;
  }
}
`,
        astRules: { requireClass: true, requireGenerics: true },
        testCases: [
          {
            id: 's5-exam-t2-c1',
            name: 'Evicts least-recently-used entry and refreshes recency on get()',
            harnessCode: `
              const { LruCache } = exports as { LruCache: new <K, V>(c: number) => any };
              const c = new LruCache<string, number>(2);
              c.set('a', 1);
              c.set('b', 2);
              const va = c.get('a');
              c.set('c', 3);
              return { va, b: c.get('b'), keys: c.keys() };
            `,
            expected: { va: 1, b: undefined, keys: ['c', 'a'] },
          },
          {
            id: 's5-exam-t2-c2',
            name: 'has() does not alter eviction order',
            harnessCode: `
              const { LruCache } = exports as { LruCache: new <K, V>(c: number) => any };
              const c = new LruCache<string, string>(2);
              c.set('x', '1');
              c.set('y', '2');
              const exists = c.has('x');
              c.set('z', '3');
              return { exists, hasX: c.has('x'), keys: c.keys() };
            `,
            expected: { exists: true, hasX: false, keys: ['z', 'y'] },
          },
          {
            id: 's5-exam-t2-c3',
            name: 'Updating existing key promotes it without evicting neighbors',
            harnessCode: `
              const { LruCache } = exports as { LruCache: new <K, V>(c: number) => any };
              const c = new LruCache<number, string>(2);
              c.set(1, 'one');
              c.set(2, 'two');
              c.set(1, 'ONE');
              c.set(3, 'three');
              return { v1: c.get(1), v2: c.get(2), size: c.size() };
            `,
            expected: { v1: 'ONE', v2: undefined, size: 2 },
          },
          {
            id: 's5-exam-t2-c4',
            name: 'Hidden: Supports undefined values stored explicitly',
            hidden: true,
            harnessCode: `
              const { LruCache } = exports as { LruCache: new <K, V>(c: number) => any };
              const c = new LruCache<string, number | undefined>(2);
              c.set('u', undefined);
              c.set('v', 10);
              void c.get('u');
              c.set('w', 20);
              return { hasU: c.has('u'), hasV: c.has('v'), keys: c.keys() };
            `,
            expected: { hasU: true, hasV: false, keys: ['w', 'u'] },
          },
          {
            id: 's5-exam-t2-c5',
            name: 'Hidden: Rejects non-positive capacity',
            hidden: true,
            harnessCode: `
              const { LruCache } = exports as { LruCache: new <K, V>(c: number) => any };
              try { new LruCache(0); return false; } catch { return true; }
            `,
            expected: true,
          },
        ],
      },
      {
        id: 's5-exam-t3',
        title: 'Scoped Typed Event Hub (ScopedEventHub<EventMap>)',
        style: 'leetcode',
        difficulty: 'hard',
        description: `Implement \`ScopedEventHub<EventMap extends object>\`:

- \`on<K extends keyof EventMap>(event: K, fn: (payload: EventMap[K]) => void): () => void\`
- \`emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): number\`
- \`createScope(): EventScope<EventMap>\` returning an object with:
  - \`on<K extends keyof EventMap>(event: K, fn: (payload: EventMap[K]) => void): () => void\` (throws \`Error\` if called after \`dispose()\`)
  - \`dispose(): void\` (idempotently unsubscribes every listener registered through this scope without affecting other scopes or root listeners).`,
        tags: ['Exam', 'EventHub', 'Generics', 'Disposable Scopes'],
        hints: [],
        starterCode: `export interface EventScope<EventMap extends object> {
  on<K extends keyof EventMap>(event: K, fn: (payload: EventMap[K]) => void): () => void;
  dispose(): void;
}

export class ScopedEventHub<EventMap extends object> {
  on<K extends keyof EventMap>(
    _event: K,
    _fn: (payload: EventMap[K]) => void
  ): () => void {
    return () => {};
  }

  emit<K extends keyof EventMap>(_event: K, _payload: EventMap[K]): number {
    return 0;
  }

  createScope(): EventScope<EventMap> {
    return {
      on: () => () => {},
      dispose: () => {},
    };
  }
}
`,
        referenceSolution: `export interface EventScope<EventMap extends object> {
  on<K extends keyof EventMap>(event: K, fn: (payload: EventMap[K]) => void): () => void;
  dispose(): void;
}

type AnyFn = (payload: never) => void;

export class ScopedEventHub<EventMap extends object> {
  private readonly listeners = new Map<keyof EventMap, Set<AnyFn>>();

  on<K extends keyof EventMap>(
    event: K,
    fn: (payload: EventMap[K]) => void
  ): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set<AnyFn>();
      this.listeners.set(event, set);
    }
    set.add(fn as AnyFn);
    return () => {
      const current = this.listeners.get(event);
      if (!current) return;
      current.delete(fn as AnyFn);
      if (current.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): number {
    const set = this.listeners.get(event);
    if (!set || set.size === 0) return 0;
    const snap = Array.from(set);
    for (const cb of snap) {
      (cb as (p: EventMap[K]) => void)(payload);
    }
    return snap.length;
  }

  createScope(): EventScope<EventMap> {
    let disposed = false;
    const cleanups: Array<() => void> = [];

    return {
      on: <K extends keyof EventMap>(event: K, fn: (payload: EventMap[K]) => void) => {
        if (disposed) {
          throw new Error('EventScope already disposed');
        }
        const unsub = this.on(event, fn);
        cleanups.push(unsub);
        return unsub;
      },
      dispose: () => {
        if (disposed) return;
        disposed = true;
        while (cleanups.length > 0) {
          const fn = cleanups.pop();
          if (fn) fn();
        }
      },
    };
  }
}
`,
        astRules: { requireClass: true, requireGenerics: true },
        typeAssertionPrelude: `import { ScopedEventHub } from './solution';

interface Events {
  resize: { width: number; height: number };
}
const hub = new ScopedEventHub<Events>();
const scope = hub.createScope();`,
        typeAssertions: [
          {
            id: 's5-exam-t3-a1',
            name: 'createScope().on preserves EventMap payload types',
            assertion: `Expect<Equal<Parameters<typeof scope.on<'resize'>>[1], (payload: { width: number; height: number }) => void>>`,
          },
        ],
        testCases: [
          {
            id: 's5-exam-t3-c1',
            name: 'Disposing a scope detaches its listeners while preserving root and sibling scopes',
            harnessCode: `
              const { ScopedEventHub } = exports as { ScopedEventHub: new () => any };
              const hub = new ScopedEventHub();
              const log: string[] = [];
              hub.on('msg', (s: string) => log.push('root:' + s));
              const s1 = hub.createScope();
              const s2 = hub.createScope();
              s1.on('msg', (s: string) => log.push('s1:' + s));
              s2.on('msg', (s: string) => log.push('s2:' + s));
              hub.emit('msg', 'a');
              s1.dispose();
              const countAfter = hub.emit('msg', 'b');
              return { log, countAfter };
            `,
            expected: { log: ['root:a', 's1:a', 's2:a', 'root:b', 's2:b'], countAfter: 2 },
          },
          {
            id: 's5-exam-t3-c2',
            name: 'Throws when registering on an already disposed scope',
            harnessCode: `
              const { ScopedEventHub } = exports as { ScopedEventHub: new () => any };
              const hub = new ScopedEventHub();
              const sc = hub.createScope();
              sc.dispose();
              sc.dispose();
              try {
                sc.on('x', () => {});
                return false;
              } catch {
                return true;
              }
            `,
            expected: true,
          },
          {
            id: 's5-exam-t3-c3',
            name: 'Individual unsub inside active scope works cleanly before dispose',
            harnessCode: `
              const { ScopedEventHub } = exports as { ScopedEventHub: new () => any };
              const hub = new ScopedEventHub();
              const sc = hub.createScope();
              let hits = 0;
              const off = sc.on('ping', () => { hits++; });
              hub.emit('ping', 1);
              off();
              hub.emit('ping', 2);
              sc.dispose();
              return hits;
            `,
            expected: 1,
          },
          {
            id: 's5-exam-t3-c4',
            name: 'Hidden: Handles multiple event keys within a single scope',
            hidden: true,
            harnessCode: `
              const { ScopedEventHub } = exports as { ScopedEventHub: new () => any };
              const hub = new ScopedEventHub();
              const sc = hub.createScope();
              let sum = 0;
              sc.on('inc', (n: number) => { sum += n; });
              sc.on('dec', (n: number) => { sum -= n; });
              hub.emit('inc', 10);
              hub.emit('dec', 3);
              sc.dispose();
              hub.emit('inc', 100);
              return sum;
            `,
            expected: 7,
          },
        ],
      },
      {
        id: 's5-exam-t4',
        title: 'Bounded Worker Pool with Per-Task Timeout (runWorkerPool)',
        style: 'leetcode',
        difficulty: 'hard',
        description: `Implement \`runWorkerPool<T>(tasks, options)\` executing \`tasks: readonly (() => Promise<T>)[]\` with:
- At most \`options.concurrency\` active tasks at once (\`>= 1\`).
- Per-task deadline \`options.taskTimeoutMs\`: if an individual task takes longer than \`taskTimeoutMs\`, record \`{ status: 'error', message: 'TIMED_OUT' }\` for that slot and allow that worker to proceed to the next task!
- Normal rejections record \`{ status: 'error', message: err instanceof Error ? err.message : String(err) }\`.
- Resolutions record \`{ status: 'ok', value }\`.
- Return results in exact input index order.`,
        tags: ['Exam', 'Worker Pool', 'Timeouts', 'Concurrency'],
        hints: [],
        starterCode: `export type PoolResult<T> =
  | { readonly status: 'ok'; readonly value: T }
  | { readonly status: 'error'; readonly message: string };

export interface PoolOptions {
  readonly concurrency: number;
  readonly taskTimeoutMs: number;
}

export async function runWorkerPool<T>(
  _tasks: readonly (() => Promise<T>)[],
  _options: PoolOptions
): Promise<PoolResult<T>[]> {
  return [];
}
`,
        referenceSolution: `export type PoolResult<T> =
  | { readonly status: 'ok'; readonly value: T }
  | { readonly status: 'error'; readonly message: string };

export interface PoolOptions {
  readonly concurrency: number;
  readonly taskTimeoutMs: number;
}

async function runSingleWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number
): Promise<PoolResult<T>> {
  let timerId: ReturnType<typeof setTimeout> | undefined;
  try {
    const value = await Promise.race([
      Promise.resolve().then(() => fn()),
      new Promise<never>((_, reject) => {
        timerId = setTimeout(() => {
          reject(new Error('TIMED_OUT'));
        }, timeoutMs);
      }),
    ]);
    return { status: 'ok', value };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: 'error', message };
  } finally {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
  }
}

export async function runWorkerPool<T>(
  tasks: readonly (() => Promise<T>)[],
  options: PoolOptions
): Promise<PoolResult<T>[]> {
  if (!Number.isInteger(options.concurrency) || options.concurrency < 1) {
    throw new Error('concurrency must be >= 1');
  }
  if (tasks.length === 0) return [];

  const results = new Array<PoolResult<T>>(tasks.length);
  let cursor = 0;

  const worker = async (): Promise<void> => {
    while (cursor < tasks.length) {
      const idx = cursor++;
      results[idx] = await runSingleWithTimeout(tasks[idx], options.taskTimeoutMs);
    }
  };

  const count = Math.min(options.concurrency, tasks.length);
  const runners: Promise<void>[] = [];
  for (let i = 0; i < count; i++) {
    runners.push(worker());
  }
  await Promise.all(runners);
  return results;
}
`,
        astRules: { requireAsync: true, requireGenerics: true },
        testCases: [
          {
            id: 's5-exam-t4-c1',
            name: 'Handles fast tasks, errors, and hung tasks while preserving order',
            harnessCode: `
              const { runWorkerPool } = exports as { runWorkerPool: any };
              return await runWorkerPool(
                [
                  () => new Promise<number>((r) => setTimeout(() => r(10), 3)),
                  () => new Promise<number>((r) => setTimeout(() => r(20), 40)),
                  async () => { throw new Error('bad-input'); },
                  () => new Promise<number>((r) => setTimeout(() => r(40), 3)),
                ],
                { concurrency: 2, taskTimeoutMs: 10 }
              );
            `,
            expected: [
              { status: 'ok', value: 10 },
              { status: 'error', message: 'TIMED_OUT' },
              { status: 'error', message: 'bad-input' },
              { status: 'ok', value: 40 },
            ],
          },
          {
            id: 's5-exam-t4-c2',
            name: 'Caps active concurrency strictly at options.concurrency',
            harnessCode: `
              const { runWorkerPool } = exports as { runWorkerPool: any };
              let active = 0, max = 0;
              const res = await runWorkerPool(
                [1, 2, 3, 4, 5].map((n) => async () => {
                  active++;
                  if (active > max) max = active;
                  await new Promise((r) => setTimeout(r, 5));
                  active--;
                  return n;
                }),
                { concurrency: 2, taskTimeoutMs: 50 }
              );
              return { max, values: res.map((r: any) => r.value) };
            `,
            expected: { max: 2, values: [1, 2, 3, 4, 5] },
          },
          {
            id: 's5-exam-t4-c3',
            name: 'Empty task list resolves immediately to []',
            harnessCode: `
              const { runWorkerPool } = exports as { runWorkerPool: any };
              return await runWorkerPool([], { concurrency: 3, taskTimeoutMs: 10 });
            `,
            expected: [],
          },
          {
            id: 's5-exam-t4-c4',
            name: 'Hidden: Catches synchronous throws inside task thunks',
            hidden: true,
            harnessCode: `
              const { runWorkerPool } = exports as { runWorkerPool: any };
              return await runWorkerPool(
                [() => { throw new Error('sync-err'); }, async () => 'ok'],
                { concurrency: 1, taskTimeoutMs: 20 }
              );
            `,
            expected: [
              { status: 'error', message: 'sync-err' },
              { status: 'ok', value: 'ok' },
            ],
          },
          {
            id: 's5-exam-t4-c5',
            name: 'Hidden: Rejects invalid concurrency <= 0',
            hidden: true,
            harnessCode: `
              const { runWorkerPool } = exports as { runWorkerPool: any };
              try {
                await runWorkerPool([async () => 1], { concurrency: 0, taskTimeoutMs: 10 });
                return false;
              } catch {
                return true;
              }
            `,
            expected: true,
          },
        ],
      },
      {
        id: 's5-exam-t5',
        title: 'Async Signature & Tuple Unwrapping Type Utilities',
        style: 'type-challenge',
        difficulty: 'hard',
        description: `Implement three async type utilities **without** \`any\`:

1. \`AsyncReturnType<F>\`: given \`F extends (...args: never) => unknown\`, extracts \`Awaited<ReturnType<F>>\`.
2. \`PromisifyFn<F>\`: given \`F extends (...args: never) => unknown\`, returns \`(...args: Parameters<F>) => Promise<Awaited<ReturnType<F>>>\` (so already-async functions do not double-wrap \`Promise<Promise<T>>\`!).
3. \`UnwrapPromiseTuple<T>\`: maps a tuple \`T extends readonly unknown[]\` to a mutable tuple where every element \`E\` is replaced with \`Awaited<E>\`.`,
        tags: ['Exam', 'Type Challenge', 'Promises', 'Variadic Tuples'],
        hints: [],
        starterCode: `export type AsyncReturnType<F> = unknown;

export type PromisifyFn<F> = unknown;

export type UnwrapPromiseTuple<T> = unknown;
`,
        referenceSolution: `export type AsyncReturnType<F extends (...args: never) => unknown> =
  F extends (...args: never) => infer R ? Awaited<R> : never;

export type PromisifyFn<F extends (...args: never) => unknown> =
  F extends (...args: infer P) => infer R ? (...args: P) => Promise<Awaited<R>> : never;

export type UnwrapPromiseTuple<T extends readonly unknown[]> = {
  -readonly [K in keyof T]: Awaited<T[K]>;
};
`,
        astRules: { requireGenerics: true },
        typeAssertionPrelude: `import type { AsyncReturnType, PromisifyFn, UnwrapPromiseTuple } from './solution';

type SyncParse = (raw: string, radix?: number) => number;
type AsyncFetch = (url: string) => Promise<{ status: number }>;`,
        typeAssertions: [
          {
            id: 's5-exam-t5-a1',
            name: 'AsyncReturnType extracts unwrapped value from both sync and async functions',
            assertion: `Expect<Equal<[AsyncReturnType<SyncParse>, AsyncReturnType<AsyncFetch>], [number, { status: number }]>>`,
          },
          {
            id: 's5-exam-t5-a2',
            name: 'PromisifyFn wraps sync return type in Promise<R>',
            assertion: `Expect<Equal<PromisifyFn<SyncParse>, (raw: string, radix?: number) => Promise<number>>>`,
          },
          {
            id: 's5-exam-t5-a3',
            name: 'PromisifyFn avoids double-wrapping an already async function',
            assertion: `Expect<Equal<PromisifyFn<AsyncFetch>, (url: string) => Promise<{ status: number }>>>`,
          },
          {
            id: 's5-exam-t5-a4',
            name: 'Hidden: UnwrapPromiseTuple unwraps mixed tuple elements and strips readonly',
            hidden: true,
            assertion: `Expect<Equal<UnwrapPromiseTuple<readonly [Promise<string>, number, Promise<Promise<boolean>>]>, [string, number, boolean]>>`,
          },
          {
            id: 's5-exam-t5-a5',
            name: 'Hidden: UnwrapPromiseTuple preserves empty tuple []',
            hidden: true,
            assertion: `Expect<Equal<UnwrapPromiseTuple<[]>, []>>`,
          },
        ],
        testCases: [],
      },
    ],
  },
};
