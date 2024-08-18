import { useContext } from '../../util';
import { routeDepthContext } from '../constants';

export const useRouteDepth = (): number  => useContext<number>(routeDepthContext, 'routeDepthContext');
