import { ViewRouter } from '@pastweb/tools';
import { useContext } from '../../util';
import { routerContext } from '../constants';

export const useRouter = (): ViewRouter => useContext<ViewRouter>(routerContext, 'routerContext');
