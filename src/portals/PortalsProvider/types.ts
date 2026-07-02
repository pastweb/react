import type { ReactNode } from 'react';
import type { PortalsOptions } from '../installPortals';

/**
 * Props accepted by {@link PortalsProvider}.
 */
export interface PortalsProviderProps extends PortalsOptions {
  /** React subtree that receives portal helpers through React context. */
  children: ReactNode;
}
