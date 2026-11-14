import { GlobalContext } from '../../GlobalContext';
import { installRouter } from '../installRouter';
import type { RouterProviderProps } from './types';

/**
 * Provides a tools `ViewRouter` through `GlobalContext`.
 *
 * This is the component form of `installRouter`, following the same pattern
 * as `PortalsProvider` and `WindowManagerProvider`.
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

  return (
    <GlobalContext use={installRouter({ router, ...(base ? { base } : {}) })}>
      {children}
    </GlobalContext>
  );
}
