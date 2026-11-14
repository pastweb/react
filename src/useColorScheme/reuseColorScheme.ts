import { useEffect, useState } from 'react';
import type { ColorSchemeInfo, MatchScheme } from '@pastweb/tools';

/**
 * Creates a React hook bound to an existing tools `MatchScheme`.
 *
 * Use this when the scheme instance is created outside React (for example next
 * to a `createMatchSchemeAsyncStore`) and components should subscribe to it.
 *
 * @param matchScheme - Pre-created `MatchScheme` instance.
 * @returns A React hook that returns the current scheme info and a mode setter.
 *
 * @example
 * ```tsx
 * import { createMatchScheme } from '@pastweb/tools';
 * import { reuseColorScheme } from '@pastweb/react';
 *
 * const matchScheme = createMatchScheme({ defaultMode: 'auto' });
 * const useColorScheme = reuseColorScheme(matchScheme);
 *
 * function ThemeButton() {
 *   const [scheme, setMode] = useColorScheme();
 *
 *   return (
 *     <button onClick={() => setMode(scheme.selected === 'dark' ? 'light' : 'dark')}>
 *       Current theme: {scheme.selected}
 *     </button>
 *   );
 * }
 * ```
 */
export function reuseColorScheme(matchScheme: MatchScheme): () => [ColorSchemeInfo, (mode: string) => void] {
  return function useReusedColorScheme(): [ColorSchemeInfo, (mode: string) => void] {
    const [current, setCurrent] = useState<ColorSchemeInfo>(() => matchScheme.getInfo());

    useEffect(() => {
      const updateCurrent = () => setCurrent(matchScheme.getInfo());
      const modeListener = matchScheme.onModeChange(updateCurrent);
      const systemListener = matchScheme.onSysSchemeChange(updateCurrent);

      updateCurrent();

      return () => {
        modeListener.removeListener();
        systemListener.removeListener();
      };
    }, [matchScheme]);

    return [current, matchScheme.setMode];
  };
}
