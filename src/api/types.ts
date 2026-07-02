/**
 * Serialized query-cache snapshot shape re-exported for React API integrations.
 */
export type { QueryCacheSnapshot as ApiQuerySnapshot } from '@pastweb/tools/api/createQueryCache/types';

/**
 * Query key accepted by the React API documentation examples.
 *
 * Structured array keys are recommended because they match the tools cache
 * identity model; string keys are kept for compatibility with existing callers.
 */
export type QueryKey = unknown[] | string;
