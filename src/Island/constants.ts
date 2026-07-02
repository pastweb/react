import { createContext } from 'react';
import type { IslandProps } from './types';

export const DEFAULT_PROPS: Partial<IslandProps> = {
  client: 'visible',
  idleTimeout: 5000,
};

/**
 * Context used by nested components to know whether they are rendered inside an
 * island hydration boundary.
 */
export const ISLAND_CONTEXT = createContext(false);
