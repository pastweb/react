import { useRef, useCallback, useEffect } from 'react';
import { type Entry, isSSR } from '@pastweb/tools';
import { useBeforeMount } from '../useBeforeMount';
import { useBeforeUnmount } from '../useBeforeUnmount';
import type { EntryAdapterProps } from './types';

/**
 * The `EntryAdapter` component serves as a bridge to integrate `Entry` objects with React components.
 * It handles mounting, updating, and unmounting of entry elements and supports server-side rendering (SSR) if applicable.
 *
 * @param props - The props for the `EntryAdapter` component.
 * @param props.entry - A function that returns an `Entry` object. This is used to interact with the entry system.
 * @param props.hydrate - A function to hydrate the entry element, typically used for server-side rendered content.
 * @param props.isStatic - A boolean indicating if the entry should be treated as static.
 * @param rest - Any additional props to be passed to the entry's `mergeOptions` method.
 *
 * @returns A `div` element with a `ref` attached for mounting the entry, or an SSR ID if server-side rendering is enabled.
 *
 * @throws Will throw an error if the `entry` does not have the `$$entry` property, indicating that it was not created using the `createEntry` function.
 *
 * @example
 * // Example usage:
 * const myEntry = () => createEntry({ ...entry options });
 * <EntryAdapter entry={myEntry} hydrate={myHydrateFunction} isStatic={false} someOption="value" />
 */
export function EntryAdapter(props: EntryAdapterProps) {
  const { entry: _entry, hydrate, isStatic, ...rest } = props;
  const entry = useRef<Entry<any>>(_entry());
  const entryElement = useRef<HTMLElement | null>(null);
  const ssrId = useRef<string>('');

  useBeforeMount(() => {
    if (!entry.current.$$entry) {
      throw Error('The entry must be generate via "createEntry" function.');
    }

    entry.current.mergeOptions({ initData: { ...rest } });

    if(isSSR) {
      ssrId.current = entry.current.ssrId as string;
      entry.current.memoSSR(async () => (entry as any).mount({ isStatic }));
    }
  });

  const ref = useCallback((node: HTMLElement | null) => {
    if (node) {
      entryElement.current = node.parentElement as HTMLElement;
      entry.current.setEntryElement(entryElement.current as HTMLElement);
      entry.current.emit('mount', { hydrate });
    }
  }, []);

  useEffect(() => {
    entry.current.emit('update', rest);
  }, [rest]);

  useBeforeUnmount(() => {
    entry.current.emit('unmount');
  });

  return ssrId.current || <div ref={ref} style={{ display:'contents' }} />;
}
