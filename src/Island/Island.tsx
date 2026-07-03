'use client';

import { useEffect, useRef } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { GlobalContext } from '../GlobalContext';
import { withDefaultProps } from '../withDefaultProps';
import { DEFAULT_PROPS, ISLAND_CONTEXT_KEY } from './constants';
import type { IslandProps, IslandDefaultProps } from './types';

export function Island(props: IslandProps) {
  const p = withDefaultProps<IslandDefaultProps>(props, DEFAULT_PROPS);
  const { client, media, fallback, children, idleTimeout, islandId } = p;
  const ref = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Root | null>(null);

  useEffect(() => {
    if (client === 'none') return;

    const element = ref.current;
    if (!element) return;

    let mounted = false;

    const hydrate = () => {
      if (mounted) return;
      mounted = true;

      rootRef.current = hydrateRoot(
        element,
        <GlobalContext update={{ [ISLAND_CONTEXT_KEY]: true }}>
          {children}
        </GlobalContext>,
        {
          onRecoverableError: err =>
            console.warn('[Island] recoverable error during hydration', err),
        },
      );
    };

    if (client === 'load') {
      hydrate();
      return;
    }

    if (client === 'idle') {
      if ('requestIdleCallback' in window) {
        const handle = window.requestIdleCallback(hydrate, { timeout: idleTimeout });
        return () => window.cancelIdleCallback(handle);
      }
      const timeout = setTimeout(hydrate, 200);
      return () => clearTimeout(timeout);
    }

    if (client === 'visible') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            hydrate();
            observer.disconnect();
          }
        },
        { rootMargin: '200px' }
      );

      observer.observe(element);
      return () => observer.disconnect();
    }

    if (client === 'media' && media) {
      const mql = window.matchMedia(media);
      if (mql.matches) {
        hydrate();
      } else {
        const onChange = () => {
          if (mql.matches) {
            hydrate();
            mql.removeEventListener('change', onChange);
          }
        };
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
      }
    }

    return undefined;
  }, [client, media, children, idleTimeout]);

  return (
    <div
      ref={ref}
      data-island
      data-client={client}
      data-media={media || undefined}
      data-island-id={islandId}
      suppressHydrationWarning
      style={{ display: 'contents' }}
    >
      <GlobalContext update={{ [ISLAND_CONTEXT_KEY]: true }}>
        {client === 'none' ? children : fallback || children}
      </GlobalContext>
    </div>
  );
}

export default Island;
