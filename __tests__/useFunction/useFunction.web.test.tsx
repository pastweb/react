import React, { act, useState, useEffect } from 'react';
import { render } from '@testing-library/react';
import { useFunction } from '../../src/useFunction';

const TestComponent = ({ callback }: { callback: (...args: any[]) => any }) => {
    const memoizedCallback = useFunction(callback);
    const [renderCount, setRenderCount] = useState(0);

    useEffect(() => {
        setRenderCount((prevCount) => prevCount + 1);
    }, []);

    return (
        <div>
            <span>Render Count: {renderCount}</span>
            <button onClick={() => memoizedCallback('test')}>Call Memoized Function</button>
        </div>
    );
};

describe('useFunction', () => {
    it('should return a stable function reference across renders', () => {
        const callback = jest.fn();

        // Render the component
        const { rerender, getByText } = render(<TestComponent callback={callback} />);

        // Save the initial memoized function reference
        const initialMemoizedCallback = callback.mock.calls[0]?.[0] || getByText('Call Memoized Function').click;

        // Trigger a re-render
        act(() => {
            rerender(<TestComponent callback={callback} />);
        });

        // Check that the memoized function reference remains the same after re-render
        const afterRerenderMemoizedCallback = callback.mock.calls[0]?.[0] || getByText('Call Memoized Function').click;
        expect(initialMemoizedCallback).toBe(afterRerenderMemoizedCallback);
    });

    it('should call the memoized function with the correct arguments', () => {
        const callback = jest.fn();

        // Render the component
        const { getByText } = render(<TestComponent callback={callback} />);

        // Call the memoized function
        act(() => {
            getByText('Call Memoized Function').click();
        });

        // Check that the callback was called with the correct argument
        expect(callback).toHaveBeenCalledWith('test');
    });
});
