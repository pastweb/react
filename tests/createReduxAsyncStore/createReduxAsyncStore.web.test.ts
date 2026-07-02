import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSlice } from '@reduxjs/toolkit';
import { createReduxAsyncStore } from '../../src/createReduxAsyncStore';

// Create slices using Redux Toolkit
const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
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

const { increment, decrement } = counterSlice.actions;
const { setName, setEmail } = userSlice.actions;

describe('createReduxAsyncStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a store with initial settings', () => {
    const store = createReduxAsyncStore({
      settings: {
        reducer: { counter: counterSlice.reducer },
      },
    });

    expect(store.store).toBeDefined();
    expect(store.store.getState()).toEqual({ counter: { count: 0 } });
    expect(store.store.asyncReducers).toEqual({});
  });

  it('calls onInit during init()', async () => {
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

  it('adds reducer dynamically using addReducer', () => {
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

  it('does not add the same reducer twice', () => {
    const store = createReduxAsyncStore({
      settings: { reducer: {} },
    });

    store.addReducer('counter', counterSlice.reducer);
    store.addReducer('counter', counterSlice.reducer); // should be ignored

    expect(Object.keys(store.store.asyncReducers)).toHaveLength(1);
  });

  it('removes reducer correctly', () => {
    const store = createReduxAsyncStore({
      settings: { reducer: { counter: counterSlice.reducer } },
    });

    store.addReducer('user', userSlice.reducer);
    store.removeReducer('user');

    expect(store.store.asyncReducers).not.toHaveProperty('user');
    expect(store.store.getState()).not.toHaveProperty('user');
  });

  it('dispatches actions and updates state correctly', () => {
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

  it('provides useDispatch and useSelector hooks', () => {
    const store = createReduxAsyncStore({
      settings: { reducer: { counter: counterSlice.reducer } },
    });

    expect(typeof store.useDispatch).toBe('function');
    expect(typeof store.useSelector).toBe('function');
  });

  it('removeReducer does nothing if reducer does not exist', () => {
    const store = createReduxAsyncStore({
      settings: { reducer: { counter: counterSlice.reducer } },
    });

    expect(() => store.removeReducer('nonExistent')).not.toThrow();
  });
});
