import { useRouter } from '../useRouter';

/**
 * Returns the router navigation function.
 *
 * @returns A function that navigates to a path and resolves when the router is done.
 *
 * @example
 * ```tsx
 * const navigate = useNavigate();
 *
 * await navigate('/dashboard', { from: 'login' });
 * ```
 */
export const useNavigate = (): (path: string, state?: any) => Promise<void> => {
  const router = useRouter();
  return router.navigate;
};
