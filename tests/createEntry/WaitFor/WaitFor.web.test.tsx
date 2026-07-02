import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor as rtlWaitFor } from '@testing-library/react';

vi.mock('@pastweb/tools/envs', () => ({
  isServer: false,
}));

vi.mock('@pastweb/tools/createAsyncStore/normalizeAsyncQueue', () => ({
  normalizeAsyncQueue: vi.fn((wait) => {
    const items = Array.isArray(wait) ? wait : [wait];

    return items.map((item) => {
      if (typeof item === 'function') {
        return item();
      }

      return item;
    });
  }),
}));

import { WaitFor } from '../../../src/createEntry/WaitFor/WaitFor';

describe('WaitFor (client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders fallback while loading', () => {
    render(
      <WaitFor
        wait={new Promise(() => {})}
        fallback={() => <div>Loading...</div>}
      >
        <div>Loaded</div>
      </WaitFor>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders children after async tasks resolve', async () => {
    render(
      <WaitFor
        wait={Promise.resolve()}
        fallback={() => <div>Loading...</div>}
      >
        <div>Loaded</div>
      </WaitFor>
    );

    await rtlWaitFor(() => {
      expect(screen.getByText('Loaded')).toBeInTheDocument();
    });
  });

  it('supports async function waits', async () => {
    const asyncTask = vi.fn(async () => {
      return Promise.resolve();
    });

    render(
      <WaitFor
        wait={asyncTask}
        fallback={() => <div>Loading...</div>}
      >
        <div>Async Function Loaded</div>
      </WaitFor>
    );

    await rtlWaitFor(() => {
      expect(
        screen.getByText('Async Function Loaded')
      ).toBeInTheDocument();
    });

    expect(asyncTask).toHaveBeenCalledTimes(1);
  });

  it('supports multiple async waits', async () => {
    render(
      <WaitFor
        wait={[
          Promise.resolve(),
          Promise.resolve(),
        ]}
        fallback={() => <div>Loading...</div>}
      >
        <div>Multiple Loaded</div>
      </WaitFor>
    );

    await rtlWaitFor(() => {
      expect(
        screen.getByText('Multiple Loaded')
      ).toBeInTheDocument();
    });
  });

  it('renders immediately when queue is empty', async () => {
    render(
      <WaitFor wait={[]} fallback={() => <div>Loading...</div>}>
        <div>No Wait</div>
      </WaitFor>
    );

    await rtlWaitFor(() => {
      expect(screen.getByText('No Wait')).toBeInTheDocument();
    });
  });

  it('continues rendering when async tasks fail', async () => {
    const errorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <WaitFor
        wait={Promise.reject(new Error('failed'))}
        fallback={() => <div>Loading...</div>}
      >
        <div>Recovered</div>
      </WaitFor>
    );

    await rtlWaitFor(() => {
      expect(screen.getByText('Recovered')).toBeInTheDocument();
    });

    expect(errorSpy).toHaveBeenCalled();
  });

  it('supports React fallback elements', () => {
    render(
      <WaitFor
        wait={new Promise(() => {})}
        fallback={() => <div>Element Fallback</div>}
      >
        <div>Loaded</div>
      </WaitFor>
    );

    expect(
      screen.getByText('Element Fallback')
    ).toBeInTheDocument();
  });
});
