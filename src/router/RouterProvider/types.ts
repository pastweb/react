import type { ReactNode } from 'react';
import type { RouterOptions } from '../installRouter';

/**
 * Props accepted by {@link RouterProvider}.
 */
export interface RouterProviderProps extends RouterOptions {
  /** React subtree that receives router helpers through React context. */
  children: ReactNode;
}
