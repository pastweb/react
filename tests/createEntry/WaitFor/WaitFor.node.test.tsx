import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderToString } from 'react-dom/server';

vi.mock('@pastweb/tools/envs', () => ({
  isServer: true,
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

describe('WaitFor (server)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children after waiting for promises', async () => {
    const result = await WaitFor({
      wait: Promise.resolve(),
      children: <div>SSR Loaded</div>,
    });

    const html = renderToString(result);

    expect(html).toContain('SSR Loaded');
  });

  it('supports multiple async waits', async () => {
    const result = await WaitFor({
      wait: [
        Promise.resolve(),
        Promise.resolve(),
      ],
      children: <div>SSR Multiple</div>,
    });

    const html = renderToString(result);

    expect(html).toContain('SSR Multiple');
  });

  it('supports async functions', async () => {
    const asyncTask = vi.fn(async () => {
      return Promise.resolve();
    });

    const result = await WaitFor({
      wait: asyncTask,
      children: <div>SSR Async Function</div>,
    });

    const html = renderToString(result);

    expect(html).toContain('SSR Async Function');

    expect(asyncTask).toHaveBeenCalledTimes(1);
  });

  it('renders children immediately when queue is empty', async () => {
    const result = await WaitFor({
      wait: [],
      children: <div>SSR Empty Queue</div>,
    });

    const html = renderToString(result);

    expect(html).toContain('SSR Empty Queue');
  });

  it('returns null when async tasks fail', async () => {
    const errorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const result = await WaitFor({
      wait: Promise.reject(new Error('SSR Failure')),
      children: <div>Should Not Render</div>,
    });

    expect(result).toBeNull();

    expect(errorSpy).toHaveBeenCalled();
  });

  it('supports rendering React elements', async () => {
    const result = await WaitFor({
      wait: Promise.resolve(),
      children: <section>React Element</section>,
    });

    const html = renderToString(result);

    expect(html).toContain('React Element');
  });
});
