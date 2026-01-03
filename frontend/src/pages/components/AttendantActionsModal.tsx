import type { Attendant, AttendantRole } from "../../domain/attendant.ts";
import { ROLE_LABEL, STATUS_LABEL } from "../../domain/attendant.ts";
import RoleIcon from "./RoleIcon.tsx";

type Props = {
  attendant: Attendant | null;
  onClose: () => void;
  onLogout: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinishCall: () => void;
  onSetRole: (role: AttendantRole) => void;
};

export default function AttendantActionsModal({
  attendant,
  onClose,
  onLogout,
  onPause,
  onResume,
  onFinishCall,
  onSetRole,
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

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
            Função
          </p>

          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              type="button"
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                attendant.role === "DEFAULT"
                  ? "bg-white text-zinc-950"
                  : "border border-white/10 bg-white/5 text-zinc-50 hover:bg-white/10"
              }`}
              onClick={() => onSetRole("DEFAULT")}
            >
              <RoleIcon
                role="DEFAULT"
                className={
                  attendant.role === "DEFAULT" ? "text-zinc-950" : "text-white"
                }
              />
              {ROLE_LABEL.DEFAULT}
            </button>

            <button
              type="button"
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                attendant.role === "PRIORITARIO"
                  ? "bg-white text-zinc-950"
                  : "border border-white/10 bg-white/5 text-zinc-50 hover:bg-white/10"
              }`}
              onClick={() => onSetRole("PRIORITARIO")}
            >
              <RoleIcon
                role="PRIORITARIO"
                className={
                  attendant.role === "PRIORITARIO"
                    ? "text-zinc-950"
                    : "text-white"
                }
              />
              {ROLE_LABEL.PRIORITARIO}
            </button>

            <button
              type="button"
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                attendant.role === "CONTINGENCIA"
                  ? "bg-white text-zinc-950"
                  : "border border-white/10 bg-white/5 text-zinc-50 hover:bg-white/10"
              }`}
              onClick={() => onSetRole("CONTINGENCIA")}
            >
              <RoleIcon
                role="CONTINGENCIA"
                className={
                  attendant.role === "CONTINGENCIA"
                    ? "text-zinc-950"
                    : "text-white"
                }
              />
              {ROLE_LABEL.CONTINGENCIA}
            </button>
          </div>

          {/* TODO: adicionar tooltip explicando prioridade das funções */}
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
