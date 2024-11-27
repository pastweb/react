import { renderHook } from '@testing-library/react';
import { UA_MOBILE_DEFAULT_RE, DevicesConfig, MatchDevicesResult } from '@pastweb/tools';
import { setUserAgent, MatchMedia } from './util';
import { useMatchDevice, DevicesResult } from '../../src/useMatchDevice';

let matchMedia: MatchMedia;

const testUA = [
  'iPad',
  'iPhone',
  'iPod',
  'blackberry',
  'Android',
  'windows phone',
  'Windows Phone'
];

const devicesConfig: DevicesConfig = {
  mobile: { uaTest: UA_MOBILE_DEFAULT_RE },
  phone: { mediaQuery: '(max-width: 320px)' },
  tablet: { mediaQuery: '(max-width: 600px)' },
  desktop: { mediaQuery: '(max-width: 1024px)' },
  tv: { mediaQuery: '(min-width: 1025px)' },
  iPad: { uaTest: /iPad/, },
  iPhone: { uaTest: /iPhone/ },
  iPod: { uaTest: /iPod/ },
  blackberry: { uaTest: /blackberry/ },
  Android: { uaTest: /Android/ },
  'windows phone': { uaTest: /(W|w)indows (P|p)hone/ },
  'Windows Phone': { uaTest: /(W|w)indows (P|p)hone/ },
};

describe('useMatchDevice - web', () => {
  beforeAll(() => {
    matchMedia = new MatchMedia();
  });

  beforeEach(() => {
    setUserAgent();
  });
 
  afterEach(() => {
    matchMedia.clear();
  });

  describe('devicesConfig', () => {
    it.each(Object.entries(devicesConfig))(`the property "$s" in devices result Object sould be true`, (device, config) => {
      setUserAgent(device === 'mobile'? 'iPhone' : device);
      const { mediaQuery, uaTest } = config;

      if (!mediaQuery && uaTest) {
        const { result } = renderHook(() => useMatchDevice(devicesConfig));
        const { devices } = result.current as DevicesResult;
        expect(devices[device]).toBe(true);
      }
    });

    it.each(Object.entries(devicesConfig))(`for the device "%s" the mediaQuery should match so should be true`, (device, config) => {
      const { mediaQuery, uaTest } = config;

      if (mediaQuery && !uaTest) {
        matchMedia = new MatchMedia(mediaQuery);

        const { result } = renderHook(() => useMatchDevice(devicesConfig));
        const { devices } = result.current as DevicesResult;

        expect(devices[device]).toBe(true);
      }
    });

    it.each(Object.entries(devicesConfig))(`for the device "%s" the mediaQuery listener should be called.`, (device, config) => {
      const { mediaQuery, uaTest } = config;

      if (mediaQuery && !uaTest) {
        let matchResult: MatchDevicesResult = {};
        
        const onMediaQueryChange = jest.fn().mockImplementation((result: boolean, deviceName: string) => {
          matchResult = { [deviceName]: result };
        });
        
        const { result } = renderHook(() => useMatchDevice(devicesConfig));
        const { devices, onMatch } = result.current as DevicesResult;
        onMatch(device, onMediaQueryChange);
        
        matchMedia.useMediaQuery(mediaQuery);

        expect(onMediaQueryChange).toHaveBeenCalledTimes(1);
      }
    });
  });
});
