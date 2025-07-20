import { useState, useEffect } from 'react';
import { type SelectedRoute, routeDive } from '@pastweb/tools';
import { useRouter } from '../useRouter';
import { useRouteDepth } from '../useRouteDepth';
import { useContext } from '../../util';
import { routeContext } from '../constants';
import type { Route } from '../types';

/**
 * Custom hook that provides the currently active route at the specified depth in the route hierarchy.
 *
 * @returns The current `SelectedRoute` at the specified depth.
 *
 * @example
 * // Example usage:
 * const currentRoute = useRoute();
 * console.log(`Current route path: ${currentRoute.path}`);
 *
 * @remarks
 * - This hook listens for route changes and updates the selected route accordingly.
 * - The depth is determined using the `useRouteDepth` hook, which indicates the depth of the route within the routing hierarchy.
 *
 * @throws Will throw an error if the `routeContext` is not found, ensuring that the hook is used within a valid context provider.
 */
export const useRoute = (): SelectedRoute => {
  const router = useRouter();
  const route = useContext<Route>(routeContext, 'routeContext') as SelectedRoute;
  const depth = useRouteDepth();
  const [currentRoute, setCurrentRoute] = useState<SelectedRoute>(routeDive(route, depth));

  useEffect(() => {
    const listener = router.onRouteChange((newRoute: SelectedRoute) => {
      setCurrentRoute(routeDive(newRoute, depth));
    });

    return () => listener.removeListener();
  }, []);

  return currentRoute;
};
