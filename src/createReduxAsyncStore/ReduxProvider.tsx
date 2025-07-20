import { cloneElement, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import type { ReduxProviderProps } from './types';

/**
 * The `ReduxProvider` component wraps its children with the Redux `Provider` component,
 * ensuring that the async Redux store is ready before rendering the children. It also provides
 * a fallback UI that is displayed while the store is initializing.
 *
 * @param props - The props for the `ReduxProvider` component.
 * @param props.reduxStore - The Redux store object to be provided to the Redux context.
 * @param props.children - The React elements to be rendered inside the Redux `Provider` once the store is ready.
 * @param props.fallback - Optional fallback UI to be displayed while the Redux store is initializing. Defaults to an empty fragment.
 *
 * @returns A `Provider` component wrapping the children, or the fallback UI if the store is not ready.
 *
 * @example
 * // Example usage:
 * <ReduxProvider reduxStore={myReduxStore} fallback={<LoadingSpinner />}>
 *   <MyApp />
 * </ReduxProvider>
 */
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
