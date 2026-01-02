import type { Attendant } from "../../domain/attendant";

const STORAGE_KEY = "callqueue.attendants.v1";

type StoredPayload = {
  attendants: Attendant[];
};

function reportStorageError(action: string, error: unknown): void {
  if (!import.meta.env.DEV) return;
  console.warn(`[CallQueue] localStorage ${action} failed`, error);
}

export function loadAttendants(): Attendant[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as StoredPayload;

    if (!parsed || !Array.isArray(parsed.attendants)) return [];
    return parsed.attendants;
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
