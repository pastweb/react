import { createContext } from 'react';
import { ViewRouter } from '@pastweb/tools';
import { Route } from './types';

export const routeDepthContext = createContext<number | null>(-1);
export const routerContext = createContext<ViewRouter | null>(null);
export const routeContext = createContext<Route | null>(null);