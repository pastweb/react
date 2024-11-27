import { ViewRouter } from '@pastweb/tools';
import { useContext } from '../../util';
import { routerContext } from '../constants';

/**
 * Custom hook that retrieves the `ViewRouter` instance from the router context.
 *
 * @returns The `ViewRouter` instance from the `routerContext`.
 *
 * @throws Will throw an error if the `routerContext` is not found, ensuring that the hook is used within a valid context provider.
 *
 * @example
 * // Example usage:
 * const router = useRouter();
 * router.navigate('/home'); // Navigate to the '/home' route
 */
export const useRouter = (): ViewRouter => useContext<ViewRouter>(routerContext, 'routerContext');
