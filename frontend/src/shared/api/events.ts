const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:3000";

type EventPayload = { type: string; [k: string]: unknown };

export type EventsConnectionStatus = "open" | "reconnecting";

type ConnectEventsOptions = {
  onMessage: (payload: EventPayload) => void;
  onStatusChange?: (status: EventsConnectionStatus) => void;
};

export function connectEvents({
  onMessage,
  onStatusChange,
}: ConnectEventsOptions) {
  const es = new EventSource(`${API_URL}/events`);

  es.onopen = () => {
    onStatusChange?.("open");
  };

  es.onmessage = (evt) => {
    try {
      const payload = JSON.parse(evt.data) as EventPayload;
      onMessage(payload);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("[SSE] Erro ao fazer parse:", evt.data, err);
      }
    }
  };

  es.onerror = () => {
    onStatusChange?.("reconnecting");
  };

  return () => es.close();
}
