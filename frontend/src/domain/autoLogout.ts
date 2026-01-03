import type { Attendant } from "./attendant";
import { getLiveIdleMs } from "./attendantLive";

const ONE_HOUR_MS = 60 * 60 * 1000;

export function getInactiveAttendantCodes(
  attendants: Attendant[],
  now: number,
  thresholdMs: number = ONE_HOUR_MS
): string[] {
  const inactive: string[] = [];

  for (const a of attendants) {
    if (a.status === "IN_CALL") continue;

    const idleMs = getLiveIdleMs(a, now);
    if (idleMs >= thresholdMs) inactive.push(a.code);
  }

  return inactive;
}
