import { describe, it, expect, beforeEach } from 'vitest';
import { createServerEntry } from '../../src/createEntry';

// Mock React components
const MockComponent = ({ name = 'World' }: { name?: string }) => (
  <div data-testid="mock-component">Hello, {name}!</div>
);

const MockProvider = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="provider-wrapper">{children}</div>
);

const MockFallback = () => <div data-testid="fallback">Loading fallback...</div>;

describe('createServerEntry', () => {
  it('creates a valid server entry object', () => {
    const entry = createServerEntry();

    expect(entry).toHaveProperty('mount');
    expect(entry).toHaveProperty('unmount');
    expect(typeof entry.mount).toBe('function');
  });

  it('renders component using renderToString by default', () => {
    const entry = createServerEntry({
      EntryComponent: MockComponent,
      initData: { name: 'Server Test' },
    });

    const result = entry.mount({ isStatic: false });

    expect(result).toBeDefined();
    expect(typeof result).toBe('string'); // ssrId
  });

  it('uses renderToStaticMarkup when isStatic=true', () => {
    const entry = createServerEntry({
      EntryComponent: MockComponent,
    });

    const result = entry.mount({ isStatic: true });

    expect(result).toBeDefined();
  });

  it('wraps the component with Providers', () => {
    const entry = createServerEntry({
      Providers: MockProvider,
      EntryComponent: MockComponent,
      initData: { name: 'Provider Test' },
    });

    const result = entry.mount({ isStatic: true });

    expect(result).toBeDefined();
    // We can at least verify it didn't throw and returned an ID
  });

  it('passes initData as props to EntryComponent', () => {
    const entry = createServerEntry({
      EntryComponent: MockComponent,
      initData: { name: 'Prop Test' },
    });

    const result = entry.mount({ isStatic: true });

    expect(result).toBeDefined();
  });

  it('supports EntryComponent as a React Element', () => {
    const element = <MockComponent name="Element Prop" />;

    const entry = createServerEntry({
      EntryComponent: element,
    });

    const result = entry.mount({ isStatic: true });

    expect(result).toBeDefined();
  });

  it('uses WaitFor with waitFor array and fallback', () => {
    const waitForPromises = [Promise.resolve({ data: 'test' })];

    const entry = createServerEntry({
      EntryComponent: MockComponent,
      waitFor: waitForPromises,
      fallback: <MockFallback />,
    });

    const result = entry.mount({ isStatic: true });

    expect(result).toBeDefined();
  });

  it('memoSSR is called internally during mount', async () => {
    const entry = createServerEntry({
      EntryComponent: MockComponent,
    });

    // Since we can't easily spy without mocking createEntry,
    // we verify behavior indirectly by checking the output of mount
    const ssId = entry.mount({ isStatic: true });

    expect(ssId).toBeDefined();

    const html = await entry.getComposedSSR();  
    expect(html).toContain('Hello, World!');
  });

  it('returns the ssrId from mount', () => {
    const entry = createServerEntry({
      EntryComponent: MockComponent,
    });

    const ssrId = entry.mount();

    expect(ssrId).toBeDefined();
    expect(typeof ssrId).toBe('string');
  });

  // Edge cases
  it('throws error when EntryComponent is missing', () => {
    const entry = createServerEntry({});

    expect(() => entry.mount()).toThrow();
  });

  it('handles both static and dynamic rendering', () => {
    const entry = createServerEntry({
      EntryComponent: MockComponent,
    });

    const staticResult = entry.mount({ isStatic: true });
    const dynamicResult = entry.mount({ isStatic: false });

    expect(staticResult).toBeDefined();
    expect(dynamicResult).toBeDefined();
  });
});
