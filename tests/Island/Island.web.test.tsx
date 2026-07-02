import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Island, useIsland } from '../../src/Island';

function IslandStatus() {
  const isIsland = useIsland();

  return <span>{isIsland ? 'inside' : 'outside'}</span>;
}

describe('Island', () => {
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
});
