import type { Attendant } from "./attendant";

function elapsedMs(since: number, now: number): number {
  return Math.max(0, now - since);
}

export function getLiveIdleMs(attendant: Attendant, now: number): number {
  if (attendant.status === "IN_CALL") return attendant.idleMs;
  return attendant.idleMs + elapsedMs(attendant.idleSince, now);
}
