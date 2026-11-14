import { useMemo } from 'react';
import { createMatchScheme } from '@pastweb/tools';
import type { ColorSchemeInfo, SchemeOptions } from '@pastweb/tools';
import { reuseColorScheme } from './reuseColorScheme';

/**
 * React hook for reading and updating the current color scheme.
 *
 * Creates an internal `MatchScheme` with `createMatchScheme` and subscribes to
 * mode and system changes so the component re-renders. To bind an existing
 * `MatchScheme`, use {@link reuseColorScheme}.
 *
 * @param options - Options passed to `createMatchScheme`.
 * @returns A tuple with the current color scheme info and the mode setter.
 *
 * @example
 * ```tsx
 * import { useColorScheme } from '@pastweb/react';
 *
 * function ThemeButton() {
 *   const [scheme, setMode] = useColorScheme({ defaultMode: 'auto' });
 *
 *   return (
 *     <button onClick={() => setMode(scheme.selected === 'dark' ? 'light' : 'dark')}>
 *       Current theme: {scheme.selected}
 *     </button>
 *   );
 * }
 * ```
 */
export function useColorScheme(options: SchemeOptions = {}): [ColorSchemeInfo, (mode: string) => void] {
  const useReusedColorScheme = useMemo(
    () => reuseColorScheme(createMatchScheme(options)),
    [options.defaultMode, options.datasetName],
  );

  return useReusedColorScheme();
}
