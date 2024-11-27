import { PortalsDescriptor } from '@pastweb/tools';
import { useContext } from '../../util';
import { portalsContext } from '../constants';

/**
 * Custom hook that provides access to the portals context, allowing interaction with the application's portal system.
 *
 * @typeParam T - The expected type of the portals context. By default, the context is cast to `PortalsDescriptor`.
 *
 * @returns The current portals context cast to the specified type `T`.
 *
 * @throws Will throw an error if the `portalsContext` is not found, ensuring that the hook is used within a valid context provider.
 *
 * @example
 * // Example usage:
 * const portals = usePortals<MyPortalsType>();
 * portals.modal.open(<MyModalComponent />);
 */
export function usePortals<T>(): T {
  return useContext<PortalsDescriptor>(portalsContext, 'portalsContext') as T;
}
