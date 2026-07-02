import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';

import { UpdateEntry } from '../../../src/createEntry/UpdateEntry/UpdateEntry';

describe('UpdateEntry (client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children with initial props', () => {
    const on = vi.fn();

    function App({ title }: { title?: string }) {
      return <div>{title}</div>;
    }

    render(
      <UpdateEntry on={on} title="Initial Title">
        <App />
      </UpdateEntry>
    );

    expect(
      screen.getByText('Initial Title')
    ).toBeInTheDocument();
  });

  it('registers the update event listener', () => {
    const on = vi.fn();

    function App() {
      return <div>App</div>;
    }

    render(
      <UpdateEntry on={on}>
        <App />
      </UpdateEntry>
    );

    expect(on).toHaveBeenCalledTimes(1);

    expect(on).toHaveBeenCalledWith(
      'update',
      expect.any(Function)
    );
  });

  it('updates child props when update event is triggered', async () => {
    let updateHandler!: (props: any) => void;

    const on = vi.fn((event, callback) => {
      if (event === 'update') {
        updateHandler = callback;
      }
    });

    function App({ title }: { title?: string }) {
      return <div>{title}</div>;
    }

    render(
      <UpdateEntry on={on} title="Before Update">
        <App />
      </UpdateEntry>
    );

    expect(
      screen.getByText('Before Update')
    ).toBeInTheDocument();

    await act(async () => {
      updateHandler({
        title: 'After Update',
      });
    });

    expect(
      screen.getByText('After Update')
    ).toBeInTheDocument();
  });

  it('replaces previous props with updated props', async () => {
    let updateHandler!: (props: any) => void;

    const on = vi.fn((event, callback) => {
      if (event === 'update') {
        updateHandler = callback;
      }
    });

    function App(props: any) {
      return (
        <div>
          {JSON.stringify(props)}
        </div>
      );
    }

    render(
      <UpdateEntry
        on={on}
        title="Old"
        description="Old Desc"
      >
        <App />
      </UpdateEntry>
    );

    await act(async () => {
      updateHandler({
        title: 'New',
      });
    });

    expect(
      screen.getByText('{"title":"New"}')
    ).toBeInTheDocument();
  });

  it('supports multiple updates', async () => {
    let updateHandler!: (props: any) => void;

    const on = vi.fn((event, callback) => {
      updateHandler = callback;
    });

    function App({ count }: { count?: number }) {
      return <div>{count}</div>;
    }

    render(
      <UpdateEntry on={on} count={1}>
        <App />
      </UpdateEntry>
    );

    expect(screen.getByText('1')).toBeInTheDocument();

    await act(async () => {
      updateHandler({ count: 2 });
    });

    expect(screen.getByText('2')).toBeInTheDocument();

    await act(async () => {
      updateHandler({ count: 3 });
    });

    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
