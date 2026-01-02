import type { Attendant } from "./attendant";
import { getLiveIdleMs } from "./attendantLive";

function pickHighestIdle(candidates: Attendant[], now: number): Attendant | null {
  if (candidates.length === 0) return null;

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

function pickNeverHandled(available: Attendant[]): Attendant | null {
  const neverHandled = available.filter((a) => a.handledCalls === 0);

  if (neverHandled.length === 0) return null;

  neverHandled.sort((a, b) => {
    if (b.joinedAt !== a.joinedAt) return b.joinedAt - a.joinedAt;
    return a.code.localeCompare(b.code);
  });

  return neverHandled[0];
}

export function selectNextAttendantCodeForCall(
  attendants: Attendant[],
  now: number
): string | null {
  const available = attendants.filter((a) => a.status === "AVAILABLE");

  const firstCall = pickNeverHandled(available);
  if (firstCall) return firstCall.code;

  const prioritarios = available.filter((a) => a.role === "PRIORITARIO");
  const pickedPrioritario = pickHighestIdle(prioritarios, now);
  if (pickedPrioritario) return pickedPrioritario.code;

  const padrao = available.filter((a) => a.role === "DEFAULT");
  const pickedPadrao = pickHighestIdle(padrao, now);
  if (pickedPadrao) return pickedPadrao.code;

  const contingencia = available.filter((a) => a.role === "CONTINGENCIA");
  const pickedContingencia = pickHighestIdle(contingencia, now);
  if (pickedContingencia) return pickedContingencia.code;

  return null;
}
