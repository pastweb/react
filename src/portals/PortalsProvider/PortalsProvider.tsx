import { useRef } from 'react';
import { anchorsSetup, currentIdCache, currentPortalsCache } from '@pastweb/tools';
import { PORTALS_REACT_CONTEXT, PORTAL_ANCHORS_REACT_CONTEXT } from '../constants';
import type { PortalsDescriptor } from '../types';
import type { PortalsProviderProps } from './types';

/**
 * Provides portal helpers through dedicated React context.
 *
 * Use this component when a subtree needs portals but you do not want to
 * install them through `GlobalContext`. Hooks still support the installer path,
 * and provider values take precedence when both are present.
 *
 * @param props - Portal options plus children.
 * @returns Provider-wrapped React subtree.
 *
 * @example
 * ```tsx
 * <PortalsProvider anchorsIds={anchorsIds} getEntry={getEntry}>
 *   <App />
 * </PortalsProvider>
 * ```
 */
export function PortalsProvider(props: PortalsProviderProps) {
  const {
    anchorsIds,
    children,
    getEntry,
    idChahe = currentIdCache,
    portalsCache = currentPortalsCache,
  } = props;
  const portals = useRef<PortalsDescriptor | null>(null);

  if (!portals.current) {
    portals.current = anchorsSetup(getEntry, anchorsIds, idChahe, portalsCache);
  }

  return (
    <PORTALS_REACT_CONTEXT.Provider value={portals.current}>
      <PORTAL_ANCHORS_REACT_CONTEXT.Provider value={anchorsIds}>
        {children}
      </PORTAL_ANCHORS_REACT_CONTEXT.Provider>
    </PORTALS_REACT_CONTEXT.Provider>
  );
}
