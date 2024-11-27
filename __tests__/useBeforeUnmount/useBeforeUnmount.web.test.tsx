import React from 'react';
import { render } from '@testing-library/react';
import { useBeforeUnmount } from '../../src/useBeforeUnmount';

const TestComponent = ({ callback }: { callback: () => void }) => {
    useBeforeUnmount(callback);
    return <div>Test Component</div>;
};

describe('useBeforeUnmount', () => {
    it('should call the callback function before the component unmounts', () => {
        const callback = jest.fn();

        // Render the component
        const { unmount } = render(<TestComponent callback={callback} />);

        // Unmount the component
        unmount();

        // Verify that the callback was called once before unmounting
        expect(callback).toHaveBeenCalledTimes(1);
    });
});
