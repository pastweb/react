import type { ReactNode, ReactElement } from 'react';
import type { Portals, IdCache, PortalAnchorsIds } from '@pastweb/tools';
import type { ReactEntry } from '../../createEntry';
import type { EntryDescriptor } from '../types';

export interface PortalsProviderProps {
  getEntry: (props: Record<string, any>, component: ReactElement | null) => ReactEntry;
  anchors: PortalAnchorsIds;
  descriptor?: EntryDescriptor;
  idChahe?: IdCache;
  portalsCache?: Portals;
  children: ReactNode;
};
