import { useRouter } from '../useRouter';

export const useNavigate = (): (path: string, state?: any) => void => {
  const router = useRouter();
  return router.navigate;
};
