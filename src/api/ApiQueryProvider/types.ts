import type { ReactNode } from 'react';
import type { QueryCache } from '@pastweb/tools';

/**
 * Props accepted by {@link ApiQueryProvider}.
 */
export interface ApiQueryProviderProps {
  /** Query cache shared by API agents and React API hooks. */
  queryCache: QueryCache;
  /** Subtree that receives the query cache through React context. */
  children: ReactNode;
}
