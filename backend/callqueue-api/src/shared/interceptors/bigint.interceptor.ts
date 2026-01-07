import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

function toJsonFriendly(value: unknown): unknown {
  if (typeof value === "bigint") {
    const max = BigInt(Number.MAX_SAFE_INTEGER);
    const min = -max;

    if (value >= min && value <= max) {
      return Number(value);
    }

    return value.toString();
  }

  if (Array.isArray(value)) {
    return value.map(toJsonFriendly);
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};

    for (const [k, v] of Object.entries(obj)) {
      out[k] = toJsonFriendly(v);
    }

    return out;
  }

  return value;
}

@Injectable()
export class BigIntSerializationInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data) => toJsonFriendly(data)));
  }
}
