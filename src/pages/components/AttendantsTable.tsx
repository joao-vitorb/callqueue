import type { Attendant } from "../../domain/attendant";
import { ROLE_LABEL, STATUS_LABEL } from "../../domain/attendant";
import { formatDuration } from "../../shared/utils/time";

type Props = {
  attendants: Attendant[];
  onSelectAttendant: (attendantId: string) => void;
};

export default function AttendantsTable({
  attendants,
  onSelectAttendant,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-white/5 text-left text-xs uppercase tracking-wide text-zinc-300">
            <th className="px-4 py-3">Atendente</th>
            <th className="px-4 py-3">Id</th>
            <th className="px-4 py-3">Função</th>
            <th className="px-4 py-3">Ociosidade</th>
            <th className="px-4 py-3">Ligação</th>
            <th className="px-4 py-3">Pausa</th>
            <th className="px-4 py-3">Ação</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/10">
          {attendants.map((a) => (
            <tr
              key={a.id}
              className="cursor-pointer bg-zinc-950/20 transition hover:bg-white/5"
              onClick={() => onSelectAttendant(a.id)}
            >
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-50">
                    {a.firstName} {a.lastName}
                  </span>
                </div>
              </td>

              <td className="px-4 py-3 text-sm text-zinc-300">{a.id}</td>

              <td className="px-4 py-3 text-sm text-zinc-200">
                {ROLE_LABEL[a.role]}
              </td>

              <td className="px-4 py-3 text-sm text-zinc-200">
                {formatDuration(a.idleMs)}
              </td>

              <td className="px-4 py-3 text-sm text-zinc-200">
                {formatDuration(a.callMs)}
              </td>

              <td className="px-4 py-3 text-sm text-zinc-200">
                {formatDuration(a.pauseMs)}
              </td>

              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-200">
                  {STATUS_LABEL[a.status]}
                </span>
              </td>
            </tr>
          ))}

          {attendants.length === 0 && (
            <tr>
              <td
                colSpan={7}
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
