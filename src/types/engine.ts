import type { AstRuleConfig, ChallengeTestCase, TypeAssertionCase } from './curriculum';

export type DiagnosticSeverity = 'error' | 'warning' | 'info';

export interface CompilerDiagnosticItem {
  code: number;
  file: string;
  line: number;
  column: number;
  message: string;
  /** Friendly educational explanation for common TS errors (TS2322, TS2339, TS2345, TS7006, TS2532, etc.) */
  friendlyExplanation?: string;
  severity: DiagnosticSeverity;
}

export interface AstViolationItem {
  rule: string;
  file: string;
  line: number;
  column: number;
  message: string;
  hint: string;
}

export interface TypeAssertionResult {
  id: string;
  name: string;
  hidden: boolean;
  passed: boolean;
  assertion: string;
  errorMessage?: string;
}

export type LogicDiagnosisKind =
  | 'forgotten-return'
  | 'input-mutation'
  | 'off-by-one'
  | 'float-precision'
  | 'whitespace-newline'
  | 'wrong-order'
  | 'type-mismatch'
  | 'general-mismatch'
  | 'runtime-exception'
  | 'infinite-loop-timeout';

export interface LogicDiagnosis {
  kind: LogicDiagnosisKind;
  title: string;
  explanation: string;
  suggestion: string;
}

export interface ConsoleEntry {
  level: 'log' | 'warn' | 'error' | 'info';
  text: string;
  timestampMs: number;
  testId?: string;
}

export interface TestCaseResult {
  id: string;
  name: string;
  hidden: boolean;
  passed: boolean;
  durationMs: number;
  actual?: unknown;
  expected?: unknown;
  mutatedInput?: boolean;
  runtimeError?: string;
  diagnosis?: LogicDiagnosis;
}

export interface EvaluationRequest {
  requestId: string;
  /** Virtual file map, e.g. { 'solution.ts': '...' } or { 'types.ts': '...', 'engine.ts': '...' } */
  files: Record<string, string>;
  entryFile: string;
  entryFunction?: string;
  astRules?: AstRuleConfig;
  typeAssertionPrelude?: string;
  typeAssertions?: TypeAssertionCase[];
  testCases: ChallengeTestCase[];
  /** Timeout in ms for runtime execution (default: 2500ms) */
  timeoutMs?: number;
}

export interface PlaygroundRequest {
  requestId: string;
  files: Record<string, string>;
  entryFile: string;
  entryFunction?: string;
  customInput: string;
  timeoutMs?: number;
}

export interface PlaygroundResponse {
  requestId: string;
  ok: boolean;
  output?: string;
  returnValue?: unknown;
  compilerErrors: CompilerDiagnosticItem[];
  runtimeError?: string;
  consoleEntries: ConsoleEntry[];
  durationMs: number;
  timedOut?: boolean;
}

export interface EvaluationResponse {
  requestId: string;
  passed: boolean;
  /** Layer 1 results */
  layer1: {
    passed: boolean;
    compilerDiagnostics: CompilerDiagnosticItem[];
    astViolations: AstViolationItem[];
    typeAssertionResults: TypeAssertionResult[];
  };
  /** Layer 2 & Layer 3 results */
  layer2: {
    passed: boolean;
    skippedDueToCompileError: boolean;
    timedOut: boolean;
    testResults: TestCaseResult[];
    consoleEntries: ConsoleEntry[];
    totalDurationMs: number;
  };
}
