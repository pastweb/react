import type { ViewRouter } from '@pastweb/tools';

/**
 * Options used by {@link installRouter}.
 */
export interface RouterOptions {
  /** Router instance created with `createViewRouter` from `@pastweb/tools`. */
  router: ViewRouter;
  /** Optional base path applied before the router is installed. */
  base?: string;
};
