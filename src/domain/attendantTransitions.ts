import type { Attendant, AttendantStatus } from "./attendant";

function safeElapsedMs(statusSince: number, now: number): number {
  return Math.max(0, now - statusSince);
}

export function applyElapsed(attendant: Attendant, now: number): Attendant {
  const elapsed = safeElapsedMs(attendant.statusSince, now);

  if (elapsed === 0) return attendant;

  if (attendant.status === "AVAILABLE") {
    return { ...attendant, idleMs: attendant.idleMs + elapsed, statusSince: now };
  }

  if (attendant.status === "IN_CALL") {
    return { ...attendant, callMs: attendant.callMs + elapsed, statusSince: now };
  }

  return { ...attendant, pauseMs: attendant.pauseMs + elapsed, statusSince: now };
}

export function setStatus(
  attendant: Attendant,
  nextStatus: AttendantStatus,
  now: number
): Attendant {
  const updated = applyElapsed(attendant, now);
  return { ...updated, status: nextStatus, statusSince: now };
}

export function pauseAttendant(attendant: Attendant, now: number): Attendant {
  if (attendant.status === "IN_CALL") return attendant;
  if (attendant.status === "PAUSED") return attendant;
  return setStatus(attendant, "PAUSED", now);
}

export function resumeAttendant(attendant: Attendant, now: number): Attendant {
  if (attendant.status !== "PAUSED") return attendant;
  return setStatus(attendant, "AVAILABLE", now);
}

export function finishCall(attendant: Attendant, now: number): Attendant {
  if (attendant.status !== "IN_CALL") return attendant;

  const afterElapsed = applyElapsed(attendant, now);
  return {
    ...afterElapsed,
    status: "AVAILABLE",
    statusSince: now,
    handledCalls: afterElapsed.handledCalls + 1,
  };
}
