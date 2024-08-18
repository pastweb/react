import { cloneElement, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { ReduxProviderProps } from './types';

export function ReduxProvider(props: ReduxProviderProps) {
  const { reduxStore, children, fallback = <></> } = props;
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const result = await reduxStore.isReady;
      setReady(result);
    })();
  }, []);

  return (
    !ready ? cloneElement(fallback) : (
      <Provider store={reduxStore.store}>
        {children}
      </Provider>
    )
  );
}
