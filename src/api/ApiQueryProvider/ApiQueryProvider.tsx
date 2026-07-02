import { API_QUERY_CONTEXT } from '../constants';
import type { ApiQueryProviderProps } from './types';

/**
 * Provides a `QueryCache` instance to React API hooks through React context.
 *
 * Use this when a subtree should receive a cache directly instead of reading it
 * from `GlobalContext` via `installApiCache`.
 *
 * @param props - Provider props.
 * @param props.queryCache - Cache created by `createQueryCache()`.
 * @param props.children - React subtree that can call `useApiQueryCache()`.
 *
 * @example
 * ```tsx
 * const queryCache = createQueryCache();
 *
 * <ApiQueryProvider queryCache={queryCache}>
 *   <App />
 * </ApiQueryProvider>
 * ```
 */
export function ApiQueryProvider(props: ApiQueryProviderProps) {
  const { queryCache, children } = props;

  return (
    <API_QUERY_CONTEXT.Provider value={queryCache}>
      {children}
    </API_QUERY_CONTEXT.Provider>
  );
}
