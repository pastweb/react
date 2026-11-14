import { ROUTER_CONTEXT_KEY } from '@pastweb/tools';
import { getContext } from '../../GlobalContext';
import type { ViewRouter } from '@pastweb/tools';

/**
 * Reads the installed tools `ViewRouter`.
 *
 * @returns The router installed with {@link installRouter}.
 *
 * @throws When the router context has not been installed.
 *
 * @example
 * ```tsx
 * const router = useRouter();
 *
 * await router.navigate('/home');
 * ```
 */
export function useRouter(): ViewRouter {
  return getContext<ViewRouter>(ROUTER_CONTEXT_KEY);
}
