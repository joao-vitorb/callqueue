import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">CallQueue</h1>
        <p className="app__subtitle">
          Sistema de gerenciamento de filas e atendentes
        </p>
      </header>

      <main className="app__content">
        {/* TODO: Criar a tabela de atendentes */}
        {/* TODO: Criar os botões "Adicionar atendente" e "Realizar ligação" */}
        {/* TODO: Criar ações por atendente (pausar, despausar, finalizar ligação, logout) */}
      </main>
    </div>
  );
}
