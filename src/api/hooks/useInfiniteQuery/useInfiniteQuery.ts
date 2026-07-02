import { useInfiniteQuery as createToolsInfiniteQuery } from '@pastweb/tools/api/hooks/useInfiniteQuery';
import { reuseQuery } from '../reuseQuery';
import type {
  InfiniteQueryConfig,
  InfiniteQueryInfo,
} from '@pastweb/tools/api/hooks/useInfiniteQuery';

/**
 * React wrapper for `@pastweb/tools` `useInfiniteQuery`.
 *
 * The core infinite query manages page ordering and retry behavior. React
 * re-renders when page data or lifecycle flags change.
 *
 * @example
 * ```tsx
 * const posts = useInfiniteQuery({
 *   initialPageParam: 1,
 *   fn: page => agent.get(`/api/posts?page=${page}`),
 * });
 *
 * <button disabled={!posts.hasNextPage} onClick={posts.fetchNextPage}>
 *   More
 * </button>
 * ```
 */
export function useInfiniteQuery<TPage, TPageParam = unknown>(
  config: InfiniteQueryConfig<TPage, TPageParam>,
): InfiniteQueryInfo<TPage, TPageParam> {
  return reuseQuery(() => createToolsInfiniteQuery(config));
}
