import { useState, useEffect } from 'react';
import { useRouter } from '../useRouter';

/**
 * Custom hook that generates a link object for routing, including path information, active state,
 * and a navigation function.
 *
 * @param props - An object containing the following properties:
 * - `path`: The target path for the link.
 * - `params`: (Optional) An object containing route parameters.
 * - `searchParams`: (Optional) URLSearchParams representing query parameters for the link.
 * - `hash`: (Optional) A string representing the fragment identifier for the link.
 *
 * @returns An object containing:
 * - `pathname`: The computed pathname for the link.
 * - `isActive`: A boolean indicating if the current route matches the link's path.
 * - `isExactActive`: A boolean indicating if the current route exactly matches the link's path.
 * - `navigate`: A function to navigate to the specified `path` or a different route if `to` is provided.
 *
 * @example
 * // Example usage:
 * const link = useRouterLink({
 *   path: '/about',
 *   params: { id: 123 },
 *   searchParams: new URLSearchParams('query=test'),
 *   hash: 'section',
 * });
 *
 * // In your JSX:
 * // <a href={link.pathname} onClick={link.navigate}>Go to About</a>
 */
export const useRouterLink = (props: {
  path: string;
  params?: Record<string, string | number | boolean | null | undefined>;
  searchParams?: URLSearchParams;
  hash?: string;
}): {
  pathname: string;
  isActive: boolean;
  isExactActive: boolean;
  navigate: (to?: string) => void;
} => {
  const { path, params, searchParams, hash } = props;
  const router = useRouter();

  const [link, setLink] = useState(router.getRouterLink({
    path,
    params,
    searchParams,
    hash,
  }));

  useEffect(() => {
    const listener = router.onRouteChange(() => {
      setLink(router.getRouterLink({
        path,
        params,
        searchParams,
        hash,
      }));
    });

    return () => listener.removeListener();
  }, []);

  return link;
};
