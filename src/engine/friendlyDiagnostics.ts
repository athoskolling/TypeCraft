const DIAGNOSTIC_EXPLANATIONS: Record<number, (msg: string) => string> = {
  2322: () =>
    'Type assignment mismatch (TS2322): The value or return expression does not match the declared target type. Check every property type, union branch, or return annotation.',
  2339: () =>
    'Property does not exist on type (TS2339): You accessed a field or method that is not guaranteed on all union branches. Narrow the type first (using `typeof`, `in`, `instanceof`, or a discriminant check) or update your interface.',
  2344: () =>
    'Type constraint not satisfied (TS2344): If inside `Expect<Equal<A, B>>`, your computed type `A` does not strictly match the expected type `B` (or evaluated to `any`/widened primitive). Check `readonly`, optional `?`, or distributive conditional behavior.',
  2345: () =>
    'Invalid function argument type (TS2345): The value passed to a function parameter is incompatible with its expected parameter type. Verify nullability (`undefined` / `null`) and literal vs widened types.',
  2304: () =>
    'Cannot find name (TS2304): An identifier or type name is referenced before being imported or declared. Check spelling and cross-file `import` statements.',
  2305: () =>
    'Module has no exported member (TS2305): Make sure the target symbol is exported (`export function`, `export interface`, `export type`) from the imported file.',
  2355: () =>
    'Missing return value on some code paths (TS2355): Your function declares a non-void return type, so every `if`/`else` or `switch` path must explicitly `return` a matching value.',
  2366: () =>
    'Function lacks ending return statement (TS2366): Not all control-flow paths return a value. Handle fallback branches or add an exhaustive `never` check.',
  2367: () =>
    'Unintentional comparison without overlap (TS2367): Comparing two types that can never be equal (e.g., `"200" === 200`). Convert types explicitly before comparing.',
  2532: () =>
    'Object is possibly `undefined` (TS2532): Strict null checks caught an unsafe property access. Guard with `if (value !== undefined)`, optional chaining `?.`, or nullish coalescing `??`.',
  18047: () =>
    'Value is possibly `null` (TS18047): Narrow out `null` before accessing properties or methods on this value.',
  18048: () =>
    'Value is possibly `undefined` (TS18048): Narrow out `undefined` (for example after `Map.get()` or array lookup) before using it.',
  18046: () =>
    'Value is of type `unknown` (TS18046): You cannot access properties or call methods on `unknown` directly. Narrow it first using `typeof`, `Array.isArray`, or a type guard.',
  2540: () =>
    'Cannot assign to read-only property (TS2540): This property or tuple is marked `readonly`. Return a new object/array instead of mutating in place.',
  2554: () =>
    'Wrong number of arguments (TS2554): Check required vs optional (`?`) parameters in the function signature.',
  2741: () =>
    'Missing required property (TS2741): The object literal is missing at least one required field defined in the target interface/type.',
  7006: () =>
    'Parameter implicitly has an `any` type (TS7006): Under `strict: true`, every function parameter without contextual inference needs an explicit type annotation (e.g., `(item: OrderItem) => ...`).',
  7053: () =>
    'Unsafe dynamic indexing (TS7053): Indexing an object with a plain `string` isn\'t type-safe unless the object has a `Record<string, V>` index signature or the key is typed as `keyof T`.',
};

export function explainCompilerDiagnostic(code: number, rawMessage: string): string | undefined {
  const explainer = DIAGNOSTIC_EXPLANATIONS[code];
  if (explainer) {
    return explainer(rawMessage);
  }
  if (rawMessage.includes('does not satisfy the constraint')) {
    return 'Generic constraint mismatch: Ensure your type parameter or `Expect<Equal<...>>` expression satisfies its required `extends` constraint.';
  }
  return undefined;
}
