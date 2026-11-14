import { GlobalContext } from '../../GlobalContext';
import { installPortals } from '../installPortals';
import type { PortalsProviderProps } from './types';

/**
 * Provides portal helpers through `GlobalContext`.
 *
 * This is the component form of `installPortals`, following the same pattern
 * as `WindowManagerProvider`.
 *
 * @param props - Portal options plus children.
 * @returns Provider-wrapped React subtree.
 *
 * @example
 * ```tsx
 * <PortalsProvider anchorsIds={anchorsIds} getEntry={getEntry}>
 *   <App />
 * </PortalsProvider>
 * ```
 */
export function PortalsProvider(props: PortalsProviderProps) {
  const { anchorsIds, children, getEntry, idChahe, portalsCache } = props;
  const options = {
    anchorsIds,
    getEntry,
    ...(idChahe ? { idChahe } : {}),
    ...(portalsCache ? { portalsCache } : {}),
  };

  return (
    <GlobalContext use={installPortals(options)}>
      {children}
    </GlobalContext>
  );
}
