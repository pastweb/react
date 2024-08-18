import { MatchDevicesResult } from '@pastweb/tools';
export type { DevicesConfig, MatchDevicesResult } from '@pastweb/tools';

export type DevicesResult = {
  devices: MatchDevicesResult;
  onMatch: (isDeviceName: string, fn: (result: boolean, isDeviceName: string) => void) => void;
}
