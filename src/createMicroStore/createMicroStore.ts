import { createMicroStore as createToolsMicroStore } from '@pastweb/tools';
import { reuseMicroStore } from './reuseMicroStore';
import type {
  MicroStoreActions,
  ReactMicroStoreSelector,
  Selector,
} from './reuseMicroStore';
import type { MicroStoreConfig, ReactUseMicroStore } from './types';

/**
 * Creates a tools micro-store and returns a React-ready hook for it.
 *
 * The parameters match `createMicroStore` from `@pastweb/tools`. The returned
 * hook uses {@link reuseMicroStore} internally, so React components re-render
 * when the selected micro-store state changes.
 *
 * @typeParam S - Micro-store state shape.
 * @typeParam A - Micro-store action shape.
 * @param name - Unique store name.
 * @param setup - Tools micro-store setup function.
 * @returns React hook for reading the micro-store.
 *
 * @example
 * ```tsx
 * const useCounterStore = createMicroStore('counter', () => ({
 *   state: { count: 0 },
 *   actions: {
 *     increment() {
 *       this.state.count += 1;
 *     },
 *   },
 * }));
 *
 * function Counter() {
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
  const store = createToolsMicroStore(name, setup);

  function useReactMicroStore<T>(selector?: ReactMicroStoreSelector<T, S>) {
    return selector ? reuseMicroStore(store, selector) : reuseMicroStore(store);
  }

  return useReactMicroStore as ReactUseMicroStore<S, A>;
}
