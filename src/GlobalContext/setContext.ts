import { useGlobalContext } from './useGlobalContext';

/**
 * Writes one value into the active {@link GlobalContext}.
 *
 * This helper reads React context internally, so call it during a component or
 * custom hook render path.
 *
 * Components reading the same key through {@link getContext} will re-render when
 * the reactive value changes.
 *
 * @typeParam T - Value type.
 * @param key - Context key to update.
 * @param value - Value to store.
 *
 * @example
 * ```tsx
 * function StatusWriter({ ready }: { ready: boolean }) {
 *   setContext('status', ready ? 'ready' : 'idle');
 *   return null;
 * }
 * ```
 */
export function setContext<T = any>(key: string, value: T): void {
  const globalContext = useGlobalContext();
  globalContext[key] = value;
}
