import { getContext } from '../GlobalContext';
import { ISLAND_CONTEXT_KEY } from './constants';

/**
 * Returns whether the current component is rendered inside an {@link Island}.
 *
 * Entry adapters use this signal to hydrate nested entries only when they are
 * mounted as part of an island hydration boundary.
 * The local React Island provider is used first; when it is absent, the hook
 * reads `ISLAND_CONTEXT_KEY` from `GlobalContext`, matching the portal helpers.
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
  return !!getContext<boolean>(ISLAND_CONTEXT_KEY);
}
