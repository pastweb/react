import { ReactElement, ReactNode } from 'react';
import {
  ConfigureStoreOptions,
  UnknownAction,
  Store,
  Dispatch,
  Tuple,
} from '@reduxjs/toolkit';
import { Reducer } from 'redux';
import { AsyncStore, AsyncStoreOptions } from '@pastweb/tools';
import { TypedUseSelectorHook } from 'react-redux';
import { Middlewares } from '@reduxjs/toolkit/dist/configureStore';

export interface ReduxStoreOptions {
  onInit?: (store: Store) => Promise<void> | void;
  settings: ConfigureStoreOptions<any, UnknownAction, Tuple<Middlewares<any>>, Tuple<any>>;
};

export type ReduxStore = AsyncStore<AsyncStoreOptions & ReduxStoreOptions> & {
  store: Store & {
    asyncReducers: {
      [reducerName: string]: Reducer;
    };
  }
  init: () => Promise<void>;
  addReducer: (reducerKey: string, reducer: Reducer) => void;
  removeReducer: (reducerKey: string) => void;
  useDispatch: () => Dispatch<UnknownAction>;
  useSelector: TypedUseSelectorHook<ReturnType<any>>;
};

export interface ReduxProviderProps {
  reduxStore: ReduxStore;
  fallback?: ReactElement;
  children: ReactNode;
};
