import { useEffect, useRef } from 'react';
import { effect } from '@pastweb/tools/reactivity';
import { useForceUpdate } from '../../useForceUpdate';
import { getStoreSnapshot } from './utils';
import type {
  MicroStoreActions,
  ReactMicroStore,
  ReactMicroStoreSelector,
  ReuseMicroStoreResult,
} from './types';

/**
 * Reuses a tools `useMicroStore` function inside React rendering.
 *
 * `createMicroStore` from `@pastweb/tools` returns a framework-agnostic
 * `useMicroStore` function. `reuseMicroStore` receives that function, calls it
 * with the optional selector, and subscribes React to the selected state so the
 * component re-renders after store actions mutate reactive state.
 *
 * @typeParam S - Micro-store state shape.
 * @typeParam A - Micro-store action shape.
 * @typeParam T - Selected state value when a selector is provided.
 * @param store - `useMicroStore` function returned by `createMicroStore` from `@pastweb/tools`.
 * @param selector - Optional selector passed to the tools `useMicroStore`.
 * @returns Full or selected micro-store state plus the original actions.
 *
 * @example
 * ```tsx
 * import { createMicroStore } from '@pastweb/tools';
 * import { reuseMicroStore } from '@pastweb/react';
 *
 * const settingsStore = createMicroStore('settings', () => ({
 *   state: {
 *     user: {
 *       name: 'Ada',
 *       preferences: {
 *         theme: 'light',
 *       },
 *     },
 *   },
 *   actions: {
 *     rename(name: string) {
 *       this.state.user.name = name;
 *     },
 *     useDarkTheme() {
 *       this.state.user.preferences.theme = 'dark';
 *     },
 *   },
 * }));
 *
 * function SettingsPanel() {
 *   const settings = reuseMicroStore(settingsStore);
 *
 *   return (
 *     <button onClick={settings.useDarkTheme}>
 *       {settings.state.user.name}: {settings.state.user.preferences.theme}
 *     </button>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * function ThemeButton() {
 *   const theme = reuseMicroStore(
 *     settingsStore,
 *     state => state.user.preferences.theme,
 *   );
 *
 *   return <button onClick={theme.useDarkTheme}>{theme.state}</button>;
 * }
 * ```
 */
export function reuseMicroStore<
  S extends Record<string, any>,
  A extends MicroStoreActions,
  T = never,
>(
  store: ReactMicroStore<S, A>,
  selector?: ReactMicroStoreSelector<T, S>,
): ReuseMicroStoreResult<S, A, T> {
  const forceUpdate = useForceUpdate();
  const storeRef = useRef(store);
  const selectorRef = useRef<typeof selector>(selector);

  storeRef.current = store;
  selectorRef.current = selector;

  useEffect(() => {
    effect(
      forceUpdate,
      () => getStoreSnapshot(storeRef.current, selectorRef.current),
    );
  }, [forceUpdate]);

  return (selector ? store(selector) : store()) as ReuseMicroStoreResult<S, A, T>;
}
