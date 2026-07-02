import { useEffect } from 'react';
import { effect } from '@pastweb/tools/reactivity';
import { useForceUpdate } from '../../useForceUpdate';
import { useRouter } from '../useRouter';
import type { RouterLink, RouterLinkOptions } from '@pastweb/tools';

/**
 * Creates a router link descriptor and re-renders when the active route changes.
 *
 * @param props - Router link options.
 *
 * @returns Computed pathname, active flags, and a navigate function.
 *
 * @example
 * ```tsx
 * const link = useRouterLink({
 *   path: '/about',
 * });
 *
 * return <a href={link.pathname}>About</a>;
 * ```
 */
export const useRouterLink = (props: RouterLinkOptions): RouterLink => {
  const { path, params, searchParams, hash } = props;
  const router = useRouter();
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    effect(forceUpdate, () => router.currentRoute);
  }, [forceUpdate, router]);

  const options: RouterLinkOptions = { path };
  if (params) options.params = params;
  if (searchParams) options.searchParams = searchParams;
  if (hash) options.hash = hash;

  return router.getRouterLink(options);
};
