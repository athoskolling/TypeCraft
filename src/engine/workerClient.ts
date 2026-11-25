import SandboxWorker from './sandbox.worker?worker';
import { analyzeLogicError } from './layer3LogicAnalyzer';
import type {
  EvaluationRequest,
  EvaluationResponse,
  PlaygroundRequest,
  PlaygroundResponse,
} from '../types/engine';

const DEFAULT_WORKER_TIMEOUT_MS = 4500;

class SandboxWorkerPool {
  private worker: Worker | null = null;

  private ensureWorker(): Worker {
    if (!this.worker) {
      this.worker = new SandboxWorker();
    }
    return this.worker;
  }

  private respawnWorker(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.worker = new SandboxWorker();
  }

  public evaluate(req: EvaluationRequest): Promise<EvaluationResponse> {
    const timeoutMs = req.timeoutMs ?? DEFAULT_WORKER_TIMEOUT_MS;
    const worker = this.ensureWorker();

    return new Promise<EvaluationResponse>((resolve) => {
      let settled = false;

      const cleanup = (handler: (ev: MessageEvent) => void, timer: number) => {
        worker.removeEventListener('message', handler);
        window.clearTimeout(timer);
      };

      const onMessage = (ev: MessageEvent) => {
        const data = ev.data as { kind?: string; payload?: EvaluationResponse };
        if (data?.kind === 'evaluate-result' && data.payload?.requestId === req.requestId) {
          if (settled) return;
          settled = true;
          cleanup(onMessage, timer);
          resolve(data.payload);
        }
      };

      const timer = window.setTimeout(() => {
        if (settled) return;
        settled = true;
        worker.removeEventListener('message', onMessage);
        this.respawnWorker();

        const timeoutDiag = analyzeLogicError({
          actual: undefined,
          expected: undefined,
          timedOut: true,
        });

        resolve({
          requestId: req.requestId,
          passed: false,
          layer1: {
            passed: true,
            compilerDiagnostics: [],
            astViolations: [],
            typeAssertionResults: [],
          },
          layer2: {
            passed: false,
            skippedDueToCompileError: false,
            timedOut: true,
            testResults: req.testCases.map((tc) => ({
              id: tc.id,
              name: tc.name,
              hidden: Boolean(tc.hidden),
              passed: false,
              durationMs: timeoutMs,
              diagnosis: timeoutDiag,
            })),
            consoleEntries: [
              {
                level: 'error',
                text: `Execution terminated after ${timeoutMs}ms (infinite loop protection). Worker respawned cleanly.`,
                timestampMs: Date.now(),
              },
            ],
            totalDurationMs: timeoutMs,
          },
        });
      }, timeoutMs);

      worker.addEventListener('message', onMessage);
      worker.postMessage({ kind: 'evaluate', payload: req });
    });
  }

  public runPlayground(req: PlaygroundRequest): Promise<PlaygroundResponse> {
    const timeoutMs = req.timeoutMs ?? DEFAULT_WORKER_TIMEOUT_MS;
    const worker = this.ensureWorker();

    return new Promise<PlaygroundResponse>((resolve) => {
      let settled = false;

      const onMessage = (ev: MessageEvent) => {
        const data = ev.data as { kind?: string; payload?: PlaygroundResponse };
        if (data?.kind === 'playground-result' && data.payload?.requestId === req.requestId) {
          if (settled) return;
          settled = true;
          worker.removeEventListener('message', onMessage);
          window.clearTimeout(timer);
          resolve(data.payload);
        }
      };

      const timer = window.setTimeout(() => {
        if (settled) return;
        settled = true;
        worker.removeEventListener('message', onMessage);
        this.respawnWorker();

        resolve({
          requestId: req.requestId,
          ok: false,
          compilerErrors: [],
          runtimeError: `Execution timed out after ${timeoutMs}ms (possible infinite loop). Worker respawned.`,
          consoleEntries: [],
          durationMs: timeoutMs,
          timedOut: true,
        });
      }, timeoutMs);

      worker.addEventListener('message', onMessage);
      worker.postMessage({ kind: 'playground', payload: req });
    });
  }
}

export const sandboxClient = new SandboxWorkerPool();
