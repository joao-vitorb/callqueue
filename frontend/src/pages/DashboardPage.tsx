import { useCallback, useEffect, useMemo, useState } from "react";
import type { Attendant, AttendantRole } from "../domain/attendant.ts";
import AttendantsTable from "./components/AttendantsTable.tsx";
import DashboardToolbar from "./components/DashboardToolbar.tsx";
import AttendantActionsModal from "./components/AttendantActionsModal.tsx";
import { useNow } from "../shared/hooks/useNow.ts";
import { callqueueApi } from "../shared/api/callqueueApi.ts";
import { connectEvents } from "../shared/api/events.ts";

export default function DashboardPage() {
  const [attendants, setAttendants] = useState<Attendant[]>([]);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const now = useNow({ intervalMs: 1000 });

  const selectedAttendant = useMemo(
    () => attendants.find((a) => a.code === selectedCode) ?? null,
    [attendants, selectedCode]
  );

  const refresh = useCallback(async () => {
    try {
      const data = await callqueueApi.listAttendants();
      setAttendants(data);

      setSelectedCode((prev) => {
        if (!prev) return null;
        return data.some((a) => a.code === prev) ? prev : null;
      });

      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar atendentes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const disconnect = connectEvents({
      onMessage: (evt) => {
        if (evt.type === "ATTENDANTS_CHANGED") refresh();
      },
      onStatusChange: (status) => {
        console.log("SSE:", status);
      },
    });

    return () => disconnect();
  }, [refresh]);

  const handleAddAttendant = async () => {
    try {
      await callqueueApi.addAttendant();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao adicionar atendente");
      // TODO: exibir feedback mais amigável (toast/inline)
    }
  };

  const handleStartCall = async () => {
    try {
      await callqueueApi.startCall();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao iniciar ligação");
      // TODO: exibir feedback mais amigável (toast/inline)
    }
  };

  const handleLogout = async (code: string) => {
    try {
      await callqueueApi.logout(code);
      setSelectedCode(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao fazer logout");
      // TODO: exibir feedback mais amigável (toast/inline)
    }
  };

  const handlePause = async (code: string) => {
    try {
      await callqueueApi.pause(code);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao pausar");
      // TODO: exibir feedback mais amigável (toast/inline)
    }
  };

  const handleResume = async (code: string) => {
    try {
      await callqueueApi.resume(code);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao despausar");
      // TODO: exibir feedback mais amigável (toast/inline)
    }
  };

  const handleFinishCall = async (code: string) => {
    try {
      await callqueueApi.finishCall(code);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao finalizar ligação");
      // TODO: exibir feedback mais amigável (toast/inline)
    }
  };

  const handleSetRole = async (code: string, role: AttendantRole) => {
    try {
      await callqueueApi.setRole(code, role);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao alterar função");
      // TODO: exibir feedback mais amigável (toast/inline)
    }
  };

  const maxReached = attendants.length >= 50;

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
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
              {/* TODO: botão "Tentar novamente" chamando refresh() */}
            </div>
          )}

          <DashboardToolbar
            onAddAttendant={handleAddAttendant}
            onStartCall={handleStartCall}
            disableAdd={maxReached}
          />

          {maxReached && (
            <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
              Limite máximo de 50 atendentes atingido.
            </div>
          )}

          {isLoading ? (
            <div className="py-10 text-center text-sm text-zinc-400">
              Carregando...
              {/* TODO: substituir por skeleton */}
            </div>
          ) : (
            <AttendantsTable
              attendants={attendants}
              now={now}
              onSelectAttendant={setSelectedCode}
            />
          )}

          <AttendantActionsModal
            attendant={selectedAttendant}
            now={now}
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
            onSetRole={(role) => {
              if (!selectedAttendant) return;
              handleSetRole(selectedAttendant.code, role);
            }}
          />
        </main>
      </div>
    </div>
  );
}
