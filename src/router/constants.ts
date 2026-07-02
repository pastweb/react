import { createContext } from 'react';
import type { ViewRouter } from '@pastweb/tools';

export const ROUTER_REACT_CONTEXT = createContext<ViewRouter | undefined>(undefined);
export const ROUTE_DEPTH_REACT_CONTEXT = createContext<number | undefined>(undefined);
