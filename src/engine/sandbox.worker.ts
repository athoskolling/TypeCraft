import { evaluatePlayground, evaluateSubmission } from './evaluator';
import type { EvaluationRequest, PlaygroundRequest } from '../types/engine';

export type WorkerIncomingMessage =
  | { kind: 'evaluate'; payload: EvaluationRequest }
  | { kind: 'playground'; payload: PlaygroundRequest };

self.onmessage = async (event: MessageEvent<WorkerIncomingMessage>) => {
  const msg = event.data;
  if (!msg) return;

  if (msg.kind === 'evaluate') {
    const response = await evaluateSubmission(msg.payload);
    self.postMessage({ kind: 'evaluate-result', payload: response });
  } else if (msg.kind === 'playground') {
    const response = await evaluatePlayground(msg.payload);
    self.postMessage({ kind: 'playground-result', payload: response });
  }
};
