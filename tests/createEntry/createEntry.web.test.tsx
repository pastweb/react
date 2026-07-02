import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { createAsyncStore, type EventCallback, type AsyncStore, type AsyncStoreOptions } from '@pastweb/tools';
import { createEntry } from '../../src/createEntry';

describe('createEntry', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'app';

    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('creates a React entry object', () => {
    const entry = createEntry({
      entryElement: container,
    });

    expect(entry).toBeDefined();
    expect(typeof entry.mount).toBe('function');
    expect(typeof entry.unmount).toBe('function');
  });

  it('mounts a component using createRoot', async () => {
    const App = () => <div>Hello World</div>;

    const entry = createEntry({
      EntryComponent: App,
      entryElement: container,
    });

    entry.mount();

    await waitFor(() => {
      expect(
        screen.getByText('Hello World')
      ).toBeInTheDocument();
    });
  });

  it('hydrates a server-rendered application', async () => {
    container.innerHTML = '<div>Hydrated App</div>';

    const App = () => <div>Hydrated App</div>;

    const entry = createEntry({
      EntryComponent: App,
      entryElement: container,
    });

    entry.mount({ hydrate: true });

    await waitFor(() => {
      expect(
        screen.getByText('Hydrated App')
      ).toBeInTheDocument();
    });
  });

  it('unmounts the application', async () => {
    const App = () => <div>Unmount Test</div>;

    const entry = createEntry({
      EntryComponent: App,
      entryElement: container,
    });

    entry.mount();

    await waitFor(() => {
      expect(
        screen.getByText('Unmount Test')
      ).toBeInTheDocument();
    });

    entry.unmount();

    expect(container.innerHTML).toBe('');
  });

  it('renders with Providers wrapper', async () => {
    const App = () => <div>Provider App</div>;

    const Providers = ({ children }: any) => (
      <div data-testid="providers">
        {children}
      </div>
    );

    const entry = createEntry({
      EntryComponent: App,
      Providers,
      entryElement: container,
    });

    entry.mount();

    await waitFor(() => {
      expect(
        screen.getByTestId('providers')
      ).toBeInTheDocument();

      expect(
        screen.getByText('Provider App')
      ).toBeInTheDocument();
    });
  });

  it('passes initData to the rendered component', async () => {
    const App = ({ title }: { title: string }) => (
      <div>{title}</div>
    );

    const entry = createEntry({
      EntryComponent: App,
      initData: {
        title: 'Hello Entry',
      },
      entryElement: container,
    });

    entry.mount();

    await waitFor(() => {
      expect(
        screen.getByText('Hello Entry')
      ).toBeInTheDocument();
    });
  });

  it('renders React elements directly', async () => {
    const entry = createEntry({
      EntryComponent: <div>Element App</div>,
      entryElement: container,
    });

    entry.mount();

    await waitFor(() => {
      expect(
        screen.getByText('Element App')
      ).toBeInTheDocument();
    });
  });

  it('supports waitFor async dependencies', async () => {
    function fakeAsyncTask() {
      const store = createAsyncStore<AsyncStore<AsyncStoreOptions>>({ name: 'fakeAsyncTask', onInit });

      function onInit() {
        store.setStoreReady();}
      return store;
    }

    const asyncTask = fakeAsyncTask();
    const App = () => <div>Async App</div>;

    const entry = createEntry({
      EntryComponent: App,
      waitFor: [asyncTask],
      fallback: <div>Loading...</div>,
      entryElement: container,
    });

    entry.mount();

    setTimeout(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    }, 1000);
    
    await waitFor(() => {
      expect(
        screen.getByText('Async App')
      ).toBeInTheDocument();
    });
  });

  it('registers update listeners through UpdateEntry', async () => {
    const App = ({ title }: { title: string }) => (
      <div>{title}</div>
    );

    const entry = createEntry({
      EntryComponent: App,
      initData: {
        title: 'Before Update',
      },
      entryElement: container,
    });

    expect(entry.on).toBeDefined();
    expect(typeof entry.on).toBe('function');
    // expect(entry.on).toHaveBeenCalledTimes(0);

    entry.mount();

    await waitFor(() => {
      expect(screen.getByText('Before Update')).toBeInTheDocument();
    });

    entry.emit('update', {
      title: 'After Update',
    });

    await waitFor(() => {
      expect(
        screen.getByText('After Update')
      ).toBeInTheDocument();
    });
  });
});
