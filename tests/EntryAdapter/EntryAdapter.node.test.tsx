import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { resolveAsyncTasks } from '@pastweb/tools/ssrUtils/asyncTasks';
import { createEntry, createServerEntry } from '../../src/createEntry';
import { EntryAdapter } from '../../src/EntryAdapter';

describe('EntryAdapter (server)', () => {
  it('uses entry on the server when ssrEntry is not provided', async () => {
    const sharedEntry = createServerEntry({
      EntryComponent: ({ name }: { name: string }) => <div>Shared entry for {name}</div>,
    });

    const element = (
      <EntryAdapter
        entry={() => sharedEntry}
        name="Grace"
      />
    );

    expect(renderToString(element)).toContain(sharedEntry.ssrId);

    const html = await sharedEntry.getComposedSSR();

    expect(html).toContain('Shared entry for');
    expect(html).toContain('Grace');
  });

  it('loads the server entry through async tasks and uses it on the next render pass', async () => {
    const clientEntry = createEntry({
      EntryComponent: () => <div>Client entry</div>,
    });
    const serverEntry = createServerEntry({
      EntryComponent: ({ name }: { name: string }) => <div>Server entry for {name}</div>,
    });
    const loadServerEntry = vi.fn(async () => serverEntry);

    const element = (
      <EntryAdapter
        entry={() => clientEntry}
        ssrEntry={loadServerEntry}
        name="Ada"
      />
    );

    renderToString(element);

    expect(loadServerEntry).not.toHaveBeenCalled();

    await resolveAsyncTasks();

    expect(loadServerEntry).toHaveBeenCalledTimes(1);
    expect(renderToString(element)).toContain(serverEntry.ssrId);
    const html = await serverEntry.getComposedSSR();

    expect(html).toContain('Server entry for');
    expect(html).toContain('Ada');
  });
});
