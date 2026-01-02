import type { Attendant } from "./attendant";
import { getLiveIdleMs } from "./attendantLive";

function byCodeAsc(a: Attendant, b: Attendant): number {
  return a.code.localeCompare(b.code);
}

function pickCandidate(candidates: Attendant[], now: number): Attendant | null {
  if (candidates.length === 0) return null;

  const neverHandled = candidates
    .filter((a) => a.handledCalls === 0)
    .sort(byCodeAsc);

  if (neverHandled.length > 0) return neverHandled[0];

  let best: Attendant | null = null;
  let bestIdle = -1;

  for (const a of candidates) {
    const idle = getLiveIdleMs(a, now);
    if (idle > bestIdle) {
      best = a;
      bestIdle = idle;
      continue;
    }

    if (idle === bestIdle && best && a.code.localeCompare(best.code) < 0) {
      best = a;
    }
  }

  return best;
}

export function selectNextAttendantCodeForCall(
  attendants: Attendant[],
  now: number
): string | null {
  const available = attendants.filter((a) => a.status === "AVAILABLE");

  const prioritarios = available.filter((a) => a.role === "PRIORITARIO");
  const pickedPrioritario = pickCandidate(prioritarios, now);
  if (pickedPrioritario) return pickedPrioritario.code;

  const padrao = available.filter((a) => a.role === "DEFAULT");
  const pickedPadrao = pickCandidate(padrao, now);
  if (pickedPadrao) return pickedPadrao.code;

  const contingencia = available.filter((a) => a.role === "CONTINGENCIA");
  const pickedContingencia = pickCandidate(contingencia, now);
  if (pickedContingencia) return pickedContingencia.code;

  return null;
}
