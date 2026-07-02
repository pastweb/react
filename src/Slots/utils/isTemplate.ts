import { isValidElement } from 'react';
import { TEMPLATE_COMPONENT } from '../constants';

/**
 * Checks whether a React element is a `Template` marker.
 *
 * @param target - Value to inspect.
 * @returns `true` when the value is a Template element.
 */
export function isTemplate(target: any): boolean {
  if (!isValidElement(target)) return false;

  const type = target.type as Record<PropertyKey, any> | Function;

  return Boolean(
    (type as Record<PropertyKey, any>)[TEMPLATE_COMPONENT]
    || (typeof type === 'function' && type.name === 'Template')
  );
}
