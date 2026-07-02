import { useQuery as createToolsQuery } from '@pastweb/tools/api/hooks/useQuery';
import { reuseQuery } from '../reuseQuery';
import type { QueryConfig, QueryInfo } from '@pastweb/tools/api/hooks/useQuery';

/**
 * React wrapper for `@pastweb/tools` `useQuery`.
 *
 * The underlying query state machine is created once and remains owned by the
 * tools package. React re-renders when the returned reactive query fields
 * change. If the query needs providers or a shared cache, configure those in
 * the agent used by `config.fn` or install the cache via `installApiCache` /
 * `ApiQueryProvider`.
 *
 * @example
 * ```tsx
 * const users = useQuery({
 *   fn: () => agent.get('/api/users', { queryKey: ['users'] }),
 * });
 *
 * if (users.isLoading) return <Spinner />;
 * return <UserList users={users.data ?? []} />;
 * ```
 */
export function useQuery<T>(config: QueryConfig<T>): QueryInfo<T> {
  return reuseQuery(() => createToolsQuery(config));
}
