import { useContext } from 'react';
import { ISLAND_CONTEXT } from './constants';

/**
 * Returns whether the current component is rendered inside an {@link Island}.
 *
 * Entry adapters use this signal to hydrate nested entries only when they are
 * mounted as part of an island hydration boundary.
 *
 * @returns `true` inside an `Island`, otherwise `false`.
 *
 * @example
 * ```tsx
 * function DebugIslandState() {
 *   const isIsland = useIsland();
 *
 *   return <span>{isIsland ? 'island' : 'page'}</span>;
 * }
 * ```
 */
export function useIsland(): boolean {
  return useContext(ISLAND_CONTEXT);
}
