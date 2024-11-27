import { useRouter } from '../useRouter';

/**
 * Custom hook that provides a function to navigate to a specified path within the application.
 *
 * @returns A function that accepts a `path` and an optional `state` object, allowing navigation to the specified path.
 *
 * @example
 * // Example usage:
 * const navigate = useNavigate();
 * navigate('/dashboard', { from: 'login' });
 *
 * @remarks
 * - The returned `navigate` function is tied to the router context and can be used to programmatically change routes.
 * - The `state` parameter allows passing additional state information during navigation.
 */
export const useNavigate = (): (path: string, state?: any) => void => {
  const router = useRouter();
  return router.navigate;
};
