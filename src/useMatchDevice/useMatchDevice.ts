import { useEffect, useState } from 'react';
import { createMatchDevice, type MatchDevice } from '@pastweb/tools';
import { useBeforeMount } from '../useBeforeMount';
import { useRef } from '../useRef';
import type { DevicesConfig, MatchDevicesResult, DevicesResult } from './types';

/**
 * Tracks device matches with the tools `createMatchDevice` helper.
 *
 * @param config - Device match configuration.
 *
 * @returns Current device matches and a per-device match listener helper.
 *
 * @example
 * ```tsx
 * const { devices, onMatch } = useMatchDevice({
 *   phone: { mediaQuery: '(max-width: 640px)' },
 * });
 *
 * useMounted(() => {
 *   onMatch('phone', matches => console.log(matches));
 * });
 * ```
 */
export const useMatchDevice = (config: DevicesConfig): DevicesResult => {
  const match = useRef<MatchDevice | null>(null);

  useBeforeMount(() => {
    match.value = createMatchDevice(config);
  });

  const matches = match.value as MatchDevice;
  const [devices, setDevices] = useState<MatchDevicesResult>(matches.getDevices());

  useEffect(() => {
    matches.onChange(devices => setDevices(devices));
  }, [matches]);

  return Object.freeze({ devices, onMatch: matches.onMatch });
}
