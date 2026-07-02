import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  PORTALS_CONTEXT_KEY,
  PORTAL_ANCHORS_CONTEXT_KEY,
  type PortalHandler,
} from '@pastweb/tools';
import { GlobalContext } from '../../src/GlobalContext';
import {
  installPortals,
  Portal,
  PortalsProvider,
  usePortal,
  usePortalAnchors,
  usePortals,
} from '../../src/portals';

afterEach(() => {
  cleanup();
});

describe('portals', () => {
  it('installs portal descriptors and anchor ids into GlobalContext', () => {
    const anchorsIds = {
      modal: 'modal-root',
    };
    const installPortalContext = installPortals({
      anchorsIds,
      getEntry: vi.fn(),
    });

    function Probe() {
      const anchors = usePortalAnchors<typeof anchorsIds>();
      const portals = usePortals<Record<string, unknown>>();

      return (
        <>
          <span>{anchors.modal}</span>
          <span>{typeof portals.modal}</span>
        </>
      );
    }

    render(
      <GlobalContext use={installPortalContext}>
        <Probe />
      </GlobalContext>
    );

    expect(screen.getByText('modal-root')).toBeInTheDocument();
    expect(screen.getByText('function')).toBeInTheDocument();
  });

  it('returns the same values as the tools portal context keys', () => {
    const anchorsIds = {
      modal: 'modal-root',
    };
    const portals = {
      modal: vi.fn(),
    };

    function Probe() {
      return (
        <>
          <span>{usePortalAnchors<typeof anchorsIds>().modal}</span>
          <span>{usePortals<typeof portals>().modal === portals.modal ? 'same' : 'different'}</span>
        </>
      );
    }

    render(
      <GlobalContext update={{
        [PORTAL_ANCHORS_CONTEXT_KEY]: anchorsIds,
        [PORTALS_CONTEXT_KEY]: portals,
      }}>
        <Probe />
      </GlobalContext>
    );

    expect(screen.getByText('modal-root')).toBeInTheDocument();
    expect(screen.getByText('same')).toBeInTheDocument();
  });

  it('provides portal descriptors through PortalsProvider without explicit GlobalContext', () => {
    const anchorsIds = {
      modal: 'modal-provider-root',
    };

    function Probe() {
      const anchors = usePortalAnchors<typeof anchorsIds>();
      const portals = usePortals<Record<string, unknown>>();

      return (
        <>
          <span>{anchors.modal}</span>
          <span>{typeof portals.modal}</span>
        </>
      );
    }

    render(
      <PortalsProvider anchorsIds={anchorsIds} getEntry={vi.fn()}>
        <Probe />
      </PortalsProvider>
    );

    expect(screen.getByText('modal-provider-root')).toBeInTheDocument();
    expect(screen.getByText('function')).toBeInTheDocument();
  });

  it('wires usePortal actions to the selected Portal handler', async () => {
    const removeCallbacks: Array<() => void> = [];
    const selectedHandler = {
      id: false,
      open: vi.fn(() => 'entry-1'),
      update: vi.fn(() => true),
      close: vi.fn(),
      remove: vi.fn(() => true),
      onRemove: vi.fn((fn: () => void) => {
        removeCallbacks.push(fn);
      }),
      getPortalElement: vi.fn(() => document.createElement('div')),
      portal: {},
    } as unknown as PortalHandler;
    const createPortalHandler = vi.fn(() => selectedHandler);

    function Trigger() {
      const modal = usePortal();

      return (
        <>
          <button onClick={() => modal.open()}>Open</button>
          <button onClick={() => modal.update({ title: 'Updated' })}>Update</button>
          <button onClick={() => modal.close()}>Close</button>
          <button onClick={() => modal.remove()}>Remove</button>
          <Portal path="modal" use={modal}>
            <div>Portal content</div>
          </Portal>
        </>
      );
    }

    render(
      <GlobalContext update={{
        [PORTALS_CONTEXT_KEY]: {
          modal: createPortalHandler,
        },
      }}>
        <Trigger />
      </GlobalContext>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open' }));

    await waitFor(() => {
      expect(createPortalHandler).toHaveBeenCalled();
      expect(selectedHandler.open).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Update' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(selectedHandler.update).toHaveBeenCalledWith({ title: 'Updated' });
    expect(selectedHandler.close).toHaveBeenCalled();
    expect(selectedHandler.remove).toHaveBeenCalled();

    removeCallbacks.forEach(fn => fn());
  });
});
