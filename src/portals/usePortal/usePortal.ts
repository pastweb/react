import { useRef } from 'react';
import { useBeforeMount } from '../../useBeforeMount';
import type { PortalHandler } from '@pastweb/tools';

/**
 * Custom hook that provides access to portal tools, which are used for managing and interacting with portals in the application.
 *
 * @returns The `PortalHandler` object, which includes methods and properties related to portal management.
 *
 * @remarks
 * - The hook initializes the `PortalHandler` object before the component mounts using the `useBeforeMount` hook.
 * - The `PortalHandler` object is set up with an `id` property and a non-enumerable `$$portalHandler` property to identify the object as portal tools.
 * - The object returned by the hook is cast to `PortalHandler`, providing type safety for portal-related operations.
 *
 * @example
 * // Example usage:
 * const portalHandler = usePortal();
 * if (portalHandler.id) {
 *   // Interact with portal handler
 * }
 */
export function usePortal(): PortalHandler {
  const portal = useRef({});

  useBeforeMount(() => {
    const handler = {
      id: false,
    };
  
    Object.defineProperty(handler, '$$portalHandler', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false,
    });

    portal.current = handler;
  });

  return portal.current as unknown as PortalHandler;
}
