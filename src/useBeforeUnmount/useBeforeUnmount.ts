import { useEffect } from 'react';

/**
 * Custom hook that executes a function right before the component unmounts.
 *
 * @param fn - The function to be executed before the component unmounts.
 *
 * @example
 * // Example usage:
 * useBeforeUnmount(() => {
 *   console.log('Component is about to unmount');
 * });
 */
export const useBeforeUnmount = (fn: () => void): void => {
    useEffect((): (() => void) => fn, []);
}
