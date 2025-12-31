type Props = {
  onAddAttendant: () => void;
  onStartCall: () => void;
};

export default function DashboardToolbar({
  onAddAttendant,
  onStartCall,
}: Props) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-zinc-50">Atendentes</h2>
        <p className="text-xs text-zinc-400">
          Gerencie login, pausas e distribuição de chamadas.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:opacity-90"
          onClick={onAddAttendant}
        >
          Adicionar atendente
        </button>

        <button
          type="button"
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-50 transition hover:bg-white/10"
          onClick={onStartCall}
        >
          Realizar ligação
        </button>
      </div>
    </div>
  );
}
