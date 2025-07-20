import type { ReactElement } from 'react';
import type { PortalHandler } from '@pastweb/tools';
import type { Portal } from '../types';

export interface PortalProps {
  path: string;
  use: PortalHandler;
  children: ReactElement;
};

export interface Portals { [name: string]: Portal | Portals };
