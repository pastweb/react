import { useEffect, useRef } from 'react';
import { effect } from '@pastweb/tools/reactivity';
import { useForceUpdate } from '../../useForceUpdate';
import { getStoreSnapshot } from './utils';
import type {
  MicroStoreActions,
  ReactMicroStore,
  ReactMicroStoreSelector,
  ReuseMicroStoreHook,
  ReuseMicroStoreResult,
} from './types';

/**
 * Bridges a tools `useMicroStore` into React and returns a React hook for it.
 *
 * Define the bridge next to the tools store, export the hook, and call it inside
 * components (optionally with a selector) so React re-renders when selected
 * state changes.
 *
 * @typeParam S - Micro-store state shape.
 * @typeParam A - Micro-store action shape.
 * @param store - `useMicroStore` from `createMicroStore` in `@pastweb/tools`.
 * @returns A React hook: `useStore()` or `useStore(selector)`.
 *
 * @example
 * ```ts
 * // @/stores/settingsStore.ts
 * import { createMicroStore } from '@pastweb/tools';
 * import { reuseMicroStore } from '@pastweb/react';
 *
 * const settingsStore = createMicroStore('settings', () => ({
 *   state: {
 *     user: {
 *       name: 'Ada',
 *       preferences: { theme: 'light' },
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
 * export const useSettingsStore = reuseMicroStore(settingsStore);
 * ```
 *
 * @example
 * ```tsx
 * // SettingsPanel.tsx
 * import { useSettingsStore } from '@/stores/settingsStore';
 *
 * export function SettingsPanel() {
 *   const settings = useSettingsStore();
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
 * // ThemeButton.tsx
 * import { useSettingsStore } from '@/stores/settingsStore';
 *
 * export function ThemeButton() {
 *   const theme = useSettingsStore(state => state.user.preferences.theme);
 *
 *   return <button onClick={theme.useDarkTheme}>{theme.state}</button>;
 * }
 * ```
 */
export function reuseMicroStore<
  S extends Record<string, any>,
  A extends MicroStoreActions,
>(store: ReactMicroStore<S, A>): ReuseMicroStoreHook<S, A> {
  function useStore(): ReuseMicroStoreResult<S, A>;
  function useStore<T>(
    selector: ReactMicroStoreSelector<T, S>,
  ): ReuseMicroStoreResult<S, A, T>;
  function useStore<T>(
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

  return useStore as ReuseMicroStoreHook<S, A>;
}
