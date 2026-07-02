import { describe, expect, it } from 'vitest';
import { withDefaultProps } from '../../src/withDefaultProps';

describe('withDefaultProps', () => {
  it('fills undefined props from defaults', () => {
    const props = withDefaultProps(
      { tone: undefined },
      { tone: 'neutral', size: 'md' },
    );

    expect(props).toEqual({
      tone: 'neutral',
      size: 'md',
    });
  });

  it('keeps explicitly provided values', () => {
    const props = withDefaultProps(
      { tone: 'accent' },
      { tone: 'neutral', size: 'md' },
    );

    expect(props).toEqual({
      tone: 'accent',
      size: 'md',
    });
  });
});
