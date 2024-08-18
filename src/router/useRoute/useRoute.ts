import { useState, useEffect } from 'react';
import { SelectedRoute, routeDive } from '@pastweb/tools';
import { useRouter } from '../useRouter';
import { useRouteDepth } from '../useRouteDepth';
import { useContext } from '../../util';
import { routeContext } from '../constants';
import { Route } from '../types';

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
