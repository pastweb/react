import { setAsPortalHandler } from '@pastweb/tools';
import { useBeforeMount } from '../../useBeforeMount';
import { useRef } from '../../useRef';
import type { PortalHandler } from '@pastweb/tools';

/**
 * Creates the client-side handler consumed by {@link Portal}.
 *
 * The handler can be used immediately. Calls made before the matching
 * `Portal` finishes wiring itself are replayed when it becomes ready.
 *
 * @returns A tools `PortalHandler` extended with the internal readiness hook.
 *
 * @example
 * ```tsx
 * const modal = usePortal();
 *
 * return (
 *   <>
 *     <button onClick={() => modal.open()}>Open</button>
 *     <Portal path="modal" use={modal}>
 *       <Dialog />
 *     </Portal>
 *   </>
 * );
 * ```
 */
export function usePortal(): PortalHandler & { isReady: () => void } {
  const portal = useRef({});
  const called = useRef<Record<string, any>>({});

  useBeforeMount(() => {
    const handler = setAsPortalHandler({
      id: false,
      open: () => { called.value['open'] = true; },
      update: (props: Record<string, any>) => { called.value['update'] = props; },
      close: () => { called.value['close'] = true; },
      remove: () => { called.value['remove'] = true; },
      isReady: () => {
        const p = portal.value as PortalHandler;

        Object.entries({ ...called.value }).forEach(([key, val]) => {
          const fn = (p as unknown as Record<string, ((value: unknown) => void) | undefined>)[key];

          if (fn) {
            setTimeout(() => fn(val), 16);
          }

          delete called.value[key];
        });
      },
    });

    portal.value = handler;
  });

  return portal.value as PortalHandler & { isReady: () => void };
}
