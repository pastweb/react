import type { QueryCache } from '@pastweb/tools';

/**
 * Options for {@link installApiCache}.
 */
export interface ApiCacheOptions {
  /** Query cache shared by API agents, React hooks, and hydration-aware app setup. */
  queryCache: QueryCache;
}
