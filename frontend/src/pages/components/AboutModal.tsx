type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AboutModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        role="button"
        tabIndex={0}
        aria-label="Fechar modal"
      />

      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-zinc-50">
              O que é o CallQueue?
            </h2>
            <p className="text-sm text-zinc-300">
              Sistema de gerenciamento de atendentes e distribuição automática
              de chamadas.
            </p>
          </div>

          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-50 hover:bg-white/10 cursor-pointer"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>

        <div className="mt-5 space-y-5 text-sm text-zinc-200">
          <section className="space-y-2">
            <h3 className="text-base font-semibold text-zinc-50">
              Visão geral
            </h3>
            <p className="text-zinc-300">
              O CallQueue simula uma operação de telecom onde atendentes entram
              e saem do turno, alternam entre disponível/pausa/atendendo e
              recebem chamadas conforme regras de prioridade.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-semibold text-zinc-50">
              Regras de roteamento
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-zinc-300">
              <li>
                O atendente{" "}
                <span className="font-semibold text-zinc-100">
                  recém-logado
                </span>{" "}
                recebe a{" "}
                <span className="font-semibold text-zinc-100">primeira</span>{" "}
                ligação antes de todos, independentemente da função ou
                ociosidade.
              </li>
              <li>
                Após a primeira ligação, a distribuição segue por função e tempo
                de ociosidade.
              </li>
              <li>
                <span className="font-semibold text-zinc-100">Prioritário</span>
                : recebe chamadas antes dos demais quando estiver disponível.
              </li>
              <li>
                <span className="font-semibold text-zinc-100">
                  Contingência
                </span>
                : só recebe chamadas quando não houver ninguém disponível nas
                outras funções.
              </li>
              <li>
                A chamada é atribuída para quem está disponível e com melhor
                prioridade pelas regras.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-semibold text-zinc-50">
              O que você pode fazer
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-zinc-300">
              <li>
                Adicionar atendentes com código (01–50) e nomes gerados
                automaticamente.
              </li>
              <li>Iniciar uma ligação (roteamento automático).</li>
              <li>
                Pausar, despausar, finalizar ligação e deslogar atendentes.
              </li>
              <li>
                Alterar função do atendente (Padrão / Prioritário /
                Contingência).
              </li>
              <li>Visualizar timers e status em tempo real na interface.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-semibold text-zinc-50">
              Tecnologias utilizadas
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="font-semibold text-zinc-50">Frontend</p>
                <p className="mt-1 text-zinc-300">
                  React + TypeScript + Tailwind CSS
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="font-semibold text-zinc-50">Backend</p>
                <p className="mt-1 text-zinc-300">NestJS + Prisma (API REST)</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="font-semibold text-zinc-50">Banco de dados</p>
                <p className="mt-1 text-zinc-300">
                  Prisma ORM + SQLite
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="font-semibold text-zinc-50">Tempo real</p>
                <p className="mt-1 text-zinc-300">
                  SSE (Server-Sent Events) para sincronizar atualizações no
                  dashboard
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-semibold text-zinc-50">Objetivo</h3>
            <p className="text-zinc-300">
              Meu objetivo com o CallQueue é praticar minhas habilidades em
              desenvolvimento web e lógica de programação através da criação de
              um sistema funcional e lógica simples de se entender. 
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
