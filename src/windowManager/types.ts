import type { ReactNode } from 'react';
import type { WindowManager } from '@pastweb/tools';

/**
 * Options used to install an application window manager into `GlobalContext`.
 */
export interface WindowManagerOptions {
  /** Application-owned manager shared by every managed window. */
  manager: WindowManager;
}

/**
 * Props accepted by {@link WindowManagerProvider}.
 */
export interface WindowManagerProviderProps extends WindowManagerOptions {
  /** React subtree that can access the application window manager. */
  children: ReactNode;
}
