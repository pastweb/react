import { useRef } from 'react';

/**
 * Runs a function once during the component's first render.
 *
 * This hook is useful for synchronous setup that must be available before the
 * initial React commit. It intentionally does not run again on re-render.
 *
 * @param fn - Function to run once before mount.
 *
 * @example
 * ```tsx
 * useBeforeMount(() => {
 *   registry.register(id);
 * });
 * ```
 */
export const useBeforeMount = (fn: () => void): void => {
  const isFunctionCalled = useRef(false);

  if (!isFunctionCalled.current) {
    fn();
    isFunctionCalled.current = true;
  }
}
