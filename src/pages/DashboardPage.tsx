export default function DashboardPage() {
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
          {/* TODO: Criar toolbar com botões (Adicionar atendente, Realizar ligação) */}
          {/* TODO: Criar tabela de atendentes */}
        </main>
      </div>
    </div>
  );
}
