import { useContext } from 'react';
import { reactive, setAsGlobalContext } from '@pastweb/tools';
import { useRef } from '../useRef';
import { useBeforeMount } from '../useBeforeMount';
import { GLOBAL_CONTEXT } from './constants';
import type { ContextProviderProps, GlobalContext } from './types';

/**
 * Provides a reactive Pastweb global context to a React subtree.
 *
 * `GlobalContext` starts from the nearest parent context, applies `update`
 * values, then runs optional installer functions from `use`. Descendants can
 * subscribe to individual values with {@link getContext}.
 *
 * Installer-returned keys are guarded against accidental collisions with values
 * already present in the local scope.
 *
 * @param props - Provider options.
 * @param props.children - React subtree that receives the context.
 * @param props.use - Installer or installers used to add shared values.
 * @param props.update - Values merged into the local context for this provider.
 *
 * @example
 * ```tsx
 * const installUser = () => ({ user: { name: 'Ada' } });
 *
 * <GlobalContext use={installUser}>
 *   <Profile />
 * </GlobalContext>
 * ```
 */
export function GlobalContext(props: ContextProviderProps) {
  const { update = {}, use, children } = props;
  const parent = useContext(GLOBAL_CONTEXT);
  const local = useRef<Record<string, any>>(reactive({ ...parent, ...update }));

  function updateLocal(obj: Record<string | symbol, any>, name?: string) {
    const entries = Object.entries(obj);

    if (!entries.length) return;

    for (const [key, value] of entries) {
      if (local.value[key] && name) {
        throw Error(`GlobalContext ERROR: the install function "${name}" returns an object with the key "${key}" which it is already present into the global context.`);
      }

      local.value[key] = value;
    }
  }

  useBeforeMount(() => {
    setAsGlobalContext(local.value);

    if (!use) return;

    const installers = Array.isArray(use) ? use : [use];

    installers.forEach(fn => {
      const keys = Object.keys(local.value);
      const obj = fn(keys);

      updateLocal(obj, fn.name);
    });
  });

  updateLocal(update);

  return (
    <GLOBAL_CONTEXT.Provider value={local.value}>
      {children}
    </GLOBAL_CONTEXT.Provider>
  )
}
