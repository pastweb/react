import { useEffect } from 'react';

/**
 * Runs a callback once after the component mounts.
 *
 * Async callbacks are allowed, but returned promises are not used as cleanup
 * functions.
 *
 * @param fn - Callback to run after mount.
 *
 * @example
 * ```tsx
 * useMounted(() => {
 *   analytics.track('mounted');
 * });
 * ```
 */
export const useMounted = (fn: () => void | Promise<void>): void => {
  useEffect(() => {
    void Promise.resolve(fn());
  }, []);
}
