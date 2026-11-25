import { runLayer1Compiler } from './layer1Compiler';
import { runLayer2Tests, runPlaygroundExecution } from './layer2Runner';
import type {
  EvaluationRequest,
  EvaluationResponse,
  PlaygroundRequest,
  PlaygroundResponse,
} from '../types/engine';

export async function evaluateSubmission(req: EvaluationRequest): Promise<EvaluationResponse> {
  const layer1 = runLayer1Compiler({
    files: req.files,
    astRules: req.astRules,
    typeAssertionPrelude: req.typeAssertionPrelude,
    typeAssertions: req.typeAssertions,
  });

  const hasFatalSyntaxOrTypeError = layer1.compilerDiagnostics.some(
    (d) => d.severity === 'error' && d.file !== 'type-assertions'
  );

  if (hasFatalSyntaxOrTypeError) {
    return {
      requestId: req.requestId,
      passed: false,
      layer1,
      layer2: {
        passed: false,
        skippedDueToCompileError: true,
        timedOut: false,
        testResults: [],
        consoleEntries: [],
        totalDurationMs: 0,
      },
    };
  }

  if (req.testCases.length === 0) {
    return {
      requestId: req.requestId,
      passed: layer1.passed,
      layer1,
      layer2: {
        passed: true,
        skippedDueToCompileError: false,
        timedOut: false,
        testResults: [],
        consoleEntries: [],
        totalDurationMs: 0,
      },
    };
  }

  const layer2Out = await runLayer2Tests({
    files: req.files,
    entryFile: req.entryFile,
    entryFunction: req.entryFunction,
    testCases: req.testCases,
    perTestTimeoutMs: req.timeoutMs ?? 3500,
  });

  return {
    requestId: req.requestId,
    passed: layer1.passed && layer2Out.passed,
    layer1,
    layer2: {
      passed: layer2Out.passed,
      skippedDueToCompileError: false,
      timedOut: layer2Out.timedOut,
      testResults: layer2Out.testResults,
      consoleEntries: layer2Out.consoleEntries,
      totalDurationMs: layer2Out.totalDurationMs,
    },
  };
}

export async function evaluatePlayground(req: PlaygroundRequest): Promise<PlaygroundResponse> {
  const layer1 = runLayer1Compiler({
    files: req.files,
    astRules: { forbidExplicitAny: false, forbidTsIgnore: false },
  });

  const errors = layer1.compilerDiagnostics.filter((d) => d.severity === 'error');
  if (errors.length > 0) {
    return {
      requestId: req.requestId,
      ok: false,
      compilerErrors: errors,
      consoleEntries: [],
      durationMs: 0,
    };
  }

  const runRes = await runPlaygroundExecution({
    files: req.files,
    entryFile: req.entryFile,
    entryFunction: req.entryFunction,
    customInput: req.customInput,
    timeoutMs: req.timeoutMs ?? 3500,
  });

  return {
    requestId: req.requestId,
    ok: runRes.ok,
    output: runRes.output,
    returnValue: runRes.returnValue,
    compilerErrors: [],
    runtimeError: runRes.runtimeError,
    consoleEntries: runRes.consoleEntries,
    durationMs: runRes.durationMs,
    timedOut: runRes.timedOut,
  };
}
