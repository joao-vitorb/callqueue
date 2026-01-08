import type { Attendant } from "../../domain/attendant";
import { ROLE_LABEL, STATUS_LABEL } from "../../domain/attendant";
import { getCurrentStatusDurationMs } from "../../domain/attendantDuration";
import { getLiveIdleMs } from "../../domain/attendantLive";
import { formatDuration } from "../../shared/utils/time";
import RoleIcon from "./RoleIcon";
import FirstCallBadge from "./FirstCallBadge";

function getStatusBadgeClasses(status: Attendant["status"]): string {
  if (status === "AVAILABLE") return "bg-[#83fa70] text-zinc-950";
  if (status === "PAUSED") return "bg-[#50b6fa] text-zinc-950";
  return "bg-[#ffd86b] text-zinc-950";
}

type Props = {
  attendants: Attendant[];
  now: number;
  onSelectAttendant: (attendantCode: string) => void;
  onAddAttendant?: () => void;
};

export default function AttendantsTable({
  attendants,
  now,
  onSelectAttendant,
  onAddAttendant,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/20">
      <div className="w-full overflow-x-auto overflow-y-hidden touch-pan-x sm:overflow-x-visible [-webkit-overflow-scrolling:touch]">
        <table className="w-full border-separate border-spacing-0 max-sm:min-w-[760px]">
          <thead>
            <tr className="bg-white/5 text-left text-xs uppercase tracking-wide text-zinc-300">
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Atendente</th>
              <th className="px-4 py-3">Função</th>
              <th className="px-4 py-3">Ociosidade</th>
              <th className="px-4 py-3">Duração</th>
              <th className="px-4 py-3">Ação</th>
            </tr>
            <tr>
              <td colSpan={6} className="h-px bg-white/10 p-0" />
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {attendants.map((a) => {
              const idleMs = getLiveIdleMs(a, now);
              const durationMs = getCurrentStatusDurationMs(a, now);

              const showIdle = a.status !== "IN_CALL";
              const showDuration = a.status !== "AVAILABLE";

              return (
                <tr
                  key={a.code}
                  className="cursor-pointer transition hover:bg-white/5"
                  onClick={() => onSelectAttendant(a.code)}
                >
                  <td className="px-4 py-3 text-sm text-zinc-300">{a.code}</td>

                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-2 text-sm font-medium text-zinc-50">
                        <FirstCallBadge isVisible={a.handledCalls === 0} />
                        {a.firstName} {a.lastName}
                      </span>

                      <span className="text-xs text-zinc-400">
                        {STATUS_LABEL[a.status]}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 text-sm text-zinc-200">
                      <RoleIcon role={a.role} className="text-white" />
                      {ROLE_LABEL[a.role]}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-mono text-sm text-zinc-200">
                    {showIdle ? formatDuration(idleMs) : ""}
                  </td>

                  <td className="px-4 py-3 font-mono text-sm text-zinc-200">
                    {showDuration ? formatDuration(durationMs) : ""}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClasses(
                        a.status
                      )}`}
                    >
                      {STATUS_LABEL[a.status]}
                    </span>
                  </td>
                </tr>
              );
            })}

            {attendants.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="mx-auto flex max-w-md flex-col items-center gap-3">
                    <p className="text-sm text-zinc-400">
                      Nenhum atendente logado.
                    </p>

                    <button
                      type="button"
                      onClick={onAddAttendant}
                      disabled={!onAddAttendant}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Adicionar atendente
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
