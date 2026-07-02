import { cloneElement, Children } from 'react';
import { isTemplate } from './isTemplate';

/**
 * Returns only `Template` elements from a child collection.
 *
 * Used by `Template.only` to keep the public helper that extracts template
 * markers while ignoring ordinary children.
 *
 * @param children - Child or children to filter.
 * @returns Template children with stable keys when an array is supplied.
 */
export function templateOnly<T, C>(children: C | readonly C[]): C extends null | undefined ? C : Array<Exclude<T, boolean | null | undefined>> {
  if (!Array.isArray(children)) {
    return !isTemplate(children) ? null as any : children as any;
  }

  const result: Array<Exclude<T, boolean | null | undefined>> = [];

  Children.forEach(children, (child: C, index: number) => {
    if (isTemplate(child)) {
      result.push(cloneElement(child as any, { key: index }) as any);
    }
  });

  return result as any;
}
