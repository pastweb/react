import { createMicroStore as createToolsMicroStore } from '@pastweb/tools';
import { reuseMicroStore } from './reuseMicroStore';
import type { MicroStoreActions, Selector } from './reuseMicroStore';
import type { MicroStoreConfig, ReactUseMicroStore } from './types';

/**
 * Creates a tools micro-store and returns a React-ready hook for it.
 *
 * The parameters match `createMicroStore` from `@pastweb/tools`. The returned
 * hook is produced by {@link reuseMicroStore}, so React components re-render
 * when the selected micro-store state changes.
 *
 * Define the store in a module, export the hook, and import it in components.
 *
 * @typeParam S - Micro-store state shape.
 * @typeParam A - Micro-store action shape.
 * @param name - Unique store name.
 * @param setup - Tools micro-store setup function.
 * @returns React hook for reading the micro-store.
 *
 * @example
 * ```ts
 * // @/stores/counterStore.ts
 * import { createMicroStore } from '@pastweb/react';
 *
 * export const useCounterStore = createMicroStore('counter', () => ({
 *   state: { count: 0 },
 *   actions: {
 *     increment() {
 *       this.state.count += 1;
 *     },
 *   },
 * }));
 * ```
 *
 * @example
 * ```tsx
 * // Counter.tsx
 * import { useCounterStore } from '@/stores/counterStore';
 *
 * export function Counter() {
 *   const counter = useCounterStore(state => state.count);
 *
 *   return <button onClick={counter.increment}>{counter.state}</button>;
 * }
 * ```
 */
export function createMicroStore<S extends Record<string, any>, A extends MicroStoreActions>(
  name: string,
  setup: (select: <T>(fn: Selector<T, S>) => T) => MicroStoreConfig<S, A>,
): ReactUseMicroStore<S, A> {
  return reuseMicroStore(createToolsMicroStore(name, setup));
}
