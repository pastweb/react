import { useContext } from 'react';
import { ROUTE_DEPTH_CONTEXT_KEY, routeDive, type SelectedRoute } from '@pastweb/tools';
import { useBeforeMount } from '../../useBeforeMount';
import { useRef } from '../../useRef';
import { GlobalContext } from '../../GlobalContext';
import { ROUTE_DEPTH_REACT_CONTEXT } from '../constants';
import { useRoute } from '../useRoute';
import { useRouteDepth } from '../useRouteDepth';
import type { ViewComponent } from '../types';
import type { RouterViewProps } from './types';

/**
 * Renders the view component selected for the current route depth.
 *
 * Nested `RouterView` instances increment the route depth through
 * `GlobalContext`, allowing child routes to render their own views.
 *
 * @param props - View name, optional route transform, and props passed to the rendered view.
 * @returns The selected view or `null` when no matching view exists.
 *
 * @example
 * ```tsx
 * <RouterView name="main" />
 * ```
 */
export function RouterView({ name = 'default', beforeShow, ...rest }: RouterViewProps) {
  const route = useRoute();
  const routeDepth = useRouteDepth();
  const providerDepth = useContext(ROUTE_DEPTH_REACT_CONTEXT);
  const depth = useRef<number>(-1);

  useBeforeMount(() => {
    depth.value = routeDepth + 1;
  });

  if (depth.value > 10) return null;
  const selected = routeDive(route as SelectedRoute, depth.value) as SelectedRoute;
  const { views } = beforeShow ? beforeShow(selected) : selected;
  const View = (views as Record<string, ViewComponent>)[name] as ViewComponent;

  const content = (
    <ROUTE_DEPTH_REACT_CONTEXT.Provider value={depth.value}>
      {View ? <View {...rest} /> : null}
    </ROUTE_DEPTH_REACT_CONTEXT.Provider>
  );

  if (providerDepth !== undefined) return content;

  return (
    <GlobalContext update={{ [ROUTE_DEPTH_CONTEXT_KEY]: depth.value }}>
      {content}
    </GlobalContext>
  );
}
