import ts from 'typescript';
import { analyzeLogicError, deepEqual } from './layer3LogicAnalyzer';
import type { ChallengeTestCase } from '../types/curriculum';
import type { ConsoleEntry, TestCaseResult } from '../types/engine';

function normalizeRelPath(raw: string): string {
  const parts = raw.replace(/\\/g, '/').replace(/^\/+/, '').split('/');
  const stack: string[] = [];
  for (const part of parts) {
    if (!part || part === '.') continue;
    if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  const joined = stack.join('/');
  return joined.endsWith('.ts') ? joined : `${joined}.ts`;
}

function dirnameRel(filePath: string): string {
  const idx = filePath.lastIndexOf('/');
  return idx === -1 ? '' : filePath.slice(0, idx);
}

function resolveVirtualModule(
  fromFile: string,
  specifier: string,
  compiledMap: Map<string, string>
): string {
  const baseDir = dirnameRel(fromFile);
  const rawCombined =
    specifier.startsWith('./') || specifier.startsWith('../')
      ? baseDir
        ? `${baseDir}/${specifier}`
        : specifier
      : specifier;

  const normalized = normalizeRelPath(rawCombined);
  if (compiledMap.has(normalized)) return normalized;

  const withoutTs = normalized.replace(/\.ts$/, '');
  const indexCandidate = `${withoutTs}/index.ts`;
  if (compiledMap.has(indexCandidate)) return indexCandidate;

  throw new Error(`Cannot find virtual module '${specifier}' imported from '${fromFile}'`);
}

function formatConsoleArg(arg: unknown): string {
  if (typeof arg === 'string') return arg;
  if (arg === undefined) return 'undefined';
  if (arg === null) return 'null';
  if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
  try {
    return JSON.stringify(arg);
  } catch {
    return String(arg);
  }
}

function cloneDeepSafe<T>(val: T): T {
  if (val === null || typeof val !== 'object') return val;
  try {
    return structuredClone(val);
  } catch {
    return JSON.parse(JSON.stringify(val)) as T;
  }
}

function transpileFilesToCjs(files: Record<string, string>): Map<string, string> {
  const compiled = new Map<string, string>();
  for (const [rawPath, source] of Object.entries(files)) {
    const key = normalizeRelPath(rawPath);
    const out = ts.transpileModule(source, {
      fileName: key,
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
        strict: true,
      },
    });
    compiled.set(key, out.outputText);
  }
  return compiled;
}

function createRuntimeEnvironment(
  compiledMap: Map<string, string>,
  consoleEntries: ConsoleEntry[],
  testId?: string
) {
  const moduleCache = new Map<string, { exports: Record<string, unknown> }>();

  const pushLog = (level: ConsoleEntry['level'], args: unknown[]) => {
    if (consoleEntries.length >= 250) return;
    consoleEntries.push({
      level,
      text: args.map(formatConsoleArg).join(' '),
      timestampMs: Date.now(),
      testId,
    });
  };

  const sandboxConsole = {
    log: (...args: unknown[]) => pushLog('log', args),
    info: (...args: unknown[]) => pushLog('info', args),
    warn: (...args: unknown[]) => pushLog('warn', args),
    error: (...args: unknown[]) => pushLog('error', args),
  };

  function requireFrom(fromFile: string, specifier: string): Record<string, unknown> {
    const resolved = resolveVirtualModule(fromFile, specifier, compiledMap);
    const cached = moduleCache.get(resolved);
    if (cached) return cached.exports;

    const code = compiledMap.get(resolved);
    if (code === undefined) {
      throw new Error(`Module '${resolved}' was not compiled`);
    }

    const mod = { exports: {} as Record<string, unknown> };
    moduleCache.set(resolved, mod);

    const localRequire = (spec: string) => requireFrom(resolved, spec);
    const factory = new Function('exports', 'require', 'module', 'console', code);
    factory(mod.exports, localRequire, mod, sandboxConsole);
    return mod.exports;
  }

  return {
    loadEntry: (entryFile: string) => {
      const normalizedEntry = normalizeRelPath(entryFile);
      if (!compiledMap.has(normalizedEntry)) {
        throw new Error(`Entry file '${entryFile}' not found in workspace`);
      }
      const cached = moduleCache.get(normalizedEntry);
      if (cached) return cached.exports;
      const mod = { exports: {} as Record<string, unknown> };
      moduleCache.set(normalizedEntry, mod);
      const localRequire = (spec: string) => requireFrom(normalizedEntry, spec);
      const factory = new Function(
        'exports',
        'require',
        'module',
        'console',
        compiledMap.get(normalizedEntry)!
      );
      factory(mod.exports, localRequire, mod, sandboxConsole);
      return mod.exports;
    },
    requireModule: (spec: string) => requireFrom('__root__.ts', spec.startsWith('./') ? spec : `./${spec}`),
    sandboxConsole,
  };
}

