import { MatchDevicesResult } from '@pastweb/tools';
export type { DevicesConfig, MatchDevicesResult } from '@pastweb/tools';

export type DevicesResult = {
  devices: MatchDevicesResult;
  onMatch: (deviceName: string, fn: (result: boolean, deviceName: string) => void) => void;
}
