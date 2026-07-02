import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderToString } from 'react-dom/server';
import { AsyncComponent, type AsyncComponentProps } from '../../src/AsyncComponent';
import { loadDependency, normalizeDependency } from '../../src/AsyncComponent/utils';

interface AsyncProps extends AsyncComponentProps {
  name?: string;
  title?: string;
}

const Async = (props: AsyncProps) => AsyncComponent(props);

const taskState = vi.hoisted(() => ({
  tasks: [] as Array<() => Promise<void>>,
}));

vi.mock('@pastweb/tools', async importOriginal => ({
  ...await importOriginal<typeof import('@pastweb/tools')>(),
  isServer: true,
}));

vi.mock('@pastweb/tools/ssrUtils', () => ({
  registerAsyncTask: vi.fn((task: () => Promise<void>) => {
    taskState.tasks.push(task);
  }),
}));

vi.mock('../../src/AsyncComponent/utils', () => ({
  loadDependency: vi.fn(() => Promise.resolve()),
  normalizeDependency: vi.fn((dep) => dep),
}));

describe('AsyncComponent (server side)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    taskState.tasks = [];
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const dep1 = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ someData: 'data1' }), 100)));
  const dep2 = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ someData: 'data2' }), 100)));

  async function resolveRegisteredTasks() {
    while (taskState.tasks.length) {
      const current = taskState.tasks.splice(0);

      await Promise.all(
        current.map(async task => {
          try {
            await task();
          } catch (error) {
            console.error('[SSR] async task failed', error);
          }
        })
      );
    }
  }

  it('renders the async component after loading dependencies', async () => {
    const TestComponent = ({ title }: { title: string }) => (
      <div>{title}</div>
    );
    const component = async () => ({ default: TestComponent });
    const props = {
      component,
      dependencies: [dep1, dep2],
      title: 'Hello SSR',
    };

    expect(renderToString(Async(props))).toBe('');

    await resolveRegisteredTasks();

    expect(renderToString(Async(props))).toContain('Hello SSR');

    expect(normalizeDependency).toHaveBeenCalledTimes(2);
    expect(loadDependency).toHaveBeenCalledTimes(2);

    expect(loadDependency).toHaveBeenCalledWith(dep1);
    expect(loadDependency).toHaveBeenCalledWith(dep2);
  });

  it('renders without dependencies', async () => {
    const TestComponent = () => <div>No deps</div>;
    const props = { component: async () => ({ default: TestComponent }) };

    expect(renderToString(AsyncComponent(props))).toBe('');

    await resolveRegisteredTasks();

    expect(renderToString(AsyncComponent(props))).toContain('No deps');

    expect(loadDependency).not.toHaveBeenCalled();
  });

  it('passes props to the loaded component', async () => {
    const TestComponent = ({ name }: { name: string }) => (
      <span>{name}</span>
    );
    const props = {
      component: async () => ({ default: TestComponent }),
      name: 'John',
    };

    expect(renderToString(Async(props))).toBe('');

    await resolveRegisteredTasks();

    expect(renderToString(Async(props))).toContain('John');
  });

  it('keeps rendering null when component loading fails during the async task', async () => {
    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const props = {
      component: async () => { throw new Error('failed to import'); },
      fallback: <div>Fallback UI</div>,
    };

    expect(renderToString(AsyncComponent(props))).toBe('');

    await resolveRegisteredTasks();

    expect(renderToString(AsyncComponent(props))).toBe('');
    expect(consoleSpy).toHaveBeenCalledWith('[SSR] async task failed', expect.any(Error));
  });

  it('keeps rendering null when default export is missing', async () => {
    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const props = {
      component: async () => ({} as any),
      fallback: <div>Missing export fallback</div>,
    };

    expect(renderToString(AsyncComponent(props))).toBe('');

    await resolveRegisteredTasks();

    expect(renderToString(AsyncComponent(props))).toBe('');

    expect(consoleSpy).toHaveBeenCalledWith(
      'AsyncComponent: No default export found'
    );
  });

  it('continues rendering even if a dependency fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation((message, error) => {
      expect(message).toBe('dependency 1 failed:');
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('dependency failed');
    });

    vi.mocked(loadDependency).mockImplementation((dep: any) => {
      if (dep === 'bad-dep') {
        return Promise.reject(new Error('dependency failed'));
      }

      return Promise.resolve();
    });

    const TestComponent = () => <div>Rendered anyway</div>;
    const props = {
      component: async () => ({
        default: TestComponent,
      }),
      dependencies: ['good-dep', 'bad-dep'],
    };

    expect(renderToString(AsyncComponent(props))).toBe('');

    await resolveRegisteredTasks();

    expect(renderToString(AsyncComponent(props))).toContain('Rendered anyway');

    expect(loadDependency).toHaveBeenCalledTimes(2);
  });

  it('returns null during the collection render when no fallback exists', () => {
    const result = AsyncComponent({
      component: async () => ({ default: () => <div>Later</div> }),
    });

    expect(result).toBeNull();
    expect(taskState.tasks).toHaveLength(1);
  });
});
