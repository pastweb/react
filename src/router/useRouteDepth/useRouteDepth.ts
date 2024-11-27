import { useContext } from '../../util';
import { routeDepthContext } from '../constants';

/**
 * Custom hook that retrieves the current route depth from the `routeDepthContext`.
 *
 * @returns The current route depth as a number from the `routeDepthContext`.
 *
 * @throws Will throw an error if the `routeDepthContext` is not found, ensuring that the hook is used within a valid context provider.
 *
 * @example
 * // Example usage:
 * const depth = useRouteDepth();
 * console.log(`Current route depth is: ${depth}`);
 */
export const useRouteDepth = (): number  => useContext<number>(routeDepthContext, 'routeDepthContext');
