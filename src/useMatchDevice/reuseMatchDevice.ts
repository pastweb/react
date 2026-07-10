import { useReactiveRender } from '../api/hooks/utils';
import type { DevicesResult } from './types';

/**
 * Reuses a tools `useMatchDevice` reactive state inside React rendering.
 *
 * The tools state is created outside React with `@pastweb/tools/useMatchDevice`.
 * `reuseMatchDevice` keeps that same state object and subscribes React rendering
 * to its reactive fields.
 *
 * @param matchDevice - Reactive `DevicesResult` returned by `@pastweb/tools/useMatchDevice`.
 * @returns The same device result object, connected to React rendering.
 *
 * @example
 * ```tsx
 * import { useMatchDevice as createToolsMatchDevice } from '@pastweb/tools';
 * import { reuseMatchDevice } from '@pastweb/react';
 *
 * const deviceState = createToolsMatchDevice({
 *   phone: { mediaQuery: '(max-width: 640px)' },
 * });
 *
 * function Navigation() {
 *   const { devices } = reuseMatchDevice(deviceState);
 *
 *   return devices.phone ? <MobileNav /> : <DesktopNav />;
 * }
 * ```
 */
export function reuseMatchDevice(matchDevice: DevicesResult): DevicesResult {
  return useReactiveRender(() => matchDevice);
}
