import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Remote } from '../../src/Remote';

function LoadedComponent() {
  return <div data-testid="remote-content">Remote content</div>;
}

describe('Remote', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('waits for a dependency before loading the remote component', async () => {
    let resolveDependency!: () => void;
    const dependency = vi.fn(() => new Promise<void>(resolve => {
      resolveDependency = resolve;
    }));
    const component = vi.fn().mockResolvedValue({ default: LoadedComponent });

    render(
      <Remote
        component={component}
        dependency={dependency}
        fallback={<div data-testid="loading">Loading</div>}
      />,
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(dependency).toHaveBeenCalledOnce();
    expect(component).not.toHaveBeenCalled();

    resolveDependency();

    expect(await screen.findByTestId('remote-content')).toBeInTheDocument();
    expect(component).toHaveBeenCalledOnce();
  });

  it('waits for every dependency before loading the remote component', async () => {
    const firstDependency = vi.fn().mockResolvedValue(undefined);
    const secondDependency = vi.fn().mockResolvedValue(undefined);
    const component = vi.fn().mockResolvedValue({ default: LoadedComponent });

    render(
      <Remote
        component={component}
        dependency={[firstDependency, secondDependency]}
      />,
    );

    expect(await screen.findByTestId('remote-content')).toBeInTheDocument();
    expect(firstDependency).toHaveBeenCalledOnce();
    expect(secondDependency).toHaveBeenCalledOnce();
    expect(component).toHaveBeenCalledOnce();
  });

  it('renders the error fallback when a dependency fails', async () => {
    const error = new Error('Dependency failed');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const dependency = vi.fn().mockRejectedValue(error);
    const component = vi.fn().mockResolvedValue({ default: LoadedComponent });

    render(
      <Remote
        component={component}
        dependency={dependency}
        errorFallback={<div data-testid="remote-error">Unable to load remote</div>}
      />,
    );

    expect(await screen.findByTestId('remote-error')).toBeInTheDocument();
    expect(component).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Remote dependency loading error:', error);
    });
  });

  it('renders the error fallback when the remote module fails to load', async () => {
    const error = new Error('Remote module failed');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const component = vi.fn().mockRejectedValue(error);

    render(
      <Remote
        component={component}
        errorFallback={<div data-testid="remote-error">Unable to load remote</div>}
      />,
    );

    expect(await screen.findByTestId('remote-error')).toBeInTheDocument();
    expect(component).toHaveBeenCalledOnce();
    expect(consoleError).toHaveBeenCalled();
  });
});
