import { useState, useEffect, type ReactNode } from 'react';
import { routerContext, routeContext, routeDepthContext } from '../constants';
import type { ViewRouter, SelectedRoute } from '@pastweb/tools';

/**
 * The `RouterProvider` component serves as a context provider for routing in the application.
 * It manages and provides the current route, route depth, and router instance to its descendants.
 *
 * @param props - The props for the `RouterProvider` component.
 * @param props.router - The `ViewRouter` instance that controls the application's routing.
 * @param props.base - (Optional) The base path for the router. If provided, it sets the base path for routing.
 * @param props.children - The child elements that will have access to the routing context.
 *
 * @returns A React element that wraps the application with routing context providers.
 *
 * @example
 * // Example usage:
 * <RouterProvider router={myRouter} base="/app">
 *   <App />
 * </RouterProvider>
 */
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