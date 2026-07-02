import type { EntryAdapterProps, GenericEntry } from './types';

/**
 * Server-only preload cache for async `ssrEntry` loaders.
 *
 * The key is the loader function passed to {@link EntryAdapterProps.ssrEntry}.
 * The value is the resolved server entry used by later SSR passes after
 * `resolveAsyncTasks` has executed the registered loader task.
 */
export const preloadedSSREntries = new WeakMap<NonNullable<EntryAdapterProps['ssrEntry']>, GenericEntry>();
