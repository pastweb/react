import type { SelectedRoute } from '@pastweb/tools';

export interface RouterViewProps {
  /** Named view to render from `SelectedRoute.views`. Defaults to `default`. */
  name?: string;
  /** Optional transform that can replace the selected route before rendering. */
  beforeShow?: (route: SelectedRoute) => SelectedRoute;
  /** Extra props forwarded to the selected view component. */
  [propName: string]: any;
};
