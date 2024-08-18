import { ReactElement } from 'react';
import { PortalTools } from '@pastweb/tools';
import { Portal } from '../types';

export interface PortalProps {
  path: string;
  tools: PortalTools;
  children: ReactElement;
};

export interface Portals { [name: string]: Portal | Portals };