export type AttendantCode = string;

export type AttendantStatus = "AVAILABLE" | "IN_CALL" | "PAUSED";

export type AttendantRole = "DEFAULT" | "PRIORITARIO" | "CONTINGENCIA";

export type Attendant = {
  code: AttendantCode;
  firstName: string;
  lastName: string;
  status: AttendantStatus;
  role: AttendantRole;

  joinedAt: number;
  statusSince: number;

  idleMs: number;
  callMs: number;
  pauseMs: number;

  handledCalls: number;
};

export const STATUS_LABEL: Record<AttendantStatus, string> = {
  AVAILABLE: "Disponível",
  IN_CALL: "Atendendo",
  PAUSED: "Em pausa",
};

export const ROLE_LABEL: Record<AttendantRole, string> = {
  DEFAULT: "Padrão",
  PRIORITARIO: "Prioritário",
  CONTINGENCIA: "Contingência",
};
