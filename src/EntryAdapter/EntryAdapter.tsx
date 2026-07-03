import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { isServer } from '@pastweb/tools/envs';
import { isEntry } from '@pastweb/tools/createEntry';
import { useBeforeMount } from '../useBeforeMount';
import { useBeforeUnmount } from '../useBeforeUnmount';
import { useIsland } from '../Island';
import { setRef } from '../setRef';
import { renderServerEntryAdapter } from './utils';
import type { EntryAdapterProps, GenericEntry } from './types';

/**
 * The `EntryAdapter` component serves as a bridge to integrate `Entry` objects with React components.
 * It handles mounting, updating, and unmounting of entry elements and supports server-side rendering (SSR) if applicable.
 *
 * @param props - The props for the `EntryAdapter` component.
 * @param props.entry - A function that returns an `Entry` object. This is used to interact with the entry system.
 * @param props.ssrEntry - Optional async server-only entry loader, resolved through the SSR async task queue.
 * @param rest - Any additional props to be passed to the entry's `mergeOptions` method.
 *
 * @returns A `div` element with a `ref` attached for mounting the entry, or an SSR ID if server-side rendering is enabled.
 *
 * @throws When `entry` or the resolved `ssrEntry` is not a valid Pastweb entry.
 *
 * @example
 * ```tsx
 * import { createEntry, EntryAdapter } from '@pastweb/react';
 *
 * const createClientEntry = () => createEntry({ EntryComponent: Widget });
 *
 * <EntryAdapter
 *   entry={createClientEntry}
 *   {...(import.meta.env.SSR
 *     ? {
 *         ssrEntry: () =>
 *           import('./widget.server-entry').then(module => module.createServerEntry()),
 *       }
 *     : {})}
 *   widgetId="main"
 * />
 * ```
 */
export const EntryAdapter = forwardRef<HTMLDivElement, EntryAdapterProps>(function EntryAdapter(props, forwardedRef) {
  const { entry: _entry, ssrEntry: _ssrEntry, ...rest } = props;
  const isIsland = useIsland();
  const entry = useRef<GenericEntry>(_entry());
  const entryElement = useRef<HTMLDivElement | null>(null);

  if (isServer) {
    return renderServerEntryAdapter(entry.current, _ssrEntry, rest);
  }

  useBeforeMount(() => {
    if (!isEntry(entry.current)) {
      throw Error('The entry must be generate via "createEntry" function.');
    }

    entry.current.mergeOptions({ initData: { ...rest } });
  });

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      entryElement.current = node;
      entry.current.setEntryElement(entryElement.current);
      entry.current.emit('mount', { hydrate: isIsland });
    }
    setRef(forwardedRef, node);
  }, [forwardedRef, isIsland]);

  useEffect(() => entry.current.emit('update', rest), [rest]);

  useBeforeUnmount(() => queueMicrotask(() => entry.current.emit('unmount')));

  return <div ref={ref} style={{ display: 'contents' }} />;
});
