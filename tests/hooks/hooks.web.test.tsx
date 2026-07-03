import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getFunctionSignature, isHMREnabled, type HotImportMeta } from '@pastweb/tools';
import { reactive } from '@pastweb/tools/reactivity';
import { MatchMedia } from '../util/MatchMedia';
import {
  useBeforeMount,
  useBeforeUnmount,
  useForceUpdate,
  useMatchDevice,
  useMediator,
  useMounted,
  useRef,
} from '../../src';

function getMediatorSignature<T>(mediator: T, meta: HotImportMeta): string {
  return isHMREnabled(meta) ? getFunctionSignature(mediator) : '';
}

afterEach(() => {
  cleanup();
});

describe('React hook utilities', () => {
  it('runs useBeforeMount once before the first committed render', () => {
    const beforeMount = vi.fn();

    function Probe({ value }: { value: string }) {
      useBeforeMount(beforeMount);

      return <span>{value}</span>;
    }

    const { rerender } = render(<Probe value="first" />);

    expect(beforeMount).toHaveBeenCalledTimes(1);
    expect(screen.getByText('first')).toBeInTheDocument();

    rerender(<Probe value="second" />);

    expect(beforeMount).toHaveBeenCalledTimes(1);
    expect(screen.getByText('second')).toBeInTheDocument();
  });

  it('runs the latest useBeforeUnmount callback on unmount', () => {
    const first = vi.fn();
    const second = vi.fn();

    function Probe({ onUnmount }: { onUnmount: () => void }) {
      useBeforeUnmount(onUnmount);

      return <span>Mounted</span>;
    }

    const { rerender, unmount } = render(<Probe onUnmount={first} />);
    rerender(<Probe onUnmount={second} />);
    unmount();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('runs useMounted once after mount', async () => {
    const mounted = vi.fn();

    function Probe() {
      useMounted(mounted);

      return <span>Ready</span>;
    }

    const { rerender } = render(<Probe />);

    await waitFor(() => {
      expect(mounted).toHaveBeenCalledTimes(1);
    });

    rerender(<Probe />);

    expect(mounted).toHaveBeenCalledTimes(1);
  });

  it('forces a render with useForceUpdate', () => {
    function Probe() {
      const renders = useRef(0);
      const forceUpdate = useForceUpdate();

      renders.value += 1;

      return (
        <button onClick={forceUpdate}>
          {renders.value}
        </button>
      );
    }

    render(<Probe />);

    expect(screen.getByRole('button')).toHaveTextContent('1');

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toHaveTextContent('2');
  });

  it('keeps useRef current and value in sync', () => {
    function Probe() {
      const count = useRef(1);
      count.value += 1;

      return <span>{count.current}</span>;
    }

    render(<Probe />);

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('tracks device matches with useMatchDevice', async () => {
    const matchMedia = new MatchMedia();

    function Probe() {
      const { devices, onMatch } = useMatchDevice({
        phone: { mediaQuery: '(max-width: 640px)' },
      });

      useMounted(() => {
        onMatch('phone', () => undefined);
      });

      return <span>{devices.phone ? 'phone' : 'desktop'}</span>;
    }

    render(<Probe />);

    expect(screen.getByText('desktop')).toBeInTheDocument();

    matchMedia.useMediaQuery('(max-width: 640px)');

    await waitFor(() => {
      expect(screen.getByText('phone')).toBeInTheDocument();
    });

    matchMedia.destroy();
  });

  it('bridges mediator state into React rendering', async () => {
    const createCounter = () => {
      const state = reactive({ count: 0 });

      return {
        state,
        increment() {
          state.count += 1;
        },
      };
    };

    function Probe() {
      const counter = useMediator<ReturnType<typeof createCounter>>(createCounter);

      return (
        <button onClick={counter.increment}>
          {counter.state.count}
        </button>
      );
    }

    render(<Probe />);

    expect(screen.getByRole('button')).toHaveTextContent('0');

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('1');
    });
  });

  it('keeps inline mediator state when the component rerenders without HMR', async () => {
    function Probe({ label }: { label: string }) {
      const counter = useMediator(() => {
        const state = reactive({ count: 0 });

        return {
          state,
          increment() {
            state.count += 1;
          },
        };
      });

      return (
        <>
          <span>{label}</span>
          <button onClick={counter.increment}>
            {counter.state.count}
          </button>
        </>
      );
    }

    const { rerender } = render(<Probe label="first" />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('1');
    });

    rerender(<Probe label="second" />);

    expect(screen.getByText('second')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('1');
  });

  it('detects Vite and Webpack-compatible HMR import metadata', () => {
    expect(isHMREnabled({ hot: {} } as ImportMeta)).toBe(true);
    expect(isHMREnabled({ webpackHot: {} } as ImportMeta)).toBe(true);
    expect(isHMREnabled({} as ImportMeta)).toBe(false);
  });

  it('creates mediator signatures only when HMR is enabled', () => {
    const first = () => ({});
    const second = () => ({ ready: true });

    expect(getMediatorSignature(first, {} as ImportMeta)).toBe('');
    expect(getMediatorSignature(first, { hot: {} } as ImportMeta)).toBe(Function.prototype.toString.call(first));
    expect(getMediatorSignature(first, { hot: {} } as ImportMeta)).not.toBe(
      getMediatorSignature(second, { hot: {} } as ImportMeta)
    );
  });
});
