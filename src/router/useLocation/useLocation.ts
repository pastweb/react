import { useEffect } from 'react';
import { effect } from '@pastweb/tools/reactivity';
import { useForceUpdate } from '../../useForceUpdate';
import { useRouter } from '../useRouter';
import type { Location } from '@pastweb/tools';

/**
 * Reads the current router location and re-renders when it changes.
 *
 * @returns The router `Location` object.
 *
 * @example
 * ```tsx
 * const location = useLocation();
 *
 * return <span>{location.pathname}</span>;
 * ```
 */
export const useLocation = (): Location => {
  const router = useRouter();
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    effect(forceUpdate, () => router.location.href);
  }, [forceUpdate, router]);

  return router.location;
};
