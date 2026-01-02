import type { Attendant } from "../../domain/attendant";

const STORAGE_KEY = "callqueue.attendants.v1";

type StoredPayload = {
  attendants: Attendant[];
};

function reportStorageError(action: string, error: unknown): void {
  if (!import.meta.env.DEV) return;
  console.warn(`[CallQueue] localStorage ${action} failed`, error);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function clampPastOrNow(value: number, now: number): number {
  return value > now ? now : value;
}

function nonNegative(value: number): number {
  return value < 0 ? 0 : value;
}

function normalizeAttendant(raw: any, now: number): Attendant | null {
  if (!raw || typeof raw !== "object") return null;

  const code = typeof raw.code === "string" ? raw.code : null;
  if (!code) return null;

  const firstName =
    typeof raw.firstName === "string" ? raw.firstName : "Atendente";
  const lastName = typeof raw.lastName === "string" ? raw.lastName : "";

  const statusRaw = raw.status;
  const status: Attendant["status"] =
    statusRaw === "AVAILABLE" ||
    statusRaw === "IN_CALL" ||
    statusRaw === "PAUSED"
      ? statusRaw
      : "AVAILABLE";

  const roleRaw = raw.role;
  const role: Attendant["role"] =
    roleRaw === "DEFAULT" ||
    roleRaw === "PRIORITARIO" ||
    roleRaw === "CONTINGENCIA"
      ? roleRaw
      : "DEFAULT";

  const joinedAt = clampPastOrNow(
    isFiniteNumber(raw.joinedAt) ? raw.joinedAt : now,
    now
  );

  const statusSince = clampPastOrNow(
    isFiniteNumber(raw.statusSince) ? raw.statusSince : joinedAt,
    now
  );

  const idleSince = clampPastOrNow(
    isFiniteNumber(raw.idleSince) ? raw.idleSince : now,
    now
  );

  const idleMs = nonNegative(isFiniteNumber(raw.idleMs) ? raw.idleMs : 0);
  const callMs = nonNegative(isFiniteNumber(raw.callMs) ? raw.callMs : 0);
  const pauseMs = nonNegative(isFiniteNumber(raw.pauseMs) ? raw.pauseMs : 0);

  const handledCallsRaw = isFiniteNumber(raw.handledCalls)
    ? raw.handledCalls
    : 0;
  const handledCalls = nonNegative(Math.floor(handledCallsRaw));

  return {
    code,
    firstName,
    lastName,
    status,
    role,
    joinedAt,
    statusSince,
    idleSince,
    idleMs,
    callMs,
    pauseMs,
    handledCalls,
  };
}

function normalizeAttendants(list: unknown, now: number): Attendant[] {
  if (!Array.isArray(list)) return [];

  const normalized: Attendant[] = [];
  const seenCodes = new Set<string>();

  for (const item of list) {
    const a = normalizeAttendant(item, now);
    if (!a) continue;
    if (seenCodes.has(a.code)) continue;
    seenCodes.add(a.code);
    normalized.push(a);
  }

  return normalized;
}

export function loadAttendants(): Attendant[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as StoredPayload;
    const now = Date.now();

    return normalizeAttendants(parsed?.attendants, now);
  } catch (error) {
    reportStorageError("read/parse", error);
    return [];
  }
}

export function saveAttendants(attendants: Attendant[]): void {
  try {
    const payload: StoredPayload = { attendants };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    reportStorageError("write", error);
  }
}

export function clearAttendantsStorage(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    reportStorageError("clear", error);
  }
}
