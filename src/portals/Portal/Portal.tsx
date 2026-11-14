import { cloneElement, useEffect, type ReactElement } from 'react';
import { isPortalHandler, select, type PortalHandler } from '@pastweb/tools';
import { useRef } from '../../useRef';
// import { useMounted } from '../../useMounted';
import { usePortals } from '../usePortals';
import type { PortalProps, Portals } from './types';

/**
 * Wires a {@link usePortal} handler to a portal path from the installed portal
 * descriptor.
 *
 * The component itself renders `null`; the child element is mounted by the
 * entry returned from the portal `getEntry` function when `use.open()` is
 * called.
 *
 * @param props - Portal target path, handler, and child element.
 * @returns `null`.
 *
 * @throws When `use` is not a valid tools portal handler.
 *
 * @example
 * ```tsx
 * const modal = usePortal();
 *
 * <Portal path="modal" use={modal}>
 *   <Dialog />
 * </Portal>
 * ```
 */
export function Portal(props: PortalProps) {
  const { children, path, use, manager } = props;

  if (!isPortalHandler(use)) {
    throw Error(
      'Portal error - the "use" property must be a PortalHandler Object.'
    );
  }

  const portals = usePortals() as Portals;
  const handler = useRef<PortalHandler | null>(null);
  const entryId = useRef<string | false>(false);
  const component = useRef<ReactElement>(manager ? cloneElement<any>(children, { manager }) : children);

  useEffect(() => {
    component.value = manager ? cloneElement<any>(children, { manager }) : children;
  }, [children, manager]);

  useEffect(() => {
    if (!use) return;

    use.open = () => {
      if (entryId.value) return entryId.value;

      const createHandler = select(portals, path);
      handler.value = createHandler(component.value);
      const h = handler.value as PortalHandler;

      let openedId: string | false = false;

      h.onRemove(() => {
        if (openedId && manager) manager.unregister(openedId);
        use.id = false;
        entryId.value = false;
      });

      use.update = h.update;
      use.close = () => h.close();
      use.remove = () => h.remove();

      const id = h.open();
      openedId = id;
      use.id = id;
      entryId.value = id;

      if (id && manager) {
        manager.register({
          id,
          requestClose: () => h.close(),
        });
      }

      return id;
    };

    use.isReady();
  }, [manager, path, portals, use]);

  return null;
}
