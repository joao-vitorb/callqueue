import type { Attendant } from "../../domain/attendant";

const MAX_ATTENDANTS = 50;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function getNextAvailableCode(attendants: Attendant[]): string | null {
  const used = new Set(attendants.map((a) => a.code));

  for (let n = 1; n <= MAX_ATTENDANTS; n += 1) {
    const code = pad2(n);
    if (!used.has(code)) return code;
  }

  return null;
}

export function getMaxAttendants(): number {
  return MAX_ATTENDANTS;
}
