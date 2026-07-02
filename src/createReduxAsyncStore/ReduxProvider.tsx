import { cloneElement, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { isAsyncStore } from './temp/createAsyncStore/isAsyncStore';
import type { Store } from '@reduxjs/toolkit';
import type { ReduxProviderProps, ReduxAsyncStore } from './types';

/**
 * The `ReduxProvider` component wraps its children with the Redux `Provider` component,
 * ensuring that the async Redux store is ready before rendering the children. It also provides
 * a fallback UI that is displayed while the store is initializing.
 *
 * @param props - The props for the `ReduxProvider` component.
 * @param props.store - The async Redux store object or regular Redux store to be provided to the Redux context.
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
  const { store, children, fallback = <></> } = props;
  const [ready, setReady] = useState<boolean>(!isAsyncStore(store));

  useEffect(() => {
    if (ready) return;
      
    (async () => {
      const result = await (store as ReduxAsyncStore).isReady;
      setReady(result);
    })();
  }, []);

  return (
    !ready ? cloneElement(fallback) : (
      <Provider store={isAsyncStore(store) ? (store as ReduxAsyncStore).store : store as Store}>
        {children}
      </Provider>
    )
  );
}
