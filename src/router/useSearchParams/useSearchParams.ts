import { useLocation } from '../useLocation';
import { useRouter } from '../useRouter';

/**
 * Reads and updates the current route search parameters.
 *
 * @returns The current `URLSearchParams` and the router setter.
 *
 * @example
 * ```tsx
 * const { params, setSearchParams } = useSearchParams();
 *
 * const next = new URLSearchParams(params);
 * next.set('page', '2');
 * setSearchParams(next);
 * ```
 */
export function useSearchParams(): {
  params: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
} {
  const router = useRouter();
  const location = useLocation();

  return {
    params: location.searchParams,
    setSearchParams: router.setSearchParams,
  };
}
