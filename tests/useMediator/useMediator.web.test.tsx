import { fireEvent, render, screen } from '@testing-library/react';
import { getContextUtils } from '@pastweb/tools';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { GlobalContext } from '../../src/GlobalContext';
import { useMediator } from '../../src/useMediator';

function themeMediator() {
  const { getContext } = getContextUtils();

  return {
    theme: getContext<string>('theme'),
  };
}

describe('useMediator', () => {
  it('given mediator context access, when the component rerenders, then React hook order remains stable', () => {
    function Probe() {
      const mediator = useMediator(themeMediator);
      const [count, setCount] = useState(0);

      return (
        <button onClick={() => setCount(value => value + 1)}>
          {mediator.theme}:{count}
        </button>
      );
    }

    render(
      <GlobalContext update={{ theme: 'dark' }}>
        <Probe />
      </GlobalContext>,
    );

    const button = screen.getByRole('button', { name: 'dark:0' });
    fireEvent.click(button);

    expect(screen.getByRole('button', { name: 'dark:1' })).toBeInTheDocument();
  });
});