export interface Layer2RunInput {
  files: Record<string, string>;
  entryFile: string;
  entryFunction?: string;
  testCases: ChallengeTestCase[];
  perTestTimeoutMs?: number;
}

export interface Layer2RunOutput {
  passed: boolean;
  timedOut: boolean;
  testResults: TestCaseResult[];
  consoleEntries: ConsoleEntry[];
  totalDurationMs: number;
}

async function withPromiseTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error('__TYPECRAFT_ASYNC_TIMEOUT__'));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

export async function runLayer2Tests(input: Layer2RunInput): Promise<Layer2RunOutput> {
  const startTotal = performance.now();
  const consoleEntries: ConsoleEntry[] = [];
  const testResults: TestCaseResult[] = [];
  const compiledMap = transpileFilesToCjs(input.files);
  const perTestTimeout = input.perTestTimeoutMs ?? 1500;
  let anyTimedOut = false;

  for (const tc of input.testCases) {
    const t0 = performance.now();
    const env = createRuntimeEnvironment(compiledMap, consoleEntries, tc.id);
    const targetFile = tc.entryFile ?? input.entryFile;
    const targetFnName = tc.fnName ?? input.entryFunction ?? 'solve';

    let actual: unknown = undefined;
    let mutatedInput = false;
    let runtimeError: string | undefined;
    let timedOut = false;

    try {
      const moduleExports = env.loadEntry(targetFile);

      if (tc.harnessCode) {
        const jsHarness = ts.transpileModule(tc.harnessCode, {
          compilerOptions: {
            target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.CommonJS,
          },
        }).outputText;

        const asyncRunner = new Function(
          'exports',
          'require',
          'console',
          `return (async () => {\n${jsHarness}\n})();`
        ) as (
          exp: Record<string, unknown>,
          req: (s: string) => Record<string, unknown>,
          con: typeof env.sandboxConsole
        ) => Promise<unknown>;

        actual = await withPromiseTimeout(
          asyncRunner(moduleExports, env.requireModule, env.sandboxConsole),
          perTestTimeout
        );
      } else {
        const candidateFn =
          moduleExports[targetFnName] ??
          (typeof moduleExports.default === 'function' ? moduleExports.default : undefined);

        if (typeof candidateFn !== 'function') {
          const exportedKeys = Object.keys(moduleExports);
          throw new Error(
            `Expected exported function '${targetFnName}' in '${targetFile}', found: ${
              exportedKeys.length > 0 ? exportedKeys.join(', ') : '(no exports)'
            }`
          );
        }

        const originalSnapshot = cloneDeepSafe(tc.args ?? []);
        const runtimeArgs = cloneDeepSafe(tc.args ?? []);

        const invocationResult = (candidateFn as (...a: unknown[]) => unknown)(...runtimeArgs);
        actual =
          invocationResult instanceof Promise
            ? await withPromiseTimeout(invocationResult, perTestTimeout)
            : invocationResult;

        if (tc.checkImmutability && !deepEqual(runtimeArgs, originalSnapshot)) {
          mutatedInput = true;
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === '__TYPECRAFT_ASYNC_TIMEOUT__') {
        timedOut = true;
        anyTimedOut = true;
      } else {
        runtimeError = msg;
      }
    }

    const durationMs = Math.max(0.1, Math.round((performance.now() - t0) * 10) / 10);
    const valuesEqual =
      !timedOut &&
      !runtimeError &&
      !mutatedInput &&
      deepEqual(actual, tc.expected, tc.floatTolerance ?? 0);

    const diagnosis = valuesEqual
      ? undefined
      : analyzeLogicError({
          actual,
          expected: tc.expected,
          mutatedInput,
          runtimeError,
          timedOut,
        });

    testResults.push({
      id: tc.id,
      name: tc.name,
      hidden: Boolean(tc.hidden),
      passed: valuesEqual,
      durationMs,
      actual: tc.hidden ? undefined : actual,
      expected: tc.hidden ? undefined : tc.expected,
      mutatedInput,
      runtimeError,
      diagnosis,
    });
  }

  const totalDurationMs = Math.round((performance.now() - startTotal) * 10) / 10;
  const passed = testResults.every((r) => r.passed);

  return {
    passed,
    timedOut: anyTimedOut,
    testResults,
    consoleEntries,
    totalDurationMs,
  };
}

export async function runPlaygroundExecution(params: {
  files: Record<string, string>;
  entryFile: string;
  entryFunction?: string;
  customInput: string;
  timeoutMs?: number;
}): Promise<{
  ok: boolean;
  output?: string;
  returnValue?: unknown;
  runtimeError?: string;
  consoleEntries: ConsoleEntry[];
  durationMs: number;
  timedOut?: boolean;
}> {
  const t0 = performance.now();
  const consoleEntries: ConsoleEntry[] = [];
  const compiledMap = transpileFilesToCjs(params.files);
  const env = createRuntimeEnvironment(compiledMap, consoleEntries, 'playground');

  try {
    const exportsObj = env.loadEntry(params.entryFile);
    const fnName = params.entryFunction ?? 'solve';
    const fn =
      exportsObj[fnName] ??
      Object.values(exportsObj).find((v): v is (...a: unknown[]) => unknown => typeof v === 'function');

    if (typeof fn !== 'function') {
      return {
        ok: true,
        output:
          consoleEntries.length > 0
            ? consoleEntries.map((c) => c.text).join('\n')
            : '(Module loaded cleanly — no callable entry function exported)',
        consoleEntries,
        durationMs: Math.round((performance.now() - t0) * 10) / 10,
      };
    }

    let parsedArg: unknown = params.customInput;
    // If non-solve function and input looks like JSON array of arguments or JSON literal, parse smartly
    if (fnName !== 'solve') {
      const trimmed = params.customInput.trim();
      if (trimmed.length > 0) {
        try {
          parsedArg = JSON.parse(trimmed);
        } catch {
          parsedArg = params.customInput;
        }
      }
    }

    const argsToPass =
      fnName !== 'solve' && Array.isArray(parsedArg) && fn.length > 1
        ? (parsedArg as unknown[])
        : [parsedArg];

    const rawRes = fn(...argsToPass);
    const resolved =
      rawRes instanceof Promise
        ? await withPromiseTimeout(rawRes, params.timeoutMs ?? 2000)
        : rawRes;

    const outputStr =
      typeof resolved === 'string'
        ? resolved
        : resolved === undefined
          ? 'undefined'
          : JSON.stringify(resolved, null, 2);

    return {
      ok: true,
      output: outputStr,
      returnValue: resolved,
      consoleEntries,
      durationMs: Math.round((performance.now() - t0) * 10) / 10,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const timedOut = msg === '__TYPECRAFT_ASYNC_TIMEOUT__';
    return {
      ok: false,
      runtimeError: timedOut ? 'Execution timed out' : msg,
      timedOut,
      consoleEntries,
      durationMs: Math.round((performance.now() - t0) * 10) / 10,
    };
  }
}
