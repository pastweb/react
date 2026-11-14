import { setAsQueries, useQueries as createToolsQueries } from '@pastweb/tools';
import { reuseQuery } from '../reuseQuery';
import type { QueryConfig } from '@pastweb/tools/api/hooks/useQuery';
import type { UseQueriesInfo, UseQueriesInput } from '@pastweb/tools/api/hooks/useQueries';

/**
 * React wrapper for `@pastweb/tools` `useQueries`.
 *
 * Creates the core aggregate query once and re-renders React whenever the
 * aggregate state changes.
 *
 * @example
 * ```tsx
 * const dashboard = useQueries({
 *   queries: [
 *     { fn: () => agent.get('/api/users', { queryKey: ['users'] }) },
 *     { fn: () => agent.get('/api/posts', { queryKey: ['posts'] }) },
 *   ],
 * });
 * ```
 */
export function useQueries<T extends readonly QueryConfig<any>[]>(
  config: UseQueriesInput<T>,
): UseQueriesInfo<T> {
  const queries = reuseQuery(() => createToolsQueries(config));
  setAsQueries(queries);
  return queries;
}
