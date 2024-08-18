import { useRef } from 'react';
import { PortalTools } from '@pastweb/tools';
import { useBeforeMount } from '../../useBeforeMount';

export function usePortal(): PortalTools {
  const portal = useRef({});

  useBeforeMount(() => {
    const tools = {
      id: false,
    };
  
    Object.defineProperty(tools, '$$portalTools', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false,
    });

    portal.current = tools;
  });

  return portal.current as unknown as PortalTools;
}
