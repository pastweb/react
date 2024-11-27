import React from 'react';
import { render } from '@testing-library/react';
import { useBeforeMount } from '../../src/useBeforeMount';

const TestComponent = ({ callback }: { callback: () => void }) => {
    useBeforeMount(callback);
    return <div>Test Component</div>;
};

describe('useBeforeMount', () => {
    it('should call the callback function before the component mounts', () => {
        const callback = jest.fn();

        // Render the component
        render(<TestComponent callback={callback} />);

        // Check if the callback is called once
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should only call the callback function once', () => {
        const callback = jest.fn();

        // Render the component twice
        const { rerender } = render(<TestComponent callback={callback} />);
        rerender(<TestComponent callback={callback} />);

        // The callback should still only be called once
        expect(callback).toHaveBeenCalledTimes(1);
    });
});
