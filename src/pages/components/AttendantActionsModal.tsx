import type { Attendant } from "../../domain/attendant";
import { ROLE_LABEL, STATUS_LABEL } from "../../domain/attendant";

type Props = {
  attendant: Attendant | null;
  onClose: () => void;
  onLogout: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinishCall: () => void;
};

export default function AttendantActionsModal({
  attendant,
  onClose,
  onLogout,
  onPause,
  onResume,
  onFinishCall,
}: Props) {
  if (!attendant) return null;

  const canPause = attendant.status === "AVAILABLE";
  const canResume = attendant.status === "PAUSED";
  const canFinishCall = attendant.status === "IN_CALL";

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        role="button"
        tabIndex={0}
      />

      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-zinc-400">Código {attendant.code}</p>
            <h3 className="mt-1 text-lg font-semibold text-zinc-50">
              {attendant.firstName} {attendant.lastName}
            </h3>
            <p className="mt-1 text-sm text-zinc-300">
              {ROLE_LABEL[attendant.role]} • {STATUS_LABEL[attendant.status]}
            </p>
          </div>

          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-50 hover:bg-white/10"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onPause}
            disabled={!canPause}
          >
            Pausar
          </button>

          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onResume}
            disabled={!canResume}
          >
            Despausar
          </button>

          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onFinishCall}
            disabled={!canFinishCall}
          >
            Finalizar ligação
          </button>

          <button
            type="button"
            className="rounded-xl bg-red-500/90 px-3 py-2 text-sm font-semibold text-zinc-50 hover:bg-red-500"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>

        {/* TODO: adicionar confirmação para logout */}
      </div>
    </div>
  );
}
