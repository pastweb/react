import { useCallback, useEffect, useRef } from 'react';
import { effect } from '@pastweb/tools/reactivity';
import { useForceUpdate } from '../../../useForceUpdate';

/**
 * Reads enumerable fields from a reactive tools state object.
 *
 * Accessing each field while a tools `effect` is active registers those fields
 * as dependencies. `useReactiveRender` captures the field names from the first
 * state object and then uses this helper to read the matching values.
 *
 * @param target - Reactive state object returned by a tools API hook.
 * @returns Current values for the enumerable fields.
 */
export function readReactiveFields(target: Record<PropertyKey, any>): unknown[] {
  return Object.keys(target).map(key => target[key]);
}

/**
 * Bridges a tools reactive object into React rendering.
 *
 * The core API hooks from `@pastweb/tools` own the query/mutation state
 * machine. This helper subscribes to their reactive fields and forces a React
 * render whenever one changes, so React components can consume the same object
 * directly.
 *
 * @typeParam TState - Reactive state object shape.
 * @param createState - Factory called once to create the tools reactive state.
 * @param getSnapshot - Optional custom dependency reader. If omitted, the
 * enumerable keys from the first state object are observed.
 * @returns The created reactive state object.
 */
export function useReactiveRender<TState extends Record<PropertyKey, any>>(
  createState: () => TState,
  getSnapshot?: (state: TState) => unknown[],
): TState {
  const state = useRef<TState | null>(null);
  const stateKeys = useRef<string[]>([]);
  const forceUpdate = useForceUpdate();

  if (!state.current) {
    state.current = createState();
    stateKeys.current = Object.keys(state.current);
  }

  const readSnapshot = useCallback((target: TState) => {
    if (getSnapshot) return getSnapshot(target);

    return stateKeys.current.map(key => target[key]);
  }, [getSnapshot]);

  useEffect(() => {
    effect(forceUpdate, () => readSnapshot(state.current as TState));
  }, [forceUpdate, readSnapshot]);

  return state.current;
}
