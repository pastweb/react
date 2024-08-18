import { Store, Reducer, combineReducers } from 'redux';
import { UnknownAction, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createAsyncStore, noop } from '@pastweb/tools';
import { ReduxStore, ReduxStoreOptions } from './types';

export function createReduxStore(options: ReduxStoreOptions): ReduxStore {
  const asyncStore = createAsyncStore<ReduxStore>({ ...options, storeName: 'ReduxStore' });

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

  return asyncStore as Omit <ReduxStore, 'useSelector'> & {
    useSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>>;
  };
}
