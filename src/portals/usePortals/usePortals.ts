import { useContext } from 'react';
import { PORTALS_CONTEXT_KEY } from '@pastweb/tools';
import { getContext } from '../../GlobalContext';
import { PORTALS_REACT_CONTEXT } from '../constants';

/**
 * Reads the portal descriptor installed by {@link installPortals}.
 *
 * @typeParam T - Expected portal descriptor shape.
 *
 * @returns The current portals context cast to `T`.
 *
 * @example
 * ```tsx
 * type AppPortals = {
 *   modal: PortalFunction;
 * };
 *
 * const portals = usePortals<AppPortals>();
 * const entryId = portals.modal(<Dialog />).open();
 * ```
 */
export function usePortals<T>(): T {
  const providerPortals = useContext(PORTALS_REACT_CONTEXT);
  const globalPortals = getContext<T>(PORTALS_CONTEXT_KEY);

  return (providerPortals ?? globalPortals) as T;
}
