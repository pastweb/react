import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRef, useState } from 'react';
import { act, render, screen, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest'; 
import { createEntry } from '../../src/createEntry';
import { EntryAdapter } from '../../src/EntryAdapter';
import { Island } from '../../src/Island';

describe('EntryAdapter (Client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders a div with ref and calls mount event', async () => {
    const mockEntry = createEntry({
      EntryComponent: () => <div data-testid="entry-content">Hello from Entry</div>,
    });

    const entryFn = vi.fn(() => mockEntry);

    render(
      <EntryAdapter entry={entryFn} />
    );

    expect(screen.getByTestId('entry-content')).toBeInTheDocument();
  });

  it('forwards the host element to an object ref', () => {
    const mockEntry = createEntry();
    mockEntry.mount = vi.fn();
    mockEntry.unmount = vi.fn();
    const ref = createRef<HTMLDivElement>();

    render(<EntryAdapter ref={ref} entry={() => mockEntry} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('forwards the host element to a callback ref', () => {
    const mockEntry = createEntry();
    mockEntry.mount = vi.fn();
    mockEntry.unmount = vi.fn();
    const ref = vi.fn();

    render(<EntryAdapter ref={ref} entry={() => mockEntry} />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });


  // TODO @testing-library/react does not support testing the update of props in the entry component, we need to find a way to test it.
  it('passes rest props to props component', () => {
    const mockEntry = createEntry({
      EntryComponent: (props: Record<string, string>) => (
        <div data-testid="entry-content">
          Hello from {props.title} with theme {props.theme}
        </div>
      ),
    });

    const entryFn = vi.fn(() => mockEntry);

    render(
      <EntryAdapter 
        entry={entryFn} 
        title="Test Page" 
        theme="dark" 
        userId={123}
      />
    );

    expect(screen.getByTestId('entry-content')).toBeInTheDocument();
    expect(screen.getByTestId('entry-content')).toHaveTextContent('Hello from Test Page with theme dark');
  });

  it('mounts entries without hydration outside an island', async () => {
    const mockEntry = createEntry();
    const mount = vi.fn();
    mockEntry.mount = mount;
    mockEntry.unmount = vi.fn();

    render(<EntryAdapter entry={() => mockEntry} />);

    await waitFor(() => {
      expect(mount).toHaveBeenCalledWith({ hydrate: false });
    });
  });

  it('hydrates entries rendered inside an island', async () => {
    const mockEntry = createEntry();
    const mount = vi.fn();
    mockEntry.mount = mount;
    mockEntry.unmount = vi.fn();

    render(
      <Island client="none">
        <EntryAdapter entry={() => mockEntry} />
      </Island>
    );

    await waitFor(() => {
      expect(mount).toHaveBeenCalledWith({ hydrate: true });
    });
  });
});
