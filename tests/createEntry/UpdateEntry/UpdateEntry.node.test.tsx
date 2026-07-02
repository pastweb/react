import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderToString } from 'react-dom/server';

import { UpdateEntry } from '../../../src/createEntry/UpdateEntry/UpdateEntry';

describe('UpdateEntry (server)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children with initial props', () => {
    const on = vi.fn();

    function App({ title }: { title?: string }) {
      return <div>{title}</div>;
    }

    const html = renderToString(
      <UpdateEntry on={on} title="SSR Title">
        <App />
      </UpdateEntry>
    );

    expect(html).toContain('SSR Title');
  });

  it('registers the update listener during render', () => {
    const on = vi.fn();

    function App() {
      return <div>SSR App</div>;
    }

    renderToString(
      <UpdateEntry on={on}>
        <App />
      </UpdateEntry>
    );

    expect(on).toHaveBeenCalledTimes(1);

    expect(on).toHaveBeenCalledWith(
      'update',
      expect.any(Function)
    );
  });

  it('passes all initial props to children', () => {
    const on = vi.fn();

    function App(props: any) {
      return (
        <div>
          {props.title} - {props.description}
        </div>
      );
    }

    const html = renderToString(
      <UpdateEntry
        on={on}
        title="SSR"
        description="Description"
      >
        <App />
      </UpdateEntry>
    );

    expect(html).toContain('SSR');
    expect(html).toContain('Description');
  });

  it('renders cloned child elements', () => {
    const on = vi.fn();

    const child = <div>SSR Child</div>;

    const html = renderToString(
      <UpdateEntry on={on}>
        {child}
      </UpdateEntry>
    );

    expect(html).toContain('SSR Child');
  });

  it('supports empty initial props', () => {
    const on = vi.fn();

    function App() {
      return <div>Empty Props</div>;
    }

    const html = renderToString(
      <UpdateEntry on={on}>
        <App />
      </UpdateEntry>
    );

    expect(html).toContain('Empty Props');
  });
});
