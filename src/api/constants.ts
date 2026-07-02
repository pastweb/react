import { createContext } from 'react';
import type { QueryCache } from '@pastweb/tools';

/**
 * React context used by {@link ApiQueryProvider} and {@link useApiQueryCache}
 * to expose a tools `QueryCache` to React components.
 */
export const API_QUERY_CONTEXT = createContext<QueryCache | undefined>(undefined);
