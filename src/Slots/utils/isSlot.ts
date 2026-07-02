import { isValidElement } from 'react';
import { SLOT_COMPONENT } from '../constants';

/**
 * Checks whether a React element is a `Slot` component returned from `useSlots`.
 *
 * @param target - Value to inspect.
 * @returns `true` when the value is a Slot element.
 */
export function isSlot(target: any): boolean {
  if (!isValidElement(target)) return false;

  const type = target.type as Record<PropertyKey, any> | Function;

  return Boolean(
    (type as Record<PropertyKey, any>)[SLOT_COMPONENT]
    || (typeof type === 'function' && type.name === 'Slot')
  );
}
