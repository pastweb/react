import { useState, useEffect, ReactNode } from 'react';
import { ViewRouter, SelectedRoute } from '@pastweb/tools';
import { routerContext, routeContext, routeDepthContext } from '../constants';

export function RouterProvider(props: { router: ViewRouter, base?: string; children: ReactNode;}) {
  const { router, base } = props;
  const [currentRoute, setCurrentRoute] = useState<SelectedRoute>(router.currentRoute);

  useEffect(() => {
    if (base || base === '') router.setBase(base);
  }, [ base ]);

  useEffect(() => {
    const listener = router.onRouteChange((newRoute: SelectedRoute) => {
      setCurrentRoute({ ...newRoute });
    });

    return () => listener.removeListener();
  }, []);

  return (
    <routerContext.Provider value={router}>
      <routeContext.Provider value={currentRoute}>
        <routeDepthContext.Provider value={-1}>
          { props.children }
        </routeDepthContext.Provider>
      </routeContext.Provider>
    </routerContext.Provider>
  );
};