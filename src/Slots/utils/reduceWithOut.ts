import { Children } from 'react';
import { isSlot } from './isSlot';
import { isTemplate } from './isTemplate';

/**
 * Maps children while excluding `Slot` and `Template` marker elements.
 *
 * Used by `Template.reduce` to preserve the public helper that filters slot
 * markers out of mixed children collections.
 *
 * @param children - Child or children to reduce.
 * @param fn - Mapper called for every non-slot child.
 * @returns The mapped children.
 */
export function reduceWithOut<T, C>(children: C | readonly C[], fn: (child: C, index: number) => T): C extends null | undefined ? C : Array<Exclude<T, boolean | null | undefined>> {
  if (!Array.isArray(children)) {
    return !isSlot(children) && !isTemplate(children) ? fn(children as C, 0) as any : null as any;
  }

  const result: Array<Exclude<T, boolean | null | undefined>> = [];

  Children.forEach(children, (child: C, index: number) => {

    switch (child) {
      case null:
      case undefined:
        return;
      default:
        if (isSlot(child) || isTemplate(child)) return;
        break;
    }

    const value = fn(child, index);
    result.push(value as Exclude<T, boolean | null | undefined>);
  });

  return result as any;
}
