import { Injectable } from '@nestjs/common';

export type EventsPayload = Record<string, unknown>;
type Listener = (payload: EventsPayload) => void;

@Injectable()
export class EventsService {
  private listeners = new Set<Listener>();

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(payload: EventsPayload) {
    for (const l of this.listeners) l(payload);
  }
}
