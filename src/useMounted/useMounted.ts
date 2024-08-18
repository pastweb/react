import { useEffect, EffectCallback } from 'react';

/**
 * Custom hook that runs the provided effect callback only once, after the component is mounted.
 *
 * @param fn - The effect callback function to be executed after the component is mounted.
 *             This function should optionally return a cleanup function, or `undefined`.
 *
 * @example
 * // Example usage:
 * useMounted(() => {
 *   console.log('Component mounted');
 *   return () => {
 *     console.log('Component will unmount');
 *   };
 * });
 */
export const useMounted = (fn: EffectCallback): void  => {
    useEffect(fn, []);
}
