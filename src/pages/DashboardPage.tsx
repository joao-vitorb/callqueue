import { useMemo, useState } from "react";
import type { Attendant } from "../domain/attendant";
import AttendantsTable from "./components/AttendantsTable";
import DashboardToolbar from "./components/DashboardToolbar";
import { nowMs } from "../shared/utils/time";
import { generateUniqueName } from "../shared/utils/names";
import { createId } from "../shared/utils/id";

export default function DashboardPage() {
  const [attendants, setAttendants] = useState<Attendant[]>([]);

  const existingNames = useMemo(
    () =>
      attendants.map((a) => ({
        firstName: a.firstName,
        lastName: a.lastName,
      })),
    [attendants]
  );

  const handleAddAttendant = () => {
    const name = generateUniqueName(existingNames);
    const createdAt = nowMs();

    const attendant: Attendant = {
      id: createId("u"),
      firstName: name.firstName,
      lastName: name.lastName,
      status: "AVAILABLE",
      role: "DEFAULT",
      joinedAt: createdAt,
      statusSince: createdAt,
      idleMs: 0,
      callMs: 0,
      pauseMs: 0,
      handledCalls: 0,
    };

    setAttendants((prev) => [attendant, ...prev]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">CallQueue</h1>
          <p className="text-sm text-zinc-300">
            Sistema de gerenciamento de filas e atendentes
          </p>
        </header>

        <main className="mt-8 rounded-2xl border border-white/10 bg-zinc-900/40 p-4 shadow-sm">
          <DashboardToolbar
            onAddAttendant={handleAddAttendant}
            onStartCall={() => {
              // TODO: implementar lógica de "Realizar ligação"
            }}
          />

          <AttendantsTable
            attendants={attendants}
            onSelectAttendant={() => {
              // TODO: abrir menu/ações do atendente selecionado
            }}
          />
        </main>
      </div>
    </div>
  );
}
