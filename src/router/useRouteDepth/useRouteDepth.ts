import { useContext } from 'react';
import { ROUTE_DEPTH_CONTEXT_KEY } from '@pastweb/tools';
import { getContext } from '../../GlobalContext';
import { ROUTE_DEPTH_REACT_CONTEXT } from '../constants';

/**
 * Reads the current `RouterView` nesting depth.
 *
 * @returns Current route depth. The root provider starts at `-1`.
 *
 * @throws When route depth has not been installed.
 *
 * @example
 * ```tsx
 * const depth = useRouteDepth();
 * ```
 */
export function useRouteDepth(): number {
  const providerDepth = useContext(ROUTE_DEPTH_REACT_CONTEXT);
  const globalDepth = getContext<number>(ROUTE_DEPTH_CONTEXT_KEY);

  return providerDepth ?? globalDepth;
}
