import { useCallback } from 'react';

/**
 * Custom hook that returns a memoized version of a function, ensuring that the function reference remains stable.
 *
 * @template T - The type of the function being memoized. It can be any function type.
 * 
 * @param fn - The function to be memoized. This function's reference will not change unless the component is unmounted.
 *
 * @returns The memoized version of the provided function.
 *
 * @example
 * // Example usage:
 * const memoizedFn = useFunction((value) => console.log(value));
 * memoizedFn('test'); // Logs: 'test'
 */
export const useFunction = <T extends (...args: any[]) => any>(fn: T): T => {
  return useCallback(fn, []);
};
