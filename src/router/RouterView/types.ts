import { SelectedRoute } from '@pastweb/tools';

export interface RouterViewProps {
  name?: string;
  beforeShow?: (route: SelectedRoute) => SelectedRoute;
  [propName: string]: any;
};
