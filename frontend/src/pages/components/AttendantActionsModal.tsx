import { useEffect } from "react";
import type { Attendant, AttendantRole } from "../../domain/attendant";
import { ROLE_LABEL, STATUS_LABEL } from "../../domain/attendant";
import RoleIcon from "./RoleIcon";
import { formatClockTime, formatDuration } from "../../shared/utils/time";

type Props = {
  attendant: Attendant | null;
  now: number;
  onClose: () => void;
  onLogout: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinishCall: () => void;
  onSetRole: (role: AttendantRole) => void;
};

const ROLE_DESCRIPTION: Record<AttendantRole, string> = {
  DEFAULT:
    "Atendente padrão. Recebe chamadas normalmente (respeitando a regra da 1ª chamada para recém-logados).",
  PRIORITARIO:
    "Prioritário. Quando não há recém-logados, recebe chamadas antes dos demais (desde que esteja disponível).",
  CONTINGENCIA:
    "Contingência. Só recebe chamadas quando não houver nenhum atendente disponível fora da contingência.",
};

function getStatusBadgeClasses(status: Attendant["status"]): string {
  if (status === "AVAILABLE") return "bg-[#83fa70] text-zinc-950";
  if (status === "PAUSED") return "bg-[#50b6fa] text-zinc-950";
  return "bg-[#ffd86b] text-zinc-950";
}

export default function AttendantActionsModal({
  attendant,
  now,
  onClose,
  onLogout,
  onPause,
  onResume,
  onFinishCall,
  onSetRole,
}: Props) {
  useEffect(() => {
    if (!attendant) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [attendant, onClose]);

  if (!attendant) return null;

  const statusElapsedMs = Math.max(0, now - attendant.statusSince);

  const totalCallMs =
    attendant.callMs + (attendant.status === "IN_CALL" ? statusElapsedMs : 0);

  const totalPauseMs =
    attendant.pauseMs + (attendant.status === "PAUSED" ? statusElapsedMs : 0);

  const canFinishCall = attendant.status === "IN_CALL";
  const pauseButtonLabel =
    attendant.status === "PAUSED" ? "Despausar" : "Pausar";
  const pauseButtonDisabled = attendant.status === "IN_CALL";

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        role="button"
        tabIndex={0}
      />

      <div
        className="
          absolute left-1/2 top-1/2 w-[92%] max-w-xl -translate-x-1/2 -translate-y-1/2
          rounded-2xl border border-white/10 bg-zinc-950 shadow-xl
          p-4
          max-sm:p-0
          max-sm:max-h-[calc(100dvh-2rem)] max-sm:overflow-hidden
          max-sm:flex max-sm:flex-col
        "
      >
        <div className="max-sm:p-4 max-sm:border-b max-sm:border-white/10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-zinc-400">Código {attendant.code}</p>
              <h3 className="mt-1 text-lg font-semibold text-zinc-50">
                {attendant.firstName} {attendant.lastName}
              </h3>
            </div>

            <button
              type="button"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-50 hover:bg-white/10 cursor-pointer"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
        </div>

        <div className="max-sm:flex-1 max-sm:overflow-y-auto max-sm:p-4">
          <div className="mt-4 max-sm:mt-0 rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
              Função
            </p>

            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition cursor-pointer ${
                  attendant.role === "DEFAULT"
                    ? "bg-white text-zinc-950"
                    : "border border-white/10 bg-white/5 text-zinc-50 hover:bg-white/10"
                }`}
                onClick={() => onSetRole("DEFAULT")}
              >
                <RoleIcon
                  role="DEFAULT"
                  className={
                    attendant.role === "DEFAULT"
                      ? "text-zinc-950"
                      : "text-white"
                  }
                />
                {ROLE_LABEL.DEFAULT}
              </button>

              <button
                type="button"
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition cursor-pointer ${
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
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition cursor-pointer ${
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

            <p className="mt-3 text-sm text-zinc-300">
              {ROLE_DESCRIPTION[attendant.role]}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-zinc-400">Ligações recebidas</p>
              <p className="mt-1 text-base font-semibold text-zinc-50">
                {attendant.handledCalls}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-zinc-400">Logou às</p>
              <p className="mt-1 text-base font-semibold text-zinc-50">
                {formatClockTime(attendant.joinedAt)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-zinc-400">Tempo total em ligação</p>
              <p className="mt-1 font-mono text-base font-semibold text-zinc-50">
                {formatDuration(totalCallMs)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-zinc-400">Tempo total em pausa</p>
              <p className="mt-1 font-mono text-base font-semibold text-zinc-50">
                {formatDuration(totalPauseMs)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
                Status atual
              </p>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClasses(
                  attendant.status
                )}`}
              >
                {STATUS_LABEL[attendant.status]}
              </span>
            </div>

            <p className="mt-2 text-xs text-zinc-400">Tempo neste status</p>
            <p className="mt-1 font-mono text-base font-semibold text-zinc-50">
              {formatDuration(statusElapsedMs)}
            </p>
          </div>

          <div className="h-2 max-sm:h-4" />
        </div>

        <div className="max-sm:p-4 max-sm:border-t max-sm:border-white/10">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              type="button"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              onClick={onFinishCall}
              disabled={!canFinishCall}
            >
              Finalizar ligação
            </button>

            <button
              type="button"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              onClick={attendant.status === "PAUSED" ? onResume : onPause}
              disabled={pauseButtonDisabled}
            >
              {pauseButtonLabel}
            </button>

            <button
              type="button"
              className="rounded-xl bg-red-500/90 px-3 py-2 text-sm font-semibold text-zinc-50 hover:bg-red-500 cursor-pointer"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
