import { ReactElement } from 'react';
import { PortalHandler } from '@pastweb/tools';
import { Portal } from '../types';

export interface PortalProps {
  path: string;
  use: PortalHandler;
  children: ReactElement;
};

export interface Portals { [name: string]: Portal | Portals };
