import { useContext } from '../../util';
import { portalAnchorsContext } from '../constants';
import type { PortalAnchorsIds } from '@pastweb/tools';

/**
 * Custom hook that provides access to the portal anchors context, which manages the IDs of portal anchors within the application.
 *
 * @typeParam T - The expected type of the portal anchors context. By default, the context is cast to `PortalAnchorsIds`.
 *
 * @returns The current portal anchors context cast to the specified type `T`.
 *
 * @throws Will throw an error if the `portalAnchorsContext` is not found, ensuring that the hook is used within a valid context provider.
 *
 * @example
 * // Example usage:
 * const portalAnchors = usePortalAnchors<MyAnchorType>();
 * console.log(portalAnchors.mainAnchorId);
 *
 * @remarks
 * - The `usePortalAnchors` hook allows components to access and interact with the IDs of portal anchors, which are used for managing the location where portals are rendered in the DOM.
 * - The context is cast to the specified type `T`, providing type safety for the returned context object.
 */
export function usePortalAnchors<T>(): T {
  return useContext<PortalAnchorsIds>(portalAnchorsContext, 'portalAnchorsContext') as T;
}
