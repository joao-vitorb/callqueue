import type { AttendantRole } from "../../domain/attendant";
import type { Attendant } from "../../domain/attendant";
import { http } from "./http";

type ApiAttendant = {
  code: string;
  firstName: string;
  lastName: string;
  status: "AVAILABLE" | "IN_CALL" | "PAUSED";
  role: "DEFAULT" | "PRIORITARIO" | "CONTINGENCIA";
  joinedAt: number;
  statusSince: number;
  idleSince: number;
  idleMs: number;
  callMs: number;
  pauseMs: number;
  handledCalls: number;
};

function mapApiToDomain(a: ApiAttendant): Attendant {
  return {
    code: a.code,
    firstName: a.firstName,
    lastName: a.lastName,
    status: a.status,
    role: a.role,
    joinedAt: a.joinedAt,
    statusSince: a.statusSince,
    idleSince: a.idleSince,
    idleMs: a.idleMs,
    callMs: a.callMs,
    pauseMs: a.pauseMs,
    handledCalls: a.handledCalls,
  };
}

export const callqueueApi = {
  async listAttendants(): Promise<Attendant[]> {
    const data = await http.get<ApiAttendant[]>("/attendants");
    return data.map(mapApiToDomain);
  },

  async addAttendant(): Promise<Attendant> {
    const data = await http.post<ApiAttendant>("/attendants");
    return mapApiToDomain(data);
  },

  async logout(code: string): Promise<void> {
    await http.del<{ ok: boolean }>(`/attendants/${encodeURIComponent(code)}`);
  },

  async startCall(): Promise<{ ok: boolean; code?: string; reason?: string }> {
    return http.post("/actions/start-call");
  },

  async pause(code: string): Promise<Attendant> {
    const data = await http.post<ApiAttendant>(
      `/actions/pause/${encodeURIComponent(code)}`
    );
    return mapApiToDomain(data);
  },

  async resume(code: string): Promise<Attendant> {
    const data = await http.post<ApiAttendant>(
      `/actions/resume/${encodeURIComponent(code)}`
    );
    return mapApiToDomain(data);
  },

  async finishCall(code: string): Promise<Attendant> {
    const data = await http.post<ApiAttendant>(
      `/actions/finish-call/${encodeURIComponent(code)}`
    );
    return mapApiToDomain(data);
  },

  async setRole(code: string, role: AttendantRole): Promise<Attendant> {
    const data = await http.post<ApiAttendant>(
      `/actions/set-role/${encodeURIComponent(code)}`,
      { role }
    );
    return mapApiToDomain(data);
  },
};
