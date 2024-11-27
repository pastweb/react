import { RouterOptions as Options, Route as _Route } from '@pastweb/tools';
import { Component } from '../createEntry';

export type ViewComponent = Component;

export type Route = Omit<_Route, 'view' | 'views' | 'children'> & {
  children?: Route[];
  view?: ViewComponent;
  views?: Record<string, ViewComponent>;
};

export interface RouterOptions extends Omit<Options, 'routes' | 'preloader' | 'RouterView' | 'beforeRouteParse'> {
  beforeRouteParse?: (route: Route) => Route;
  routes: Route[];
};
