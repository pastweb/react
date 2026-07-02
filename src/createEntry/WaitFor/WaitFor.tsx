import {
  useEffect,
  useMemo,
  useState,
  Fragment,
  isValidElement,
  cloneElement,
  createElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { normalizeAsyncQueue } from '@pastweb/tools/createAsyncStore/normalizeAsyncQueue';
import { isServer } from '@pastweb/tools/envs';

import type { Component } from '../types';
import type { WaitForProps } from './types';

/**
 * Waits for one or more async operations before rendering children.
 *
 * Supports:
 * - Promises
 * - Async functions
 * - AsyncStore instances
 * - Arrays of async tasks
 *
 * On the client:
 * - renders a fallback while waiting
 * - resolves all async tasks in parallel
 *
 * On the server:
 * - awaits all tasks before rendering synchronously
 *
 * @param props - WaitFor configuration.
 *
 * @returns The fallback while loading, otherwise the rendered children.
 */
export function WaitFor(props: WaitForProps) {
  return isServer ? serverSide(props) : clientSide(props);
}

/**
 * Client-side implementation.
 */
function clientSide(props: WaitForProps): ReactElement | null {
  const { wait, fallback: Fallback = Fragment, children } = props;
  const [isLoading, setLoading] = useState(true);

  /**
   * Memoize normalized queue to avoid recomputation
   * on every render.
   */
  const queue = useMemo(() => normalizeAsyncQueue(wait), [wait]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (queue.length) await Promise.all(queue);

        if (mounted) setLoading(false);
      } catch (error) {
        console.error(error);

        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [queue]);

  if (isLoading) return createFallback(Fallback);

  return renderChildren(children);
}

/**
 * Server-side implementation.
 */
async function serverSide(props: WaitForProps): Promise<ReactElement | null> {
  const { wait, children } = props;

  try {
    const queue = normalizeAsyncQueue(wait);

    if (queue.length) {
      await Promise.all(queue);
    }

    return renderChildren(children);
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Safely renders fallback components.
 */
function createFallback(Fallback: ReactNode | Component): ReactElement | null {
  return isValidElement(Fallback) ? cloneElement(Fallback as ReactElement) : createElement(Fallback as Component);
}

/**
 * Safely renders children.
 */
function renderChildren(children: ReactNode): ReactElement | null {
  return isValidElement(children) ? cloneElement(children as ReactElement) : null;
}
