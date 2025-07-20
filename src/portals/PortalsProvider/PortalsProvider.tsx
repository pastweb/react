
import { anchorsSetup, DEFAULT_ID_CACHE, DEFAULT_PORTALS_CACHE } from '@pastweb/tools';
import { portalsContext, portalAnchorsContext } from '../constants';
import type { PortalsProviderProps } from './types';

/**
 * The `PortalsProvider` component sets up and provides the portals context and portal anchors context for the application.
 * It initializes portal management tools and caches based on the provided configuration and makes them available to its descendants.
 *
 * @param props - The props for the `PortalsProvider` component.
 * @param props.anchors - An object containing the anchor points for portals.
 * @param props.descriptor - (Optional) An object describing the configuration for portals.
 * @param props.getEntry - (Optional) A function to retrieve entries from the portals cache.
 * @param props.idChahe - (Optional) The cache for portal IDs, defaulting to `DEFAULT_ID_CACHE`.
 * @param props.portalsCache - (Optional) The cache for portals, defaulting to `DEFAULT_PORTALS_CACHE`.
 * @param props.children - The child elements that will have access to the portals and portal anchors contexts.
 *
 * @returns A React element that wraps its children with the `portalsContext` and `portalAnchorsContext` providers.
 *
 * @example
 * // Example usage:
 * <PortalsProvider
 *   anchors={{ main: 'main-anchor' }}
 *   descriptor={{ someConfig: true }}
 *   getEntry={myGetEntryFunction}
 * >
 *   <App />
 * </PortalsProvider>
 */
export function PortalsProvider(props: PortalsProviderProps) {
  const {
    anchors,
    descriptor = {},
    getEntry,
    idChahe = DEFAULT_ID_CACHE,
    portalsCache = DEFAULT_PORTALS_CACHE,
    children,
  } = props;
  
  const portals = anchorsSetup(anchors, descriptor, getEntry, idChahe, portalsCache);

  return (
    <portalsContext.Provider value={portals}>
      <portalAnchorsContext.Provider value={anchors}>
        { children }
      </portalAnchorsContext.Provider>
    </portalsContext.Provider>
  )
}
