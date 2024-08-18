import { useRef, useState } from 'react';
import { createMatchDevice } from '@pastweb/tools';
import { DevicesConfig, MatchDevicesResult, DevicesResult } from './types';

/**
 * Custom hook that manages device matching logic based on a provided configuration.
 *
 * @param config - An object defining the configuration for matching devices. 
 *                 This configuration is used to determine which devices are matched.
 *
 * @returns An object containing the current matched devices and a function to trigger a match manually.
 *
 * @example
 * // Example usage:
 * const { devices, onMatch } = useMatchDevice(myDevicesConfig);
 * console.log(devices); // Access the current matched devices
 * onMatch(); // Manually trigger the match logic
 */
export const useMatchDevice = (config: DevicesConfig): DevicesResult => {
  const match = useRef(createMatchDevice(config));
  const [devices, setDevices] = useState<MatchDevicesResult>(match.current.getDevices());

  match.current.onChange(devices => setDevices(devices));

  return Object.freeze({ devices, onMatch: match.current.onMatch });
}
