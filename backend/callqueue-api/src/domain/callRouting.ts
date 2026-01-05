import type { Attendant, AttendantRole } from "@prisma/client";

type RoutingAttendant = Pick<
  Attendant,
  "code" | "role" | "status" | "idleSince" | "handledCalls"
>;

function elapsedMs(since: bigint, now: bigint): bigint {
  return now > since ? now - since : 0n;
}

function roleWeight(role: AttendantRole): number {
  if (role === "PRIORITARIO") return 2;
  if (role === "DEFAULT") return 1;
  return 0;
}

export function selectNextAttendantCodeForCall(
  attendants: RoutingAttendant[],
  now: bigint
): string | null {
  const available = attendants.filter((a) => a.status === "AVAILABLE");
  if (available.length === 0) return null;

  const newOnes = available.filter((a) => a.handledCalls === 0);
  if (newOnes.length > 0) {
    newOnes.sort((a, b) => Number(elapsedMs(b.idleSince, now) - elapsedMs(a.idleSince, now)));
    return newOnes[0].code;
  }

  const prioritarios = available.filter((a) => a.role === "PRIORITARIO");
  if (prioritarios.length > 0) {
    prioritarios.sort((a, b) => Number(elapsedMs(b.idleSince, now) - elapsedMs(a.idleSince, now)));
    return prioritarios[0].code;
  }

  const defaults = available.filter((a) => a.role === "DEFAULT");
  if (defaults.length > 0) {
    defaults.sort((a, b) => Number(elapsedMs(b.idleSince, now) - elapsedMs(a.idleSince, now)));
    return defaults[0].code;
  }

  available.sort((a, b) => Number(elapsedMs(b.idleSince, now) - elapsedMs(a.idleSince, now)));
  return available[0].code;
}
