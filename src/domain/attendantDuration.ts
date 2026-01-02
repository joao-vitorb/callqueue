import type { Attendant } from "./attendant";

function elapsedMs(statusSince: number, now: number): number {
  return Math.max(0, now - statusSince);
}

export function getCurrentStatusDurationMs(
  attendant: Attendant,
  now: number
): number {
  if (attendant.status === "AVAILABLE") return 0;
  return elapsedMs(attendant.statusSince, now);
}
