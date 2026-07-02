import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { reactive } from '@pastweb/tools/reactivity';
import {
  ApiQueryProvider,
  reuseMutation,
  reuseQuery,
  useApiQueryCache,
  useQuery,
} from '../../src/api';
import type { QueryCache, QueryResponse } from '@pastweb/tools';

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(res => {
    resolve = res;
  });

  return { promise, resolve };
}

describe('React API hooks', () => {
  it('exports reuseMutation as the same implementation as reuseQuery', () => {
    expect(reuseMutation).toBe(reuseQuery);
  });

  it('reads the query cache from ApiQueryProvider', () => {
    const queryCache = {
      getDehydrateScriptID: () => '__TEST__',
    } as QueryCache;

    function Probe() {
      const cache = useApiQueryCache();

      return <span>{cache.getDehydrateScriptID()}</span>;
    }

    render(
      <ApiQueryProvider queryCache={queryCache}>
        <Probe />
      </ApiQueryProvider>
    );

    expect(screen.getByText('__TEST__')).toBeInTheDocument();
  });

  it('reuses a tools reactive state and re-renders when its first-shape fields change', async () => {
    function Counter() {
      const state = reuseQuery(() => {
        const nextState = reactive({
          count: 0,
          increment() {
            nextState.count += 1;
          },
        });

        return nextState;
      });

      return (
        <button onClick={state.increment}>
          {state.count}
        </button>
      );
    }

    render(<Counter />);

    expect(screen.getByRole('button')).toHaveTextContent('0');

    await act(async () => {
      screen.getByRole('button').click();
    });

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('1');
    });
  });

  it('wraps tools useQuery and re-renders when query data resolves', async () => {
    const deferred = createDeferred<QueryResponse<{ name: string }>>();

    function User() {
      const query = useQuery({
        fn: () => deferred.promise,
      });

      return <span>{query.data?.name ?? 'Loading'}</span>;
    }

    render(<User />);

    expect(screen.getByText('Loading')).toBeInTheDocument();

    await act(async () => {
      deferred.resolve({
        data: { name: 'Ada' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as QueryResponse<{ name: string }>);
    });

    await waitFor(() => {
      expect(screen.getByText('Ada')).toBeInTheDocument();
    });
  });
});
