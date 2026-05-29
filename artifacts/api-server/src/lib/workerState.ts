/**
 * Shared worker state — a thin module that health.ts and emailQueue.ts both
 * import so they can share worker-started metadata without circular deps.
 */

let emailWorkerStartedAt: Date | null = null;

export function markEmailWorkerStarted() {
  emailWorkerStartedAt = new Date();
}

export function getEmailWorkerStartedAt(): Date | null {
  return emailWorkerStartedAt;
}
