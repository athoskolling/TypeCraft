export const TYPE_UTILS_DTS = `// TypeCraft Academy — Global Type-Challenge Utilities & Sandbox Runtime Globals

type Expect<T extends true> = T;
type ExpectTrue<T extends true> = T;
type ExpectFalse<T extends false> = T;
type IsTrue<T extends true> = T;
type IsFalse<T extends false> = T;

type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true;

type IsAny<T> = 0 extends (1 & T) ? true : false;
type NotAny<T> = true extends IsAny<T> ? false : true;

type MergeInsertions<T> =
  T extends (...args: any[]) => any
    ? T
    : T extends readonly any[]
      ? T
      : T extends object
        ? { [K in keyof T]: MergeInsertions<T[K]> }
        : T;

type Alike<X, Y> = Equal<MergeInsertions<X>, MergeInsertions<Y>>;

interface Console {
  log(...data: unknown[]): void;
  info(...data: unknown[]): void;
  warn(...data: unknown[]): void;
  error(...data: unknown[]): void;
}

declare const console: Console;

declare function setTimeout(callback: () => void, ms?: number): number;
declare function setTimeout<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  ms?: number,
  ...args: TArgs
): number;

declare function clearTimeout(timeoutId: number | undefined): void;

declare function queueMicrotask(callback: () => void): void;

declare function structuredClone<T>(value: T): T;

interface Performance {
  now(): number;
}

declare const performance: Performance;
`;
