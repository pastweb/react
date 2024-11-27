import React, { act, useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { useForceUpdate } from '../../src/useForceUpdate';

const TestComponent = () => {
  const forceUpdate = useForceUpdate();
  const count = useRef<number>(0);
  count.current = count.current + 1;

  return (
    <div>
      <span>Render Count: {count.current}</span>
      <button onClick={forceUpdate}>Force Update</button>
    </div>
  );
};

describe('useForceUpdate', () => {
  it('should force the component to re-render when the returned function is called', () => {
    // Render the component
    render(<TestComponent />);

    // Check initial render count
    expect(screen.getByText(/Render Count:/).textContent).toBe('Render Count: 1');

    // Trigger a re-render using the forceUpdate function
    act(() => {
      screen.getByText('Force Update').click();
    });

    // Check that the render count increased by 1
    expect(screen.getByText(/Render Count:/).textContent).toBe('Render Count: 2');
  });
});
