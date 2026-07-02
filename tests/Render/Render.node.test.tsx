import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Render } from '../../src/Render';

function Message({ text, tone = 'neutral' }: { text: string; tone?: string }) {
  return <span data-tone={tone}>{text}</span>;
}

describe('Render', () => {
  it('renders string content directly', () => {
    expect(renderToStaticMarkup(<Render content="Ready" />)).toBe('Ready');
  });

  it('renders number content directly', () => {
    expect(renderToStaticMarkup(<Render content={42} />)).toBe('42');
  });

  it('clones React element content with provided props', () => {
    const html = renderToStaticMarkup(
      <Render
        content={<Message text="Initial" tone="neutral" />}
        props={{ text: 'Updated', tone: 'success' }}
      />
    );

    expect(html).toBe('<span data-tone="success">Updated</span>');
  });

  it('renders component content with provided props', () => {
    const html = renderToStaticMarkup(
      <Render
        content={Message}
        props={{ text: 'Created', tone: 'warning' }}
      />
    );

    expect(html).toBe('<span data-tone="warning">Created</span>');
  });
});
