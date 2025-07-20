import { Store, Reducer, combineReducers } from 'redux';
import { UnknownAction, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createAsyncStore, noop } from '@pastweb/tools';
import type { ReduxAsyncStore, ReduxStoreOptions } from './types';

/**
 * Creates and configures an async Redux store with support for async reducers and custom initialization.
 *
 * @param options - Configuration options for the Redux store.
 * @param options.settings - The settings object used to configure the Redux store. Passed directly to `configureStore`.
 * @param options.onInit - A function to be called when the store is initialized.
 *
 * @returns A customized `ReduxStore` object that includes:
 * - `store`: The underlying Redux store with async reducers support.
 * - `asyncReducers`: An object to store async reducers.
 * - `useDispatch`: A typed hook for dispatching actions.
 * - `useSelector`: A typed hook for selecting state from the store.
 * - `init`: A method to initialize the store and execute the `onInit` function.
 * - `addReducer`: A method to dynamically add a new reducer to the store.
 * - `removeReducer`: A method to dynamically remove an existing reducer from the store.
 *
 * @example
 * // Example usage:
 * const store = createReduxAsyncStore({
 *   settings: {
 *     reducer: { ...initial reducers },
 *   },
 *   onInit: async (store) => {
 *     // Custom initialization logic
 *   },
 * });
 * 
 * store.addReducer('newReducer', myReducer);
 * store.removeReducer('oldReducer');
 */
export function createReduxAsyncStore(options: ReduxStoreOptions): ReduxAsyncStore {
  const asyncStore = createAsyncStore<ReduxAsyncStore>({ ...options, storeName: 'ReduxAsyncStore' });

  const store: Store & {
    asyncReducers: {
      [reducerName: string]: Reducer;
    };
  } = {
    ...configureStore(options.settings),
    asyncReducers: {},
  };

  asyncStore.store = store;

  type AppDispatch = typeof store.dispatch;
  // Use throughout your app instead of plain `useDispatch` and `useSelector`
  asyncStore.useDispatch = () => useDispatch<AppDispatch>();
  asyncStore.useSelector = useSelector;
  asyncStore.init = init;
  asyncStore.addReducer = addReducer;
  asyncStore.removeReducer = removeReducer;

  async function init(): Promise<void> {
    const { onInit = noop } = asyncStore.options;
    await onInit(store);
    asyncStore.setStoreReady();
  }

  function getRootReducer(asyncReducers = {}): Reducer<Record<string, any>, never> {
    return combineReducers({
      ...asyncStore.options.settings.reducer,
      ...asyncReducers,
    });
  }

  function addReducer(reducerKey: string, reducer: Reducer): void {
    if(store.asyncReducers[reducerKey]) return;
  
    store.asyncReducers[reducerKey] = reducer;
    store.replaceReducer(getRootReducer(store.asyncReducers) as Reducer<any, UnknownAction, any>);
  }

  function removeReducer(reducerKey: string): void {
    if(store.asyncReducers[reducerKey]) {
      const filtered = Object.entries(store.asyncReducers)
        .reduce((acc, [reducerName, reducer]) => ({
          ...reducerKey !== reducerName ? { [reducerName]: reducer } : acc,
        }), {});

      store.replaceReducer(getRootReducer(filtered) as Reducer<any, UnknownAction, any>);
    }
  }

  return asyncStore as Omit <ReduxAsyncStore, 'useSelector'> & {
    useSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>>;
  };
}
