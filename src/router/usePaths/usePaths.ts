import { useState, useEffect } from 'react';
import { Route as _Route, filterRoutes, FilterDescriptor } from '@pastweb/tools';
import { useRouter } from '../useRouter';
import { Route } from '../types';

/**
 * Custom hook that filters and returns the list of routes based on the provided filter criteria.
 *
 * @param filter - (Optional) An object describing the criteria used to filter the routes. If no filter is provided, all routes are returned.
 *
 * @returns An array of `Route` objects that match the specified filter criteria.
 *
 * @example
 * // Example usage:
 * const adminPaths = usePaths({ role: 'admin' });
 * console.log(adminPaths); // Logs the routes accessible by an admin
 *
 * @remarks
 * - The hook listens for new routes being added and updates the filtered list accordingly.
 * - It uses the `filterRoutes` utility function to apply the filter to the list of routes.
 */
export const usePaths = (filter: FilterDescriptor = {}): Route[] => {
  const router = useRouter();
  const [paths, setPaths] = useState<Route[]>(filterRoutes(router.paths, filter));

  useEffect(() => {
    const listener = router.onRouteAdded((routes: _Route[]) => {
      setPaths(filterRoutes(routes, filter));
    });

    return () => listener.removeListener();
  }, []);

  return paths;
};
