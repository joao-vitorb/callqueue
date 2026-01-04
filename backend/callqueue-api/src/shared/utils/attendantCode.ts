import type { Attendant } from "@prisma/client";

const MAX = 50;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function getNextAvailableCode(attendants: Pick<Attendant, "code">[]): string | null {
  const used = new Set(attendants.map((a) => a.code));
  for (let i = 1; i <= MAX; i++) {
    const code = pad2(i);
    if (!used.has(code)) return code;
  }
  return null;
}
