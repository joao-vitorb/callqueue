import type { Attendant } from "../../domain/attendant.ts";
import { ROLE_LABEL, STATUS_LABEL } from "../../domain/attendant.ts";
import { getCurrentStatusDurationMs } from "../../domain/attendantDuration.ts";
import { getLiveIdleMs } from "../../domain/attendantLive.ts";
import { formatDuration } from "../../shared/utils/time.ts";
import RoleIcon from "./RoleIcon.tsx";
import FirstCallBadge from "./FirstCallBadge.tsx";

type Props = {
  attendants: Attendant[];
  now: number;
  onSelectAttendant: (attendantCode: string) => void;
};

export default function AttendantsTable({
  attendants,
  now,
  onSelectAttendant,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-white/5 text-left text-xs uppercase tracking-wide text-zinc-300">
            <th className="px-4 py-3">Código</th>
            <th className="px-4 py-3">Atendente</th>
            <th className="px-4 py-3">Função</th>
            <th className="px-4 py-3">Ociosidade</th>
            <th className="px-4 py-3">Duração</th>
            <th className="px-4 py-3">Ação</th>
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
                className="cursor-pointer bg-zinc-950/20 transition hover:bg-white/5"
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

                <td className="px-4 py-3 text-sm font-mono text-zinc-200">
                  {showIdle ? formatDuration(idleMs) : ""}
                </td>

                <td className="px-4 py-3 text-sm font-mono text-zinc-200">
                  {showDuration ? formatDuration(durationMs) : ""}
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-200">
                    {STATUS_LABEL[a.status]}
                  </span>
                </td>
              </tr>
            );
          })}

          {attendants.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-10 text-center text-sm text-zinc-400"
              >
                Nenhum atendente logado.
                {/* TODO: Exibir CTA para adicionar atendente */}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
