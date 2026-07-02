import { useEffect } from 'react';
import { routeDive, type SelectedRoute } from '@pastweb/tools';
import { effect } from '@pastweb/tools/reactivity';
import { useForceUpdate } from '../../useForceUpdate';
import { useRouter } from '../useRouter';
import { useRouteDepth } from '../useRouteDepth';

/**
 * Reads the current route at the active `RouterView` depth.
 *
 * @returns The selected route for the current depth.
 *
 * @example
 * ```tsx
 * const currentRoute = useRoute();
 *
 * return <h1>{currentRoute.path}</h1>;
 * ```
 */
export const useRoute = (): SelectedRoute => {
  const router = useRouter();
  const depth = useRouteDepth();
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    effect(forceUpdate, () => routeDive(router.currentRoute, depth));
  }, [depth, forceUpdate, router]);

  return routeDive(router.currentRoute, depth);
};
