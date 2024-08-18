import { useContext } from '../../util';
import { portalAnchorsContext } from '../constants';
import { PortalAnchorsIds } from '@pastweb/tools';

export function usePortalAnchors<T>(): T {
  return useContext<PortalAnchorsIds>(portalAnchorsContext, 'portalAnchorsContext') as T;
}
