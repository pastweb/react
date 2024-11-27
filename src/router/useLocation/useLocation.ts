import { useState, useEffect } from 'react';
import { Location } from '@pastweb/tools';
import { useRouter } from '../useRouter';

/**
 * Custom hook that provides the current location object from the router.
 *
 * @returns The current `Location` object, which contains information about the current route's path, query parameters, and more.
 *
 * @example
 * // Example usage:
 * const location = useLocation();
 * console.log(`Current path: ${location.pathname}`);
 *
 * @remarks
 * - The hook listens for route changes and updates the location object accordingly.
 * - The location object is deep-cloned on updates to ensure that changes trigger a re-render when the location changes.
 */
export const useLocation = (): Location => {
  const router = useRouter();
  const [location, setLocation] = useState(router.location);

  useEffect(() => {
    const listener = router.onRouteChange(() => {
      setLocation({ ...router.location });
    });

    return () => listener.removeListener();
  }, []);

  return location;
};
