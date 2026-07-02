import { QUERY_CACHE_CONTEXT_KEY } from '@pastweb/tools/api/createQueryCache/constnts';
import type { Installer } from '../../GlobalContext';
import type { ApiCacheOptions } from './types';

/**
 * Creates a GlobalContext installer for API query cache support.
 *
 * @param options - API integration options.
 * @param options.queryCache - Query cache shared by API hooks and SSR hydration.
 *
 * @returns Installer that provides the query cache under the tools query cache context key.
 *
 * @example
 * import { createQueryCache } from '@pastweb/tools';
 * import { GlobalContext, installApiCache } from '@pastweb/react';
 *
 * const queryCache = createQueryCache();
 * const apiCache = installApiCache({ queryCache });
 *
 * <GlobalContext use={apiCache}>
 *   <App />
 * </GlobalContext>
 */
export function installApiCache(options: ApiCacheOptions): Installer {
  const { queryCache } = options;

  return () => ({
    [QUERY_CACHE_CONTEXT_KEY]: queryCache,
  });
}
