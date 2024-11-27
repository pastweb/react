import { routeDive, SelectedRoute } from '@pastweb/tools';
import { useRoute } from '../useRoute';
import { useRouteDepth } from '../useRouteDepth';
import { routeDepthContext } from '../constants';
import { ViewComponent } from '../types';
import { RouterViewProps } from './types';

/**
 * The `RouterView` component is responsible for rendering a view component based on the current route
 * and route depth. It allows for nested routes by managing route depth context.
 *
 * @param props - The props for the `RouterView` component.
 * @param props.name - The name of the view to render from the available views in the selected route. Defaults to `'default'`.
 * @param props.beforeShow - (Optional) A function that runs before the view is shown. It receives the selected route and can modify it.
 * @param rest - Additional props that are passed to the rendered view component.
 *
 * @returns A React element that renders the appropriate view component for the current route and route depth. If no view is found, it renders `null`.
 *
 * @example
 * // Example usage:
 * <RouterView name="main" />
 */
export function RouterView({ name = 'default', beforeShow, ...rest }: RouterViewProps) {
  const route = useRoute();
  const depth = useRouteDepth() + 1;

  const selected = routeDive(route as SelectedRoute, depth) as SelectedRoute;
  const { views } = beforeShow ? beforeShow(selected) : selected;

  const View = (views as Record<string, ViewComponent>)[name] as ViewComponent;

  return (
    <routeDepthContext.Provider value={depth}>
      {View ? <View { ...rest } /> : null}
    </routeDepthContext.Provider>
  );
}
