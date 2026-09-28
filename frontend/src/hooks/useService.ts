import { useEffect, useState } from 'react';

/**
 * Runs a (stable, module-level) service getter once and tracks loading.
 * Pass the getter by reference — e.g. useService(getScores) — so the effect
 * doesn't re-run. The service layer caches, so only the first call is slow.
 */
export function useService<T>(fn: () => Promise<T>): { data: T | null; loading: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fn().then((d) => {
      if (alive) {
        setData(d);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [fn]);
  return { data, loading };
}
