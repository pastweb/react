import { useState, Fragment, cloneElement, ReactElement } from 'react';
import { normalizeAsyncQueue } from '@pastweb/tools';
import { useMounted } from '../../useMounted';
import { WaitForProps } from './types';

export function WaitFor(props: WaitForProps) {
  const { wait, fallback: Fallback = Fragment, children } = props;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const queue = normalizeAsyncQueue(wait);

  useMounted(() => {
    (async () => {
      try {
        if (queue.length) {
          await Promise.all(queue);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (e) {
        throw e;
      }
    })();
  });

  return (
    isLoading ? <Fallback /> : cloneElement(children as ReactElement)
  );
}
