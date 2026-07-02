import {
  anchorsSetup,
  currentIdCache,
  currentPortalsCache,
  PORTALS_CONTEXT_KEY,
  PORTAL_ANCHORS_CONTEXT_KEY,
} from '@pastweb/tools';
import type { Installer } from '../../GlobalContext';
import type { PortalsOptions } from './types';

/**
 * Creates a {@link GlobalContext} installer for the React portal helpers.
 *
 * The installer exposes the portal descriptor and the anchor ids created by
 * `@pastweb/tools`. Components can then read them with {@link usePortals},
 * {@link usePortalAnchors}, and {@link Portal}.
 *
 * @param options - Portal anchors, entry factory, and optional caches.
 * @returns An installer accepted by `GlobalContext` through its `use` prop.
 *
 * @example
 * ```tsx
 * const installPortalContext = installPortals({
 *   anchorsIds: { modal: 'modal-root' },
 *   getEntry: (props, component) => createEntry({ entry: () => component }),
 * });
 *
 * <GlobalContext use={installPortalContext}>
 *   <App />
 * </GlobalContext>
 * ```
 */
export function installPortals(options: PortalsOptions): Installer {
  const {
    anchorsIds,
    getEntry,
    idChahe = currentIdCache,
    portalsCache = currentPortalsCache,
  } = options;

  const portals = anchorsSetup(getEntry, anchorsIds, idChahe, portalsCache);

  return () => ({
    [PORTALS_CONTEXT_KEY]: portals,
    [PORTAL_ANCHORS_CONTEXT_KEY]: anchorsIds,
  });
}
