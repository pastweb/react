import { GlobalContext } from '../GlobalContext';
import { installWindowManager } from './installWindowManager';
import type { WindowManagerProviderProps } from './types';

/**
 * Provides one application-owned window manager to a React subtree.
 *
 * This component does not create a manager. Create one with
 * `createWindowManager()` at the application boundary and pass it through the
 * required `manager` prop.
 *
 * @param props - Manager and React children.
 * @returns Provider-wrapped React subtree.
 *
 * @example
 * ```tsx
 * const manager = createWindowManager();
 *
 * <WindowManagerProvider manager={manager}>
 *   <App />
 * </WindowManagerProvider>
 * ```
 */
export function WindowManagerProvider(props: WindowManagerProviderProps) {
  const { manager, children } = props;

  return (
    <GlobalContext use={installWindowManager({ manager })}>
      {children}
    </GlobalContext>
  );
}
