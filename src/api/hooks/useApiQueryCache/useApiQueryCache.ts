import { useContext } from 'react';
import { QUERY_CACHE_CONTEXT_KEY } from '@pastweb/tools/api/createQueryCache/constnts';
import { useGlobalContext } from '../../../GlobalContext/useGlobalContext';
import { API_QUERY_CONTEXT } from '../../constants';
import type { QueryCache } from '@pastweb/tools';

/**
 * Returns the active `QueryCache` for React API integrations.
 *
 * Resolution order:
 * 1. The nearest {@link ApiQueryProvider}
 * 2. The React `GlobalContext` entry installed by {@link installApiCache}
 *
 * Throws when neither provider path is available, because React API hooks need
 * an explicit cache installation point.
 *
 * @returns The active tools `QueryCache`.
 *
 * @example
 * ```tsx
 * function DebugCache() {
 *   const queryCache = useApiQueryCache();
 *   return <pre>{queryCache.getAll().length}</pre>;
 * }
 * ```
 */
export function useApiQueryCache(): QueryCache {
  const queryCache = useContext(API_QUERY_CONTEXT);
  const globalContext = useGlobalContext();
  const activeQueryCache = queryCache || globalContext[QUERY_CACHE_CONTEXT_KEY];

  if (!activeQueryCache) {
    throw new Error(
      'useApiQueryCache error: queryCache must be installed in the GlobalContext via installApiCache or ApiQueryProvider should be used.'
    );
  }

  return activeQueryCache;
}
