import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSlice } from '@reduxjs/toolkit';
import { isAsyncStore, normalizeAsyncQueue } from '@pastweb/tools';
import { createReduxAsyncStore } from '../../src/createReduxAsyncStore';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
  },
});

const userSlice = createSlice({
  name: 'user',
  initialState: { name: '', email: '' },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});

const { increment } = counterSlice.actions;
const { setName, setEmail } = userSlice.actions;

describe('createReduxAsyncStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('given store settings, when createReduxAsyncStore is called, then it creates a redux store with getState', () => {
    const store = createReduxAsyncStore({
      settings: {
        reducer: { counter: counterSlice.reducer },
      },
    });

    expect(store.store).toBeDefined();
    expect(typeof store.store.getState).toBe('function');
    expect(store.store.getState()).toEqual({ counter: { count: 0 } });
    expect(store.store.asyncReducers).toEqual({});
  });

  it('given a created redux async store, when isAsyncStore is called, then tools recognizes it as an async store', () => {
    const store = createReduxAsyncStore({
      settings: {
        reducer: { counter: counterSlice.reducer },
      },
    });

    expect(isAsyncStore(store)).toBe(true);
  });

  it('given a redux async store, when normalizeAsyncQueue receives it, then it calls init and resolves isReady', async () => {
    const onInit = vi.fn();
    const store = createReduxAsyncStore({
      settings: { reducer: { counter: counterSlice.reducer } },
      onInit,
    });

    const [ready] = normalizeAsyncQueue(store);
    expect(await ready).toBe(true);
    expect(onInit).toHaveBeenCalledTimes(1);
    expect(onInit).toHaveBeenCalledWith(store.store);
    expect(store.isStoreReady).toBe(true);
  });

  it('given an onInit callback, when init is called, then onInit runs and isReady resolves', async () => {
    const onInitMock = vi.fn();
    const store = createReduxAsyncStore({
      settings: { reducer: { counter: counterSlice.reducer } },
      onInit: onInitMock,
    });

    store.init();
    const isReady = await store.isReady;

    expect(onInitMock).toHaveBeenCalledTimes(1);
    expect(onInitMock).toHaveBeenCalledWith(store.store);
    expect(isReady).toBe(true);
  });

  it('given an existing store, when addReducer is called, then the reducer is added to state', () => {
    const store = createReduxAsyncStore({
      settings: {
        reducer: { counter: counterSlice.reducer },
      },
    });

    store.addReducer('user', userSlice.reducer);

    expect(store.store.asyncReducers).toHaveProperty('user');
    expect(store.store.getState()).toHaveProperty('user');
    expect(store.store.getState().user).toEqual({ name: '', email: '' });
  });

  it('given a reducer already added, when addReducer is called again, then the reducer is not added twice', () => {
    const store = createReduxAsyncStore({
      settings: { reducer: { counter: counterSlice.reducer } },
    });

    store.addReducer('user', userSlice.reducer);
    store.addReducer('user', userSlice.reducer);

    expect(Object.keys(store.store.asyncReducers)).toHaveLength(1);
  });

  it('given an async reducer, when removeReducer is called, then the reducer is removed from the store', () => {
    const store = createReduxAsyncStore({
      settings: { reducer: { counter: counterSlice.reducer } },
    });

    store.addReducer('user', userSlice.reducer);
    store.removeReducer('user');

    expect(store.store.asyncReducers).not.toHaveProperty('user');
    expect(store.store.getState()).not.toHaveProperty('user');
  });

  it('given a missing reducer key, when removeReducer is called, then it does not throw', () => {
    const store = createReduxAsyncStore({
      settings: { reducer: { counter: counterSlice.reducer } },
    });

    expect(() => store.removeReducer('nonExistent')).not.toThrow();
  });

  it('given added reducers, when actions are dispatched, then state updates', () => {
    const store = createReduxAsyncStore({
      settings: { reducer: { counter: counterSlice.reducer } },
    });

    store.addReducer('user', userSlice.reducer);

    store.store.dispatch(increment());
    store.store.dispatch(setName('Alice'));
    store.store.dispatch(setEmail('alice@example.com'));

    expect(store.store.getState()).toEqual({
      counter: { count: 1 },
      user: { name: 'Alice', email: 'alice@example.com' },
    });
  });

  it('given a created store, when reading hooks, then useDispatch and useSelector are functions', () => {
    const store = createReduxAsyncStore({
      settings: { reducer: { counter: counterSlice.reducer } },
    });

    expect(typeof store.useDispatch).toBe('function');
    expect(typeof store.useSelector).toBe('function');
  });
});
