import { useState, useCallback } from 'react';

/**
 * Returns a stable function that forces the component to re-render.
 *
 * @returns Stable force-update callback.
 *
 * @example
 * ```tsx
 * const forceUpdate = useForceUpdate();
 *
 * return <button onClick={forceUpdate}>Refresh</button>;
 * ```
 */
export const useForceUpdate = (): (() => void) => {
  const [, setValue] = useState<Record<string, never>>({});

  return useCallback((): void => { setValue({}); }, []);
}
