import { render, screen } from '@testing-library/react';
import { createWindowManager } from '@pastweb/tools';
import { describe, expect, it } from 'vitest';
import {
  useWindowManager,
  WindowManagerProvider,
} from '../../src/windowManager';

describe('windowManager', () => {
  it('given a WindowManagerProvider, when useWindowManager runs, then it returns the supplied manager', () => {
    const manager = createWindowManager();

    function Probe() {
      return <span>{useWindowManager() === manager ? 'same manager' : 'different manager'}</span>;
    }

    render(
      <WindowManagerProvider manager={manager}>
        <Probe />
      </WindowManagerProvider>
    );

    expect(screen.getByText('same manager')).toBeInTheDocument();
  });
});
