import { forwardRef, memo, type ReactNode } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Slots, isSlot, isTemplate, Template, useSlots } from '../../src/Slots';

afterEach(() => {
  cleanup();
});

function Layout({ children }: { children: React.ReactNode }) {
  const { Slot } = useSlots(children);

  return (
    <>
      <main>
        <Slot />
      </main>
      <aside>
        <Slot name="sidebar" />
      </aside>
    </>
  );
}

describe('Slots', () => {
  it('given default children and a named Template, when rendered, then both slots appear', () => {
    render(
      <Layout>
        <p>Default content</p>
        <Template name="sidebar">
          <span>Sidebar content</span>
        </Template>
      </Layout>
    );

    expect(screen.getByText('Default content')).toBeInTheDocument();
    expect(screen.getByText('Sidebar content')).toBeInTheDocument();
  });

  it('given slot children change, when the host re-renders, then it collects the new content', () => {
    function DynamicLayout({ title }: { title: string }) {
      return (
        <Layout>
          <Template name="sidebar">
            <span>{title}</span>
          </Template>
          <p>Default content</p>
        </Layout>
      );
    }

    const { rerender } = render(<DynamicLayout title="First title" />);
    expect(screen.getByText('First title')).toBeInTheDocument();

    rerender(<DynamicLayout title="Second title" />);
    expect(screen.getByText('Second title')).toBeInTheDocument();
    expect(screen.queryByText('First title')).not.toBeInTheDocument();
  });

  it('given nested Slots, when the parent collects templates, then inner templates stay hidden', () => {
    render(
      <Layout>
        <Slots>
          <Template name="sidebar">
            <span>Nested sidebar</span>
          </Template>
        </Slots>
        <Template name="sidebar">
          <span>Outer sidebar</span>
        </Template>
      </Layout>
    );

    expect(screen.getByText('Outer sidebar')).toBeInTheDocument();
    expect(screen.queryByText('Nested sidebar')).not.toBeInTheDocument();
  });

  it('given a forwardRef host, when it wraps a named Template, then the parent still collects that template', () => {
    const ForwardHost = forwardRef<HTMLDivElement, { children?: ReactNode }>(
      function ForwardHost({ children }, ref) {
        return <div ref={ref}>{children}</div>;
      },
    );

    render(
      <Layout>
        <ForwardHost>
          <Template name="sidebar">
            <span>From forwardRef</span>
          </Template>
        </ForwardHost>
      </Layout>,
    );

    expect(screen.getByText('From forwardRef')).toBeInTheDocument();
  });

  it('given a memo host, when it wraps a named Template, then the parent still collects that template', () => {
    const MemoHost = memo(function MemoHost({ children }: { children?: ReactNode }) {
      return <div>{children}</div>;
    });

    render(
      <Layout>
        <MemoHost>
          <Template name="sidebar">
            <span>From memo</span>
          </Template>
        </MemoHost>
      </Layout>,
    );

    expect(screen.getByText('From memo')).toBeInTheDocument();
  });

  it('given a memoized forwardRef host, when it wraps a named Template, then the parent still collects that template', () => {
    const MemoForwardHost = memo(forwardRef<HTMLDivElement, { children?: ReactNode }>(
      function MemoForwardHost({ children }, ref) {
        return <div ref={ref}>{children}</div>;
      },
    ));

    render(
      <Layout>
        <MemoForwardHost>
          <Template name="sidebar">
            <span>From memo forwardRef</span>
          </Template>
        </MemoForwardHost>
      </Layout>,
    );

    expect(screen.getByText('From memo forwardRef')).toBeInTheDocument();
  });

  it('given a forwardRef host, when inner templates sit inside Slots, then the parent does not collect them', () => {
    const ForwardHost = forwardRef<HTMLDivElement, { children?: ReactNode }>(
      function ForwardHost({ children }, ref) {
        return <div ref={ref}>{children}</div>;
      },
    );

    render(
      <Layout>
        <ForwardHost>
          <Slots>
            <Template name="sidebar">
              <span>Hidden inside forwardRef</span>
            </Template>
          </Slots>
        </ForwardHost>
        <Template name="sidebar">
          <span>Outer sidebar</span>
        </Template>
      </Layout>,
    );

    expect(screen.getByText('Outer sidebar')).toBeInTheDocument();
    expect(screen.queryByText('Hidden inside forwardRef')).not.toBeInTheDocument();
  });

  it('given a memo host, when inner templates sit inside Slots, then the parent does not collect them', () => {
    const MemoHost = memo(function MemoHost({ children }: { children?: ReactNode }) {
      return <div>{children}</div>;
    });

    render(
      <Layout>
        <MemoHost>
          <Slots>
            <Template name="sidebar">
              <span>Hidden inside memo</span>
            </Template>
          </Slots>
        </MemoHost>
        <Template name="sidebar">
          <span>Outer sidebar</span>
        </Template>
      </Layout>,
    );

    expect(screen.getByText('Outer sidebar')).toBeInTheDocument();
    expect(screen.queryByText('Hidden inside memo')).not.toBeInTheDocument();
  });

  it('given nested slot-aware components, when wrapped in Slots, then each host collects its own templates', () => {
    function ParentPanel({ children }: { children: React.ReactNode }) {
      const { Slot } = useSlots(children);

      return (
        <section>
          <h1><Slot name="title" /></h1>
          <div><Slot /></div>
        </section>
      );
    }

    function ChildCard({ children }: { children: React.ReactNode }) {
      const { Slot } = useSlots(children);

      return (
        <article>
          <h2><Slot name="title" /></h2>
          <footer><Slot name="action" /></footer>
        </article>
      );
    }

    render(
      <ParentPanel>
        <Template name="title">Parent title</Template>
        <Slots>
          <ChildCard>
            <Template name="title">Child title</Template>
            <Template name="action">
              <button>Child action</button>
            </Template>
          </ChildCard>
        </Slots>
      </ParentPanel>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Parent title');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Child title');
    expect(screen.getByRole('button', { name: 'Child action' })).toBeInTheDocument();
  });

  it('given same-name templates in nested scopes, when each host is wrapped in Slots, then the names stay independent', () => {
    function Shell({ children }: { children: React.ReactNode }) {
      const { Slot } = useSlots(children);

      return (
        <div>
          <header data-testid="shell-header"><Slot name="header" /></header>
          <main><Slot /></main>
        </div>
      );
    }

    function Section({ children }: { children: React.ReactNode }) {
      const { Slot } = useSlots(children);

      return (
        <section>
          <header data-testid="section-header"><Slot name="header" /></header>
          <div data-testid="section-body"><Slot /></div>
        </section>
      );
    }

    function Tile({ children }: { children: React.ReactNode }) {
      const { Slot } = useSlots(children);

      return (
        <article>
          <header data-testid="tile-header"><Slot name="header" /></header>
          <div data-testid="tile-body"><Slot /></div>
        </article>
      );
    }

    render(
      <Shell>
        <Template name="header">Shell header</Template>
        <Slots>
          <Section>
            <Template name="header">Section header</Template>
            <Slots>
              <Tile>
                <Template name="header">Tile header</Template>
                <p>Tile body</p>
              </Tile>
            </Slots>
          </Section>
        </Slots>
      </Shell>
    );

    expect(screen.getByTestId('shell-header')).toHaveTextContent('Shell header');
    expect(screen.getByTestId('section-header')).toHaveTextContent('Section header');
    expect(screen.getByTestId('tile-header')).toHaveTextContent('Tile header');
    expect(screen.getByTestId('tile-body')).toHaveTextContent('Tile body');
    expect(screen.getByTestId('shell-header')).not.toHaveTextContent('Section header');
    expect(screen.getByTestId('section-header')).not.toHaveTextContent('Tile header');
  });

  it('given a Template with no name, when collected, then it fills the default slot', () => {
    render(
      <Layout>
        <Template>
          <strong>Template default</strong>
        </Template>
      </Layout>
    );

    expect(screen.getByText('Template default')).toBeInTheDocument();
  });

  it('given a missing named slot, when Slot has fallback children, then it renders the fallback', () => {
    function MissingSlot({ children }: { children: React.ReactNode }) {
      const { Slot } = useSlots(children);

      return <Slot name="missing">Fallback</Slot>;
    }

    render(<MissingSlot><span>Default</span></MissingSlot>);

    expect(screen.getByText('Fallback')).toBeInTheDocument();
  });

  it('given element slot content, when Slot injects props, then the element receives them', () => {
    function Badge({ label }: { label?: string }) {
      return <span>{label}</span>;
    }

    function PropsLayout({ children }: { children: React.ReactNode }) {
      const { Slot } = useSlots(children);

      return <Slot name="badge" props={{ label: 'Injected' }} />;
    }

    render(
      <PropsLayout>
        <Template name="badge">
          <Badge />
        </Template>
      </PropsLayout>
    );

    expect(screen.getByText('Injected')).toBeInTheDocument();
  });

  it('given a missing named slot, when Slot has map and fallback children, then it does not map the fallback', () => {
    function MapFallback({ children }: { children: React.ReactNode }) {
      const { Slot } = useSlots(children);

      return (
        <Slot
          name='status'
          map={content => <div role='status'>{content}</div>}
        >
          Loading...
        </Slot>
      );
    }

    render(<MapFallback><span>Default</span></MapFallback>);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('given projected slot content, when Slot maps it, then each item is wrapped', () => {
    function MapLayout({ children }: { children: React.ReactNode }) {
      const { Slot } = useSlots(children);

      return (
        <Slot
          name="items"
          map={(child, index) => <li>{index}:{child}</li>}
        />
      );
    }

    render(
      <MapLayout>
        <Template name="items">
          {['A', 'B']}
        </Template>
      </MapLayout>
    );

    expect(screen.getByText('0:A')).toBeInTheDocument();
    expect(screen.getByText('1:B')).toBeInTheDocument();
  });

  it('given collected slots, when they are forwarded through Template, then the next host renders them', () => {
    function Inner({ children }: { children: React.ReactNode }) {
      const { Slot } = useSlots(children);

      return (
        <>
          <h1><Slot name="header" /></h1>
          <main><Slot /></main>
        </>
      );
    }

    function Outer({ children }: { children: React.ReactNode }) {
      const { slots } = useSlots(children);

      return (
        <Inner>
          <Template name="header">{slots.header}</Template>
          <Template>{slots.default}</Template>
        </Inner>
      );
    }

    render(
      <Outer>
        <Template name="header">
          <span>Forwarded title</span>
        </Template>
        <p>Forwarded body</p>
      </Outer>
    );

    expect(screen.getByText('Forwarded title')).toBeInTheDocument();
    expect(screen.getByText('Forwarded body')).toBeInTheDocument();
  });

  it('given collected default content, when it is forwarded inside extra markup, then the inner host still renders it', () => {
    function Inner({ children }: { children: React.ReactNode }) {
      const { Slot } = useSlots(children);

      return (
        <article>
          <header><Slot name="header" /></header>
          <div data-testid="body"><Slot /></div>
        </article>
      );
    }

    function Outer({ children }: { children: React.ReactNode }) {
      const { slots, Slot } = useSlots(children);

      return (
        <Inner>
          <Template name="header">{slots.header}</Template>
          <Template>
            <div data-testid="scroll-area">
              <Slot />
            </div>
          </Template>
        </Inner>
      );
    }

    render(
      <Outer>
        <Template name="header">Account</Template>
        <p>Long body</p>
      </Outer>
    );

    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByTestId('scroll-area')).toHaveTextContent('Long body');
    expect(screen.getByTestId('body')).toContainElement(screen.getByTestId('scroll-area'));
  });

  it('given no named slot, when an empty slots entry is forwarded, then the inner host still renders its fallback', () => {
    function Inner({ children }: { children: React.ReactNode }) {
      const { Slot } = useSlots(children);

      return (
        <>
          <Slot name="header">Default title</Slot>
          <Slot />
        </>
      );
    }

    function Outer({ children }: { children: React.ReactNode }) {
      const { slots } = useSlots(children);

      return (
        <Inner>
          <Template name="header">{slots.header}</Template>
          <Template>{slots.default}</Template>
        </Inner>
      );
    }

    render(
      <Outer>
        <p>Body</p>
      </Outer>
    );

    expect(screen.getByText('Default title')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('given named templates, when useSlots collects them, then the slots map exposes those entries', () => {
    let collected: ReturnType<typeof useSlots>['slots'] | undefined;

    function Probe({ children }: { children: React.ReactNode }) {
      const { slots, Slot } = useSlots(children);
      collected = slots;
      return <Slot />;
    }

    render(
      <Probe>
        <Template name="header">Title</Template>
        <p>Body</p>
      </Probe>
    );

    expect(collected?.header).toBeDefined();
    expect(collected?.default).toBeDefined();
    expect(collected?.footer).toBeUndefined();
    expect(Array.isArray(collected?.header)).toBe(true);
    expect(Array.isArray(collected?.default)).toBe(true);
    expect(collected?.header).toHaveLength(1);
    expect(collected?.default).toHaveLength(1);
  });

  it('given a single child in a named Template, when useSlots collects it, then the slot value is an array of one node', () => {
    let collected: ReturnType<typeof useSlots>['slots'] | undefined;

    function Probe({ children }: { children: React.ReactNode }) {
      const { slots, Slot } = useSlots(children);
      collected = slots;
      return <Slot name="sidebar" />;
    }

    render(
      <Probe>
        <Template name="sidebar">
          <span>Only child</span>
        </Template>
      </Probe>
    );

    expect(Array.isArray(collected?.sidebar)).toBe(true);
    expect(collected?.sidebar).toHaveLength(1);
    expect(screen.getByText('Only child')).toBeInTheDocument();
  });

  it('given Template and Slot elements, when detection helpers run, then they identify the markers', () => {
    function Probe() {
      const { Slot } = useSlots(null);

      return (
        <>
          <span>{isTemplate(<Template name="x">X</Template>) ? 'template' : 'no-template'}</span>
          <span>{isSlot(<Slot />) ? 'slot' : 'no-slot'}</span>
        </>
      );
    }

    render(<Probe />);

    expect(screen.getByText('template')).toBeInTheDocument();
    expect(screen.getByText('slot')).toBeInTheDocument();
  });

  it('given mixed children, when Template.reduce and Template.only run, then they filter markers', () => {
    function Probe() {
      const { Slot } = useSlots(null);
      const reduced = Template.reduce([
        <span key="visible">Visible</span>,
        <Template key="template" name="hidden">Hidden</Template>,
        <Slot key="slot">Slot child</Slot>,
      ], child => child);
      const only = Template.only([
        <span key="ignored">Ignored</span>,
        <Template key="only" name="only">Only template</Template>,
      ]);
      const onlyText = Array.isArray(only) && isTemplate(only[0])
        ? only[0].props.children
        : null;

      return (
        <>
          <div data-testid="reduced">{reduced}</div>
          <div data-testid="only">{onlyText}</div>
        </>
      );
    }

    render(<Probe />);

    expect(screen.getByTestId('reduced')).toHaveTextContent('Visible');
    expect(screen.getByTestId('reduced')).not.toHaveTextContent('Hidden');
    expect(screen.getByTestId('reduced')).not.toHaveTextContent('Slot child');
    expect(screen.getByTestId('only')).toHaveTextContent('Only template');
    expect(screen.getByTestId('only')).not.toHaveTextContent('Ignored');
  });
});
