import { ReactNode, ReactElement } from 'react';
import { Portals, IdCache, PortalAnchorsIds } from '@pastweb/tools';
import { ReactEntry } from '../../createReactEntry';
import { EntryDescriptor } from '../types';

export interface PortalsProviderProps {
  getEntry: (props: Record<string, any>, component: ReactElement | null) => ReactEntry;
  anchors: PortalAnchorsIds;
  descriptor?: EntryDescriptor;
  idChahe?: IdCache;
  portalsCache?: Portals;
  children: ReactNode;
};
