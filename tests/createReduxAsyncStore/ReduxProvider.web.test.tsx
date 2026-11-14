import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { createReduxAsyncStore, ReduxProvider } from '../../src/createReduxAsyncStore';
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment: (state) => { state.count += 1; },
  },
});

describe('ReduxProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('given an async store that is not ready, when ReduxProvider renders, then it shows the fallback', () => {
    const asyncStore = createReduxAsyncStore({
      settings: { reducer: { counter: counterSlice.reducer } },
      onInit: async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      },
    });

    render(
      <ReduxProvider
        store={asyncStore}
        fallback={<div data-testid="loading">Loading...</div>}
      >
        <div data-testid="app-content">Async Content</div>
      </ReduxProvider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByTestId('app-content')).not.toBeInTheDocument();
  });

  it('given an async store, when init completes, then ReduxProvider renders children', async () => {
    const asyncStore = createReduxAsyncStore({
      settings: {
        reducer: { counter: counterSlice.reducer },
      },
      onInit: async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      },
    });

    render(
      <ReduxProvider
        store={asyncStore}
        fallback={<div data-testid="loading">Loading...</div>}
      >
        <div data-testid="app-content">Async Content</div>
      </ReduxProvider>
    );

    await asyncStore.init();

    await waitFor(() => {
      expect(screen.getByTestId('app-content')).toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  it('given an already ready async store, when ReduxProvider renders, then children render without a fallback', async () => {
    const asyncStore = createReduxAsyncStore({
      settings: { reducer: { counter: counterSlice.reducer } },
    });

    await asyncStore.init();

    render(
      <ReduxProvider
        store={asyncStore}
        fallback={<div data-testid="loading">Loading...</div>}
      >
        <div data-testid="app-content">Ready Content</div>
      </ReduxProvider>
    );

    expect(screen.getByTestId('app-content')).toBeInTheDocument();
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  it('given an async redux store, when the provider is ready, then children can read state with useSelector', async () => {
    const asyncStore = createReduxAsyncStore({
      settings: {
        reducer: { counter: counterSlice.reducer },
      },
    });

    function Count() {
      const count = useSelector((state: { counter: { count: number } }) => state.counter.count);
      return <div data-testid="count">{count}</div>;
    }

    render(
      <ReduxProvider
        store={asyncStore}
        fallback={<div data-testid="loading">Loading...</div>}
      >
        <Count />
      </ReduxProvider>
    );

    await asyncStore.init();

    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  it('given a regular redux store, when ReduxProvider renders, then children render immediately', () => {
    const regularStore = {
      getState: () => ({}),
      dispatch: vi.fn(),
      subscribe: vi.fn(),
    } as any;

    render(
      <ReduxProvider store={regularStore}>
        <div data-testid="app-content">Regular Content</div>
      </ReduxProvider>
    );

    expect(screen.getByTestId('app-content')).toBeInTheDocument();
  });
});
