import { useEffect, useState } from 'react';
import { effect } from '@pastweb/tools';
import { useGlobalContext } from './useGlobalContext';

/**
 * Reads one key from the active {@link GlobalContext} and re-renders when that
 * key changes.
 *
 * The value is backed by the reactive context object from `@pastweb/tools`.
 *
 * @typeParam T - Expected value type.
 * @param key - Context key to read.
 * @returns The current value for `key`.
 *
 * @example
 * ```tsx
 * function UserName() {
 *   const user = getContext<{ name: string }>('user');
 *   return <span>{user.name}</span>;
 * }
 * ```
 */
export function getContext<T = any>(key: string): T {
  const globalContext = useGlobalContext();

  const [value, setValue] = useState<T>(globalContext[key]);

  useEffect(() => {
    effect(
      () => { setValue(globalContext[key]); },
      () => globalContext[key],
    );
  }, []);

  return value as T;
}
