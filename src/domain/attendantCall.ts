import type { Attendant } from "./attendant";
import { getLiveIdleMs } from "./attendantLive";

export function startCall(attendant: Attendant, now: number): Attendant {
  if (attendant.status !== "AVAILABLE") return attendant;

  const liveIdle = getLiveIdleMs(attendant, now);

  return {
    ...attendant,
    status: "IN_CALL",
    statusSince: now,
    idleMs: liveIdle,
  };
}
