import { useRef } from 'react';

/**
 * Custom hook that executes a function once before the component mounts.
 * 
 * This hook ensures that the provided function is called only once, 
 * before the component's initial render.
 *
 * @param fn - The function to be executed before the component mounts.
 *
 * @example
 * // Example usage:
 * useBeforeMount(() => {
 *   console.log('Component is about to mount');
 * });
 */
export const useBeforeMount = (fn: () => void): void => {
    const isFunctionCalled = useRef(false);

    if (!isFunctionCalled.current) {
        fn();
        isFunctionCalled.current = true;
    }
}
