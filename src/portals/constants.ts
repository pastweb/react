import { createContext } from 'react';
import type { PortalAnchorsIds } from '@pastweb/tools';
import type { PortalsDescriptor } from './types';

export const portalsContext = createContext<PortalsDescriptor | null>(null);
export const portalAnchorsContext = createContext<PortalAnchorsIds | null>(null);
