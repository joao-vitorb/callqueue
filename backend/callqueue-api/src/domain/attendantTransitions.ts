import type { AttendantStatus } from "@prisma/client";

type AttendantLike = {
  status: AttendantStatus;
  statusSince: bigint;
  idleSince: bigint;
  idleMs: bigint;
  callMs: bigint;
  pauseMs: bigint;
  handledCalls: number;
};

function elapsedMs(since: bigint, now: bigint): bigint {
  return now > since ? now - since : 0n;
}

export function pauseAttendant(a: AttendantLike, now: bigint) {
  if (a.status !== "AVAILABLE") return a;

  return {
    ...a,
    status: "PAUSED" as const,
    statusSince: now,
  };
}

export function resumeAttendant(a: AttendantLike, now: bigint) {
  if (a.status !== "PAUSED") return a;

  const addPause = elapsedMs(a.statusSince, now);

  return {
    ...a,
    status: "AVAILABLE" as const,
    statusSince: now,
    pauseMs: a.pauseMs + addPause,
  };
}

export function startCall(a: AttendantLike, now: bigint) {
  if (a.status !== "AVAILABLE") return a;

  const addIdle = elapsedMs(a.idleSince, now);

  return {
    ...a,
    status: "IN_CALL" as const,
    statusSince: now,
    idleMs: a.idleMs + addIdle,
  };
}

export function finishCall(a: AttendantLike, now: bigint) {
  if (a.status !== "IN_CALL") return a;

  const addCall = elapsedMs(a.statusSince, now);

  return {
    ...a,
    status: "AVAILABLE" as const,
    statusSince: now,
    callMs: a.callMs + addCall,
    handledCalls: a.handledCalls + 1,
    idleSince: now,
    idleMs: 0n,
  };
}
