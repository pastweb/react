import { useEffect, useMemo, useState } from 'react';
import { createMatchScheme } from '@pastweb/tools';
import type { ColorSchemeInfo, MatchScheme, SchemeOptions } from '@pastweb/tools';

/**
 * React hook for reading and updating the current color scheme.
 *
 * The signature mirrors `useColorScheme` from `@pastweb/tools`: pass options to
 * create an internal `MatchScheme`, or pass a pre-created `matchScheme` as the
 * second argument. The React wrapper subscribes to mode/system changes and
 * cleans those listeners up when the component unmounts.
 *
 * @param options - Options passed to `createMatchScheme` when `matchScheme` is not provided.
 * @param matchScheme - Optional pre-created `MatchScheme` instance.
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
export function useColorScheme(options: SchemeOptions = {}, matchScheme?: MatchScheme): [ColorSchemeInfo, (mode: string) => void] {
  const scheme = useMemo(
    () => matchScheme ?? createMatchScheme(options),
    [matchScheme, options.defaultMode, options.datasetName],
  );
  const [current, setCurrent] = useState<ColorSchemeInfo>(() => scheme.getInfo());

  useEffect(() => {
    const updateCurrent = () => setCurrent(scheme.getInfo());
    const modeListener = scheme.onModeChange(updateCurrent);
    const systemListener = scheme.onSysSchemeChange(updateCurrent);

    updateCurrent();

    return () => {
      modeListener.removeListener();
      systemListener.removeListener();
    };
  }, [scheme]);

  return [current, scheme.setMode];
}
