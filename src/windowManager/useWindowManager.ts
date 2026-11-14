import { WINDOW_MANAGER_CONTEXT_KEY } from '@pastweb/tools';
import { getContext } from '../GlobalContext';
import type { WindowManager } from '@pastweb/tools';

/**
 * Reads the application window manager from `GlobalContext`.
 *
 * The returned object is the original manager instance. This hook does not
 * subscribe to manager state or force React renders.
 *
 * @returns The application-owned window manager, or `undefined` when no
 * manager is installed.
 *
 * @example
 * ```tsx
 * function Taskbar() {
 *   const manager = useWindowManager();
 *
 *   if (!manager) return null;
 *
 *   return manager.state.windows.map(window => (
 *     <button key={window.id} onClick={() => manager.manageWindow(window)}>
 *       {window.meta.label}
 *     </button>
 *   ));
 * }
 * ```
 */
export function useWindowManager(): WindowManager | undefined {
  return getContext<WindowManager | undefined>(WINDOW_MANAGER_CONTEXT_KEY);
}
