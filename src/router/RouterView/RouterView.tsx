import { routeDive, SelectedRoute } from '@pastweb/tools';
import { useRoute } from '../useRoute';
import { useRouteDepth } from '../useRouteDepth';
import { routeDepthContext } from '../constants';
import { ViewComponent } from '../types';
import { RouterViewProps } from './types';

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
