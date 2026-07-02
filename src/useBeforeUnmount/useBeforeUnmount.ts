import { useEffect, useRef } from 'react';

/**
 * Runs the latest callback when the component unmounts.
 *
 * @param fn - Cleanup callback.
 *
 * @example
 * ```tsx
 * useBeforeUnmount(() => {
 *   subscription.close();
 * });
 * ```
 */
export const useBeforeUnmount = (fn: () => void): void => {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => () => fnRef.current(), []);
}
