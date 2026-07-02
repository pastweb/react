import { cloneElement, useEffect, useState, type ReactElement } from 'react';
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
  const { children, path, use } = props;

  if (!isPortalHandler(use)) {
    throw Error(
      'Portal error - the "use" property must be a PortalHandler Object.'
    );
  }

  const portals = usePortals() as Portals;
  const handler = useRef<PortalHandler | null>(null);
  const [entryId, setEntryId] = useState<string | false>(false);
  const component = useRef<ReactElement>(cloneElement(children));

  useEffect(() => {
    component.value = cloneElement(children);
  }, [children]);

  useEffect(() => {
    if (!use) return;

    use.open = () => {
      if (entryId) return entryId;

      const createHandler = select(portals, path);
      handler.value = createHandler(component.value);
      const h = handler.value as PortalHandler;

      h.onRemove(() => {
        use.id = false;
        setEntryId(false);
      });

      use.update = h.update;
      use.close = () => h.close();
      use.remove = () => h.remove();

      const id = h.open();
      use.id = id;
      setEntryId(id);

      return id;
    };

    use.isReady();
  }, [use]);

  return null;
}
