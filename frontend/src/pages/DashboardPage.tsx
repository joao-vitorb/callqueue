import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Attendant, AttendantRole } from "../domain/attendant";
import AttendantsTable from "./components/AttendantsTable";
import DashboardToolbar from "./components/DashboardToolbar";
import AttendantActionsModal from "./components/AttendantActionsModal";
import { useNow } from "../shared/hooks/useNow";
import { callqueueApi } from "../shared/api/callqueueApi";
import { connectEvents } from "../shared/api/events";
import AboutModal from "./components/AboutModal";

type ToastKind = "success" | "error" | "info";

type ToastState = {
  open: boolean;
  kind: ToastKind;
  message: string;
};

function Toast({ state, onClose }: { state: ToastState; onClose: () => void }) {
  if (!state.open) return null;

  const stylesByKind: Record<ToastKind, string> = {
    success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
    error: "border-red-500/20 bg-red-500/10 text-red-200",
    info: "border-white/10 bg-white/5 text-zinc-200",
  };

  return (
    <div className="fixed bottom-5 left-1/2 z-[60] w-[92%] max-w-lg -translate-x-1/2">
      <div
        className={[
          "flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 shadow-xl",
          stylesByKind[state.kind],
        ].join(" ")}
        role="status"
        aria-live="polite"
      >
        <p className="text-sm">{state.message}</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-50 hover:bg-white/10"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

function AttendantsTableSkeleton() {
  const rows = Array.from({ length: 6 });

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <div className="bg-white/5 px-4 py-3">
        <div className="h-3 w-56 animate-pulse rounded bg-white/10" />
      </div>

      <div className="divide-y divide-white/10">
        {rows.map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-4">
            <div className="h-4 w-52 animate-pulse rounded bg-white/10" />
            <div className="ml-auto grid grid-cols-4 gap-3">
              <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [attendants, setAttendants] = useState<Attendant[]>([]);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [toast, setToast] = useState<ToastState>({
    open: false,
    kind: "info",
    message: "",
  });

  const toastTimerRef = useRef<number | null>(null);

  const now = useNow({ intervalMs: 1000 });

  const selectedAttendant = useMemo(
    () => attendants.find((a) => a.code === selectedCode) ?? null,
    [attendants, selectedCode]
  );

  const showToast = useCallback((kind: ToastKind, message: string) => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);

    setToast({ open: true, kind, message });

    toastTimerRef.current = window.setTimeout(() => {
      setToast((prev) => (prev.open ? { ...prev, open: false } : prev));
      toastTimerRef.current = null;
    }, 3500);
  }, []);

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
    });

    return () => {
      disconnect();
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, [refresh]);

  const run = useCallback(
    async (fn: () => Promise<void>, successMessage: string) => {
      try {
        await fn();
        await refresh();
        showToast("success", successMessage);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Erro inesperado";
        setError(msg);
        showToast("error", msg);
      }
    },
    [refresh, showToast]
  );

  const handleAddAttendant = () =>
    run(async () => {
      await callqueueApi.addAttendant();
    }, "Atendente adicionado com sucesso.");

  const handleStartCall = () =>
    run(async () => {
      const res = await callqueueApi.startCall();
      if (!res.ok) {
        throw new Error("Nenhum atendente disponível para receber ligação.");
      }
    }, "Ligação iniciada.");

  const handleLogout = (code: string) =>
    run(async () => {
      await callqueueApi.logout(code);
      setSelectedCode(null);
    }, "Atendente deslogado.");

  const handlePause = (code: string) =>
    run(async () => {
      await callqueueApi.pause(code);
    }, "Atendente pausado.");

  const handleResume = (code: string) =>
    run(async () => {
      await callqueueApi.resume(code);
    }, "Atendente despausado.");

  const handleFinishCall = (code: string) =>
    run(async () => {
      await callqueueApi.finishCall(code);
    }, "Ligação finalizada.");

  const handleSetRole = (code: string, role: AttendantRole) =>
    run(async () => {
      await callqueueApi.setRole(code, role);
    }, "Função atualizada.");

  const maxReached = attendants.length >= 50;
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Toast
        state={toast}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
      />

      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">CallQueue</h1>

            <p className="text-sm text-zinc-300">
              Sistema de gerenciamento de filas e atendentes
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAboutOpen(true)}
            className="h-10 cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-zinc-50 hover:bg-white/10"
          >
            O que é o CallQueue?
          </button>
        </header>

        <main className="mt-8 rounded-2xl border border-white/10 bg-zinc-900/40 p-4 shadow-sm">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span>{error}</span>

                <button
                  type="button"
                  onClick={() => refresh()}
                  className="w-fit rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-50 hover:bg-white/10"
                >
                  Tentar novamente
                </button>
              </div>
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
            <AttendantsTableSkeleton />
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

          <AboutModal
            open={isAboutOpen}
            onClose={() => setIsAboutOpen(false)}
          />
        </main>
      </div>
    </div>
  );
}
