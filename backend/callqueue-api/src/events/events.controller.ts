import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Sse()
  stream(): Observable<MessageEvent> {
    return new Observable<MessageEvent>((subscriber) => {
      const unsubscribe = this.events.subscribe((payload) => {
        subscriber.next({ data: payload });
      });

      subscriber.next({ data: { type: 'CONNECTED' } });

      return () => unsubscribe();
    });
  }
}
