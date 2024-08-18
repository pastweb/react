import { PortalsDescriptor } from '@pastweb/tools';
import { useContext } from '../../util';
import { portalsContext } from '../constants';

export function usePortals<T>(): T {
  return useContext<PortalsDescriptor>(portalsContext, 'portalsContext') as T;
}
