import { createContext } from 'react';
import type { PortalAnchorsIds } from '@pastweb/tools';
import type { PortalsDescriptor } from './types';

export const PORTALS_REACT_CONTEXT = createContext<PortalsDescriptor | undefined>(undefined);
export const PORTAL_ANCHORS_REACT_CONTEXT = createContext<PortalAnchorsIds | undefined>(undefined);
