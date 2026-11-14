import type { ReactElement } from 'react';
import type { PortalHandler, WindowManager } from '@pastweb/tools';
import type { Portal } from '../types';

export interface PortalProps {
  /** Element rendered by the portal entry when the handler opens. */
  children: ReactElement;
  /** Dot-separated path used to select the portal function from the descriptor. */
  path: string;
  /** Handler returned by `usePortal`. */
  use: PortalHandler & { isReady: () => void };
  /** Optional application window manager used to register this portal entry. */
  manager?: WindowManager;
};

export interface Portals { [name: string]: Portal | Portals };
