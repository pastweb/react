import { useState, useCallback } from 'react';

/**
 * Custom hook that forces a component to re-render.
 *
 * @returns A function that, when called, forces the component to re-render.
 *
 * @example
 * // Example usage:
 * const forceUpdate = useForceUpdate();
 * // Later in your component:
 * forceUpdate(); // This will cause the component to re-render
 */
export const useForceUpdate = (): (() => void) => {
    const [, setValue] = useState<Record<string, never>>({});

    return useCallback((): void => { setValue({}); }, []);
}
