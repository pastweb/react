import { useRef, useCallback, useEffect } from 'react';
import { Entry, isSSR } from '@pastweb/tools';
import { useBeforeMount } from '../useBeforeMount';
import { useBeforeUnmount } from '../useBeforeUnmount';
import { EntryAdapterProps } from './types';

export function EntryAdapter(props: EntryAdapterProps) {
  const { entry: _entry, isStatic, ...rest } = props;
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
      entry.current.memoSSR(async () => (entry as any).mount(isStatic));
    }
  });

  const ref = useCallback((node: HTMLElement | null) => {
    if (node) {
      entryElement.current = node.parentElement as HTMLElement;
      entry.current.setEntryElement(entryElement.current as HTMLElement);
      entry.current.emit('mount');
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
