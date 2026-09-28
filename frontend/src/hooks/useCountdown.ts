import { useEffect, useState } from 'react';
import { cdBig, cdClock, cdMed, cdParts, cdShort, cdUrgent, type CdParts } from '../utils/countdown';

/** A `now` timestamp that ticks every `intervalMs` (default 1s). */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export interface Countdown {
  now: number;
  parts: CdParts;
  short: string;
  med: string;
  big: string;
  clock: string;
  urgent: boolean;
}

/** Live countdown to `target`, re-rendering each second. */
export function useCountdown(target: number): Countdown {
  const now = useNow();
  return {
    now,
    parts: cdParts(target, now),
    short: cdShort(target, now),
    med: cdMed(target, now),
    big: cdBig(target, now),
    clock: cdClock(target, now),
    urgent: cdUrgent(target, now),
  };
}
