import type { Attendant } from "./attendant";

function elapsedMs(statusSince: number, now: number): number {
  return Math.max(0, now - statusSince);
}

export function getLiveIdleMs(attendant: Attendant, now: number): number {
  if (attendant.status !== "AVAILABLE") return attendant.idleMs;
  return attendant.idleMs + elapsedMs(attendant.statusSince, now);
}

export function getLiveCallMs(attendant: Attendant, now: number): number {
  if (attendant.status !== "IN_CALL") return attendant.callMs;
  return attendant.callMs + elapsedMs(attendant.statusSince, now);
}

export function getLivePauseMs(attendant: Attendant, now: number): number {
  if (attendant.status !== "PAUSED") return attendant.pauseMs;
  return attendant.pauseMs + elapsedMs(attendant.statusSince, now);
}
