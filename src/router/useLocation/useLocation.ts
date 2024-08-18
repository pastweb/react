import { useState, useEffect } from 'react';
import { Location } from '@pastweb/tools';
import { useRouter } from '../useRouter';

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
