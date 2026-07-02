import type { ReactElement, ReactNode } from 'react';
import type {
  ConfigureStoreOptions,
  UnknownAction,
  Store,
  Dispatch,
  Tuple,
} from '@reduxjs/toolkit';
import type { Reducer } from 'redux';
// import type { AsyncStore, AsyncStoreOptions } from '@pastweb/tools';
import type { AsyncStore, AsyncStoreOptions } from './temp/createAsyncStore';
import type { TypedUseSelectorHook } from 'react-redux';
import type { Middleware } from 'redux';

type Middlewares<S> = ReadonlyArray<Middleware<{}, S>>;

export type ReduxStoreOptions  = Omit<AsyncStoreOptions, 'name'> & {
  name?: string;
  onInit?: (store: Store) => Promise<void> | void;
  settings: ConfigureStoreOptions<any, UnknownAction, Tuple<Middlewares<any>>, Tuple<any>>;
};

export type ReduxAsyncStore = AsyncStore<ReduxStoreOptions & { name: string }> & {
  store: Store & {
    asyncReducers: {
      [reducerName: string]: Reducer;
    };
  }
  addReducer: (reducerKey: string, reducer: Reducer) => void;
  removeReducer: (reducerKey: string) => void;
  useDispatch: () => Dispatch<UnknownAction>;
  useSelector: TypedUseSelectorHook<ReturnType<any>>;
};

export interface ReduxProviderProps {
  store: Store | ReduxAsyncStore;
  fallback?: ReactElement;
  children: ReactNode;
};
