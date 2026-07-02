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
  it('renders default children and named Template content', () => {
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

  it('recollects slot content when children change', () => {
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

  it('keeps nested Slots boundaries opaque when collecting parent templates', () => {
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

  it('lets nested slot-aware components collect their own templates', () => {
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

  it('keeps same-name templates independent across multiple nested slot scopes', () => {
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

  it('uses Template without name as default content', () => {
    render(
      <Layout>
        <Template>
          <strong>Template default</strong>
        </Template>
      </Layout>
    );

    expect(screen.getByText('Template default')).toBeInTheDocument();
  });

  it('renders fallback children when a slot is missing', () => {
    function MissingSlot({ children }: { children: React.ReactNode }) {
      const { Slot } = useSlots(children);

      return <Slot name="missing">Fallback</Slot>;
    }

    render(<MissingSlot><span>Default</span></MissingSlot>);

    expect(screen.getByText('Fallback')).toBeInTheDocument();
  });

  it('passes slot props to element content', () => {
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

  it('renders function slot content with slot props', () => {
    function PropsLayout({ children }: { children: React.ReactNode }) {
      const { Slot } = useSlots(children);

      return <Slot name="action" props={{ label: 'Run' }} />;
    }

    render(
      <PropsLayout>
        <Template name="action">
          {({ label }: { label?: string } = {}) => <button>{label}</button>}
        </Template>
      </PropsLayout>
    );

    expect(screen.getByRole('button', { name: 'Run' })).toBeInTheDocument();
  });

  it('supports mapping slot content', () => {
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

  it('marks Template and returned Slot components for detection helpers', () => {
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

  it('keeps Template.reduce and Template.only helpers working', () => {
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
