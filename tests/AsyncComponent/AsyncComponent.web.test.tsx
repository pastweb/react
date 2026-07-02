import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react'; 
import { AsyncComponent, type AsyncComponentProps, type DependencyInfo } from '../../src/AsyncComponent';

interface AsyncProps extends AsyncComponentProps {
  name?: string;
}

const Async = (props: AsyncProps) => <AsyncComponent {...props} />;

// Mock components
const MockLoadedComponent = ({ name = 'World', ...props }: { name?: string }) => (
  <div data-testid="loaded-component" {...props}>
    Hello, {name}!
  </div>
);

const LoadingSpinner = () => <div data-testid="loading">Loading...</div>;

describe('AsyncComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders fallback while loading and then the component', async () => {
    const componentLoader = vi.fn().mockImplementation(() =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ default: MockLoadedComponent }), 100)
      )
    );

    render(
      <AsyncComponent
        component={componentLoader}
        fallback={<LoadingSpinner />}
      />
    );

    // Initial check (synchronous or immediately available)
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Wait for the async component to mount
    expect(await screen.findByTestId('loaded-component')).toBeInTheDocument();
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();

    expect(componentLoader).toHaveBeenCalledOnce();
  });

  it('renders without fallback (shows nothing until loaded)', async () => {
    const componentLoader = vi.fn().mockImplementation(() =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ default: MockLoadedComponent }), 100)
      )
    );

    render(<AsyncComponent component={componentLoader} />);

    // Initially nothing should be rendered
    expect(screen.queryByTestId('loaded-component')).not.toBeInTheDocument();

    // Wait until it loads
    expect(await screen.findByTestId('loaded-component')).toBeInTheDocument();
  });

  it('passes props to the loaded component', async () => {
    const componentLoader = vi.fn().mockImplementation(() =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ default: MockLoadedComponent }), 100)
      )
    );

    render(
      <Async component={componentLoader} name="Test User" data-custom="value" />
    );

    expect(await screen.findByText('Hello, Test User!')).toBeInTheDocument();
    expect(screen.getByTestId('loaded-component')).toHaveAttribute('data-custom', 'value');
  });

  it('handles dependencies correctly - waits for all before loading component', async () => {
    const dep1 = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ someData: 'data1' }), 100)));
    const dep2 = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ someData: 'data2' }), 100)));
    const componentLoader = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ default: MockLoadedComponent }), 100)));

    render(
      <AsyncComponent
        component={componentLoader}
        dependencies={[dep1, dep2]}
        fallback={<LoadingSpinner />}
      />
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();

    expect(await screen.findByTestId('loaded-component')).toBeInTheDocument();

    expect(dep1).toHaveBeenCalledOnce();
    expect(dep2).toHaveBeenCalledOnce();
    expect(componentLoader).toHaveBeenCalledOnce();
  });

  it('supports DependencyInfo objects with custom export names', async () => {
    const namedExportModule = { utils: { helper: 'value' } };
    const depInfo: DependencyInfo = {
      dependency: () => Promise.resolve(namedExportModule),
      exportName: 'utils',
    };

    const componentLoader = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ default: MockLoadedComponent }), 100)));

    render(
      <AsyncComponent
        component={componentLoader}
        dependencies={[depInfo]}
      />
    );

    expect(await screen.findByTestId('loaded-component')).toBeInTheDocument();
  });

  it('supports mixed dependency types', async () => {
    const promiseDep = Promise.resolve({ data: 1 });
    const functionDep = () => Promise.resolve({ data: 2 });
    const infoDep: DependencyInfo = {
      dependency: () => Promise.resolve({ data: 3 }),
      exportName: 'data',
    };

    const componentLoader = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ default: MockLoadedComponent }), 100)));

    render(
      <AsyncComponent
        component={componentLoader}
        dependencies={[promiseDep, functionDep, infoDep]}
      />
    );

    expect(await screen.findByTestId('loaded-component')).toBeInTheDocument();
  });

  it('handles component loading error gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const componentLoader = vi.fn().mockImplementation(() => new Promise((_, reject) => setTimeout(() => reject(new Error('Failed to load component')), 120)));

    render(
      <AsyncComponent
        component={componentLoader}
        fallback={<LoadingSpinner />}
      />
    );

    // Fallback should be visible
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Use RTL's waitFor to wait until console.error fires
    await waitFor(() => { 
      expect(consoleError).toHaveBeenCalledWith(expect.any(Error)); 
    }, { timeout: 2000 });

    // The fallback should STILL be visible
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Loaded component should never appear
    expect(screen.queryByTestId('loaded-component')).not.toBeInTheDocument();
  });

  it('handles dependency errors but continues loading', async () => {
    const badDepError = new Error('Bad dependency');
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const badDep = vi.fn().mockImplementation(() => new Promise((_, reject) => setTimeout(() => reject(badDepError), 80)));
    const goodDep = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 60)));
    const componentLoader = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ default: MockLoadedComponent }), 120)));

    render(
      <AsyncComponent
        component={componentLoader}
        dependencies={[badDep, goodDep]}
        fallback={<LoadingSpinner />}
      />
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Wait for the mock dependency error to be captured securely 
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('the dependency with the index 0 has an error:', badDepError);
    });
  });

  it('uses onSuccess and onError callbacks from DependencyInfo', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    const depInfo: DependencyInfo = {
      dependency: () => Promise.resolve({ default: { value: 42 } }),
      exportName: 'default',
      onSuccess,
      onError,
    };

    const componentLoader = vi.fn().mockResolvedValue({ default: MockLoadedComponent });

    render(
      <AsyncComponent
        component={componentLoader}
        dependencies={[depInfo]}
      />
    );

    expect(await screen.findByTestId('loaded-component')).toBeInTheDocument();

    expect(onSuccess).toHaveBeenCalledWith({ value: 42 });
    expect(onError).not.toHaveBeenCalled();
  });
});
