import { isEntry } from '@pastweb/tools/createEntry';
import { registerAsyncTask } from '@pastweb/tools/ssrUtils/asyncTasks';
import { getCurrentSSRTracker } from '@pastweb/tools/ssrUtils/ssrTracker';
import { preloadedSSREntries } from './constants';
import type { EntryAdapterProps, GenericEntry } from './types';

/**
 * Returns a preloaded server entry or registers its async loader for a later
 * SSR pass.
 *
 * On the first collection render, the loader is queued through
 * `registerAsyncTask` and the function returns `undefined`. After
 * `resolveAsyncTasks` runs, subsequent render passes receive the resolved
 * server entry from {@link preloadedSSREntries}.
 *
 * @param loader - Optional async server-entry loader.
 * @returns The resolved server entry when available.
 */
export function getServerEntry(loader?: EntryAdapterProps['ssrEntry']): GenericEntry | undefined {
  if (!loader) return undefined;

  const preloaded = preloadedSSREntries.get(loader);
  if (preloaded) return preloaded;

  registerAsyncTask(async () => {
    const entry = await loader();
    preloadedSSREntries.set(loader, entry);
  });

  return undefined;
}

/**
 * Renders the server side of {@link import('./EntryAdapter').EntryAdapter}.
 *
 * The function preserves the client/server bundle split by registering the
 * async server entry loader during the collection pass, then rendering the
 * loaded server entry on later SSR passes. The returned string is the SSR
 * placeholder id that will be replaced by `getComposedSSR`.
 *
 * When no async loader is provided, the regular `entry` is used on the server.
 * This supports frameworks that share one entry renderer across client and SSR.
 *
 * @param entry - Entry used as the server renderer when no `ssrEntry` loader is provided.
 * @param loader - Optional async server-entry loader.
 * @param props - Props merged into the active entry `initData`.
 * @returns SSR placeholder id, or `null` while waiting for the async server entry.
 */
export function renderServerEntryAdapter(
  entry: GenericEntry,
  loader: EntryAdapterProps['ssrEntry'],
  props: Record<string, any>,
): string | null {
  if (!isEntry(entry)) {
    throw Error('The entry must be generate via "createEntry" function.');
  }

  entry.mergeOptions({ initData: { ...props } });

  const serverEntry = getServerEntry(loader);
  if (loader && !serverEntry) return null;

  const activeEntry = serverEntry || entry;

  if (!isEntry(activeEntry)) {
    throw Error('The ssrEntry must be generate via "createEntry" function.');
  }

  activeEntry.mergeOptions({ initData: { ...props } });

  const tracker = getCurrentSSRTracker();
  const isStatic = tracker?.isStatic ?? false;
  const ssrId = activeEntry.ssrId as string;
  const mounted = activeEntry.mount({ isStatic });

  if (typeof mounted === 'string' && mounted !== ssrId) {
    activeEntry.memoSSR(async () => mounted);
  }

  return ssrId;
}
