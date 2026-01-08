# CallQueue — Sistema de gerenciamento de fila de atendentes para operações de telecom

O CallQueue simula uma operação de telecom onde atendentes entram e saem do turno, alternam entre disponível/pausa/atendendo e recebem chamadas conforme regras de prioridade.
O sistema foi desenvolvido com React, NestJS, Typescript, TailwindCSS, Prisma e SQLite.

---

## Acesse

- CallQueue: add link

---

## Objetivo

- Meu objetivo com o CallQueue é praticar minhas habilidades em desenvolvimento web e lógica de programação através da criação de um sistema funcional e lógica simples de se entender.

---

## Página Principal

add imagem

## Modal de Ações

add imagem

---

## Funcionalidades

### Lista atendentes logados com:

- Código (01–50)
- Nome
- Função (Padrão / Prioritário / Contingência)
- Ociosidade (tempo “livre”)
- Duração (tempo no status atual quando em pausa ou em ligação)
- Status (Disponível / Em pausa / Atendendo)

### Ações principais:

- Adicionar atendente (nome aleatório único)
- Realizar ligação (roteamento automático)

### Ao clicar em um atendente:

- Pausar / Despausar
- Finalizar ligação
- Logout
- Alterar função

---

## Tecnologias e Arquitetura

### Frontend

- React.js + Vite
- TypeScript
- Vite
- Tailwind CSS
- Font Awesome (ícones)
- Server-Sent Events (EventSource) para atualização em tempo real
  - UI + timers “ao vivo” (exibição)
  - Consome API do backend
  - Escuta eventos do servidor (SSE) para atualizar automaticamente (quando habilitado)

### Backend

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- Server-Sent Events (SSE) via @Sse() (stream de eventos)
- Interceptor de serialização de BigInt (JSON-friendly)
  - API REST para listar/criar/remover atendentes e executar ações
  - Prisma para persistência
  - Eventos de atualização (SSE) para sincronizar telas

### Banco de Dados

- SQLite

---

## Regras de Roteamento (Lógica da Fila)

A distribuição de ligações segue estas regras:

- Recém-logado recebe a primeira ligação primeiro

  - Independente de função ou ociosidade.
  - Após finalizar a primeira ligação, volta para a lógica normal.

- Prioritário

  - Quando disponível, recebe ligações antes dos demais (exceto recém-logado).

- Padrão

  - Participa normalmente, recebendo por ordem de ociosidade.

- Contingência

  - Só recebe ligações se não houver ninguém disponível nas outras funções.

- Disponibilidade

  - Quem está em pausa ou em ligação não pode receber novas ligações.

- A lógica de fila e transições está organizada em módulos/domínio para manter o código limpo e fácil de manter.

---

## Estrutura do Projeto

```
CALLQUEUE/
│
├── backend/
│   └── callqueue-api/
│       ├── prisma/
│       ├── src/
│       │   ├── actions/
│       │   ├── attendants/
│       │   ├── domain/
│       │   ├── events/
│       │   ├── prisma/
│       │   └── shared/
│       ├── .env
│       └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── assets/
    │   ├── domain/
    │   ├── pages/
    │   ├── shared/
    │   ├── index.css
    │   └── main.tsx
    ├── public/
    ├── .env
    ├── package.json
    └── vite.config.js
```

---

## Rodando Localmente

### Frontend

```
cd frontend
npm install
npm run dev
```

### Backend

```
cd backend/callqueue-api
npm install
npm run start:dev
```

---

### Licença

## Este projeto é de uso privado e não possui licença de distribuição
