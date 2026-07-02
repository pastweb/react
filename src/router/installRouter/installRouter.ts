import { ROUTER_CONTEXT_KEY, ROUTE_DEPTH_CONTEXT_KEY } from '@pastweb/tools';
import type { Installer } from '../../GlobalContext';
import type { RouterOptions } from './types';

/**
 * Creates a {@link GlobalContext} installer for a tools `ViewRouter`.
 *
 * The installer exposes the router under the tools router context key and
 * initializes route depth to `-1`, so the first `RouterView` renders depth `0`.
 *
 * @param options - Router instance and optional base path.
 * @returns An installer accepted by `GlobalContext` through its `use` prop.
 *
 * @example
 * ```tsx
 * const installRouterContext = installRouter({ router });
 *
 * <GlobalContext use={installRouterContext}>
 *   <RouterView />
 * </GlobalContext>
 * ```
 */
export function installRouter(options: RouterOptions): Installer {
  const { router, base } = options;

  if (base) router.setBase(base);

  return () => ({
    [ROUTER_CONTEXT_KEY]: router,
    [ROUTE_DEPTH_CONTEXT_KEY]: -1,
  });
}
