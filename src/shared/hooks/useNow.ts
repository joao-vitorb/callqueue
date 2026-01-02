import { useEffect, useState } from "react";
import { nowMs } from "../utils/time";

type Options = {
  intervalMs?: number;
};

export function useNow(options: Options = {}): number {
  const { intervalMs = 1000 } = options;
  const [now, setNow] = useState<number>(() => nowMs());

  useEffect(() => {
    const id = window.setInterval(() => setNow(nowMs()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
