import type { MatchDevicesResult } from '@pastweb/tools';

export type { DevicesConfig, MatchDevicesResult } from '@pastweb/tools';

/**
 * Result returned by {@link useMatchDevice}.
 */
export type DevicesResult = {
  /** Current match result for each configured device. */
  devices: MatchDevicesResult;
  /** Registers a callback for a specific device match change. */
  onMatch: (deviceName: string, fn: (result: boolean, deviceName: string) => void) => void;
}
