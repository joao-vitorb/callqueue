import { useMemo, useState } from "react";
import type { Attendant } from "../domain/attendant";
import AttendantsTable from "./components/AttendantsTable";
import DashboardToolbar from "./components/DashboardToolbar";
import AttendantActionsModal from "./components/AttendantActionsModal";
import { nowMs } from "../shared/utils/time";
import { generateUniqueName } from "../shared/utils/names";
import { getMaxAttendants, getNextAvailableCode } from "../shared/utils/attendantCode";
import { finishCall, pauseAttendant, resumeAttendant } from "../domain/attendantTransitions";

export default function DashboardPage() {
  const [attendants, setAttendants] = useState<Attendant[]>([]);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const selectedAttendant = useMemo(
    () => attendants.find((a) => a.code === selectedCode) ?? null,
    [attendants, selectedCode]
  );

  const existingNames = useMemo(
    () =>
      attendants.map((a) => ({
        firstName: a.firstName,
        lastName: a.lastName,
      })),
    [attendants]
  );

  const handleAddAttendant = () => {
    const nextCode = getNextAvailableCode(attendants);
    if (!nextCode) return;

    const name = generateUniqueName(existingNames);
    const createdAt = nowMs();

    const attendant: Attendant = {
      code: nextCode,
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

  const handleLogout = (code: string) => {
    setAttendants((prev) => prev.filter((a) => a.code !== code));
    setSelectedCode(null);
  };

  const handlePause = (code: string) => {
    const now = nowMs();
    setAttendants((prev) =>
      prev.map((a) => (a.code === code ? pauseAttendant(a, now) : a))
    );
  };

  const handleResume = (code: string) => {
    const now = nowMs();
    setAttendants((prev) =>
      prev.map((a) => (a.code === code ? resumeAttendant(a, now) : a))
    );
  };

  const handleFinishCall = (code: string) => {
    const now = nowMs();
    setAttendants((prev) =>
      prev.map((a) => (a.code === code ? finishCall(a, now) : a))
    );
  };

  const maxReached = attendants.length >= getMaxAttendants();

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
            disableAdd={maxReached}
          />

          {maxReached && (
            <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
              Limite máximo de 50 atendentes atingido.
            </div>
          )}

          <AttendantsTable attendants={attendants} onSelectAttendant={setSelectedCode} />

          <AttendantActionsModal
            attendant={selectedAttendant}
            onClose={() => setSelectedCode(null)}
            onLogout={() => {
              if (!selectedAttendant) return;
              handleLogout(selectedAttendant.code);
            }}
            onPause={() => {
              if (!selectedAttendant) return;
              handlePause(selectedAttendant.code);
            }}
            onResume={() => {
              if (!selectedAttendant) return;
              handleResume(selectedAttendant.code);
            }}
            onFinishCall={() => {
              if (!selectedAttendant) return;
              handleFinishCall(selectedAttendant.code);
            }}
          />
        </main>
      </div>
    </div>
  );
}
