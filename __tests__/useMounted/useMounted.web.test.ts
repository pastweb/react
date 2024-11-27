import { renderHook } from '@testing-library/react';
import { useMounted } from '../../src/useMounted';

describe('useMounted', () => {
    it('should call the effect callback once after mounting', () => {
        const effectCallback = jest.fn();

        const { unmount } = renderHook(() => useMounted(effectCallback));

        // Check that the effect callback is called once
        expect(effectCallback).toHaveBeenCalledTimes(1);

        // Unmount the component and check if the cleanup function is called
        unmount();
        expect(effectCallback).toHaveBeenCalledTimes(1); // The original effect should not be called again
    });

    it('should call the cleanup function when unmounted', () => {
        const cleanup = jest.fn();
        const effectCallback = jest.fn(() => cleanup);

        const { unmount } = renderHook(() => useMounted(effectCallback));

        // Check that the effect callback is called once
        expect(effectCallback).toHaveBeenCalledTimes(1);

        // Unmount the component
        unmount();

        // Check if the cleanup function is called
        expect(cleanup).toHaveBeenCalledTimes(1);
    });
});
