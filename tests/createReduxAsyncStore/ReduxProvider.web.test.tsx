import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
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

  it('renders Provider and children when async store becomes ready', async () => {
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

    // Start initialization
    await asyncStore.init();

    // Wait for the component to re-render after ready = true
    await waitFor(() => {
      expect(screen.getByTestId('app-content')).toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  it('shows fallback while store is not ready', async () => {
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

    // Now initialize
    await asyncStore.init();

    await waitFor(() => {
      expect(screen.getByTestId('app-content')).toBeInTheDocument();
    });
  });

  it('renders immediately with regular Redux store', () => {
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
