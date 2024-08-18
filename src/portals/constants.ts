import { createContext } from 'react';
import { PortalAnchorsIds } from '@pastweb/tools';
import { PortalsDescriptor } from './types';

export const portalsContext = createContext<PortalsDescriptor | null>(null);
export const portalAnchorsContext = createContext<PortalAnchorsIds | null>(null);
