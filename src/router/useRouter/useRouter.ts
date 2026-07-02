import { useContext } from 'react';
import { ROUTER_CONTEXT_KEY } from '@pastweb/tools';
import { getContext } from '../../GlobalContext';
import { ROUTER_REACT_CONTEXT } from '../constants';
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
  const providerRouter = useContext(ROUTER_REACT_CONTEXT);
  const globalRouter = getContext<ViewRouter>(ROUTER_CONTEXT_KEY);

  return providerRouter ?? globalRouter;
}
