
import { anchorsSetup, defaultIdCache, defaultPortalsCache } from '@pastweb/tools';
import { portalsContext, portalAnchorsContext } from '../constants';
import { PortalsProviderProps } from './types';

export function PortalsProvider(props: PortalsProviderProps) {
  const {
    anchors,
    descriptor = {},
    getEntry,
    idChahe = defaultIdCache,
    portalsCache = defaultPortalsCache,
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
