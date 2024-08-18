import { useState, useEffect } from 'react';
import { Route as _Route, filterRoutes, FilterDescriptor } from '@pastweb/tools';
import { useRouter } from '../useRouter';
import { Route } from '../types';

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
