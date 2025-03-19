import { useRef, useState } from 'react';
import { MatchScheme, ColorSchemeInfo, RemoveListener } from '@pastweb/tools';
import { useBeforeUnmount } from '../useBeforeUnmount';

/**
 * Creates a React hook for managing and tracking color scheme changes.
 *
 * This function returns a custom hook that provides the current color scheme
 * and a function to update the color mode. It listens for changes in the
 * system's preferred color scheme and user-selected mode.
 *
 * @param matchScheme - An instance of `MatchScheme` responsible for managing color scheme detection.
 * 
 * @returns A React hook that provides:
 * - A tuple containing the current color scheme information (`ColorSchemeInfo`).
 * - A function to update the color mode.
 *
 * @example
 * // Example usage:
 * const useColorScheme = createUseColorScheme(matchScheme);
 * const [scheme, setMode] = useColorScheme();
 * 
 * console.log(scheme.selected); // Outputs the currently selected color scheme
 * setMode('dark'); // Updates the mode to 'dark'
 */
export function createUseColorScheme(matchScheme: MatchScheme): () => ([ColorSchemeInfo, (mode: string) => void]) {
  return () => {
    /** Ref to store the match scheme instance */
    const scheme = useRef<MatchScheme>(matchScheme);

    /** State to track the current color scheme */
    const [current, setCurrent] = useState(scheme.current.getInfo());

    /** Listener for mode change events */
    const onModeChange = useRef<RemoveListener>(
      scheme.current.onModeChange(() => setCurrent(scheme.current.getInfo()))
    );

    /** Listener for system color scheme changes */
    const onSysChange = useRef<RemoveListener>(
      scheme.current.onSysSchemeChange(() => setCurrent(scheme.current.getInfo()))
    );

    /** Cleanup listeners before unmounting */
    useBeforeUnmount(() => {
      onModeChange.current.removeListener();
      onSysChange.current.removeListener();
    });

    return [current, scheme.current.setMode];
  };
}
