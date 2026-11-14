import { WINDOW_MANAGER_CONTEXT_KEY } from '@pastweb/tools';
import type { Installer } from '../GlobalContext';
import type { WindowManagerOptions } from './types';

/**
 * Creates a `GlobalContext` installer for an application window manager.
 *
 * Create the manager once at the application boundary, then install that same
 * instance for all managed portals and taskbar components.
 *
 * @param options - Application-owned manager to expose.
 * @returns An installer accepted by `GlobalContext` through its `use` prop.
 *
 * @example
 * ```tsx
 * const manager = createWindowManager();
 *
 * <GlobalContext use={installWindowManager({ manager })}>
 *   <App />
 * </GlobalContext>
 * ```
 */
export function installWindowManager(options: WindowManagerOptions): Installer {
  return () => ({ [WINDOW_MANAGER_CONTEXT_KEY]: options.manager });
}
