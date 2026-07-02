import { useContext } from 'react';
import { GLOBAL_CONTEXT } from './constants';
import type { GlobalContext } from './types';

/**
 * Internal hook that returns the full reactive global context object.
 *
 * Public components should use `getContext` or `setContext` instead. This hook
 * is kept for package internals that need direct access to the provider object.
 *
 * @returns The active Pastweb global context.
 * @internal
 */
export function useGlobalContext(): GlobalContext {
  return useContext(GLOBAL_CONTEXT);
}
