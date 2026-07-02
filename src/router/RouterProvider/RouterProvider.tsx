import { useBeforeMount } from '../../useBeforeMount';
import { ROUTER_REACT_CONTEXT, ROUTE_DEPTH_REACT_CONTEXT } from '../constants';
import type { RouterProviderProps } from './types';

/**
 * Provides a tools `ViewRouter` through dedicated React context.
 *
 * Use this component when a subtree needs router hooks/components but you do
 * not want to install the router through `GlobalContext`.
 *
 * @param props - Router options plus children.
 * @returns Provider-wrapped React subtree.
 *
 * @example
 * ```tsx
 * <RouterProvider router={router}>
 *   <RouterView />
 * </RouterProvider>
 * ```
 */
export function RouterProvider(props: RouterProviderProps) {
  const { router, base, children } = props;

  useBeforeMount(() => {
    if (base) router.setBase(base);
  });

  return (
    <ROUTER_REACT_CONTEXT.Provider value={router}>
      <ROUTE_DEPTH_REACT_CONTEXT.Provider value={-1}>
        {children}
      </ROUTE_DEPTH_REACT_CONTEXT.Provider>
    </ROUTER_REACT_CONTEXT.Provider>
  );
}
