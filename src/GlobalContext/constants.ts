import { globalContext } from '@pastweb/tools';
import { createContext } from 'react';
import type { GlobalContext } from './types';

/**
 * React context used internally by {@link GlobalContext}.
 *
 * It is initialized with the framework-agnostic `globalContext` from
 * `@pastweb/tools`, so hooks can still resolve a root context even when no local
 * provider is mounted.
 */
export const GLOBAL_CONTEXT = createContext<GlobalContext>(globalContext);
