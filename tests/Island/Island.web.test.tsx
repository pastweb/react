import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { DEFAULT_ISLAND_PROPS, ISLAND_CONTEXT_KEY } from '@pastweb/tools';
import { GlobalContext } from '../../src/GlobalContext';
import { DEFAULT_PROPS, ISLAND_CONTEXT_KEY as RICK } from '../../src/Island/constants';
import { Island, useIsland } from '../../src/Island';

function IslandStatus() {
  const isIsland = useIsland();

  return <span>{isIsland ? 'inside' : 'outside'}</span>;
}

afterEach(() => {
  cleanup();
});

describe('Island', () => {
  it('uses the shared tools defaults and island context key', () => {
    expect(DEFAULT_PROPS).toBe(DEFAULT_ISLAND_PROPS);
    expect(RICK).toBe(ISLAND_CONTEXT_KEY);
  });

  it('renders island content and exposes the optional island id', () => {
    render(
      <Island client="none" islandId="profile">
        <span>Profile</span>
      </Island>
    );

    expect(screen.getByText('Profile').closest('[data-island]')).toHaveAttribute('data-island-id', 'profile');
  });

  it('renders fallback before client hydration strategies run', () => {
    render(
      <Island client="visible" fallback={<span>Loading</span>}>
        <span>Ready</span>
      </Island>
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.queryByText('Ready')).not.toBeInTheDocument();
  });

  it('exposes island context to descendants and defaults to false', () => {
    render(
      <>
        <IslandStatus />
        <Island client="none">
          <IslandStatus />
        </Island>
      </>
    );

    expect(screen.getByText('outside')).toBeInTheDocument();
    expect(screen.getByText('inside')).toBeInTheDocument();
  });

  it('reads island state from GlobalContext when there is no local Island provider', () => {
    render(
      <GlobalContext update={{ [ISLAND_CONTEXT_KEY]: true }}>
        <IslandStatus />
      </GlobalContext>
    );

    expect(screen.getByText('inside')).toBeInTheDocument();
  });
});
