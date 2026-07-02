import { useEffect } from 'react';
import { filterRoutes, type FilterDescriptor } from '@pastweb/tools';
import { effect } from '@pastweb/tools/reactivity';
import { useForceUpdate } from '../../useForceUpdate';
import { useRouter } from '../useRouter';
import type { Route } from '../types';

/**
 * Returns router paths filtered with the tools `filterRoutes` helper.
 *
 * @param filter - Optional filter descriptor. Omit it to return all paths.
 *
 * @returns Routes that match the filter.
 *
 * @example
 * ```tsx
 * const adminPaths = usePaths({ role: 'admin' });
 * ```
 */
export const usePaths = (filter: FilterDescriptor = {}): Route[] => {
  const router = useRouter();
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    effect(forceUpdate, () => router.paths);
  }, [forceUpdate, router]);

  return filterRoutes(router.paths, filter) as Route[];
};
