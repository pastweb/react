import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  getContext,
  GlobalContext,
  setContext,
  type Installer,
} from '../../src/GlobalContext';

describe('GlobalContext', () => {
  it('provides values returned by installer functions', () => {
    const installUser: Installer = keys => {
      expect(keys).toEqual([]);

      return {
        user: 'Ada',
      };
    };

    function Probe() {
      return <span>{getContext<string>('user')}</span>;
    }

    render(
      <GlobalContext use={installUser}>
        <Probe />
      </GlobalContext>
    );

    expect(screen.getByText('Ada')).toBeInTheDocument();
  });

  it('merges parent context and update values in nested providers', () => {
    function Probe() {
      return (
        <>
          <span>{getContext<string>('parentValue')}</span>
          <span>{getContext<string>('childValue')}</span>
        </>
      );
    }

    render(
      <GlobalContext update={{ parentValue: 'parent' }}>
        <GlobalContext update={{ childValue: 'child' }}>
          <Probe />
        </GlobalContext>
      </GlobalContext>
    );

    expect(screen.getByText('parent')).toBeInTheDocument();
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('re-renders getContext consumers when setContext updates a reactive value', async () => {
    function Writer() {
      const [ready, setReady] = useState(false);
      setContext('status', ready ? 'ready' : 'idle');

      return (
        <button onClick={() => setReady(true)}>
          Mark ready
        </button>
      );
    }

    function Reader() {
      return <span>{getContext<string>('status') ?? 'idle'}</span>;
    }

    render(
      <GlobalContext update={{ status: 'idle' }}>
        <Reader />
        <Writer />
      </GlobalContext>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Mark ready' }));

    await waitFor(() => {
      expect(screen.getByText('ready')).toBeInTheDocument();
    });
  });

  it('throws when an installer returns a key already present in the local context', () => {
    const installDuplicate: Installer = () => ({
      existing: 'installer',
    });
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(
      <GlobalContext update={{ existing: 'update' }} use={installDuplicate}>
        <span>Child</span>
      </GlobalContext>
    )).toThrow('install function "installDuplicate" returns an object with the key "existing"');

    consoleError.mockRestore();
  });
});
