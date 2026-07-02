import { isValidElement, type ReactNode, type ReactElement } from 'react';
import { propsDiffer } from './propsDiffer';

/**
 * Recursively checks if two ReactNode trees are structurally different.
 *
 * - Primitives: strict equality
 * - Arrays: length + recursive item diff
 * - Elements: type + key + props (shallow, ignoring children) + recursive children diff
 *
 * @param a - Previous React node tree.
 * @param b - Next React node tree.
 * @returns `true` when the trees differ, otherwise `false`.
 */
export function isDifferentTree(a: ReactNode, b: ReactNode): boolean {
  if (a === b) return false;

  // Type mismatch
  if (typeof a !== typeof b) return true;

  // Array case
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return true;
    for (let i = 0; i < a.length; i++) {
      if (isDifferentTree(a[i], b[i])) return true;
    }
    return false;
  }

  // Primitive / non-element (text, number, etc.)
  if (!isValidElement(a) || !isValidElement(b)) {
    return a !== b;
  }

  // Element case: check type, key, props (ignoring children)
  if (a.type !== b.type || a.key !== b.key) return true;

  if (propsDiffer(a.props, b.props)) return true;

  // Recurse on children (the subtree)
  return isDifferentTree((a as ReactElement<any>).props.children, (b as ReactElement<any>).props.children);
}
