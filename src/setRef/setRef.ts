import { isObject } from '@pastweb/tools';
import type { MutableRefObject, ForwardedRef } from 'react';

/**
 * Utility function that sets the value of a ref, supporting both callback refs and `MutableRefObject`.
 *
 * @template T - The type of the ref's value.
 *
 * @param ref - The ref to be set, which can be a callback ref function or a `MutableRefObject`.
 * @param value - The value to be assigned to the ref.
 *
 * @example
 * // Using with a MutableRefObject:
 * const myRef = useRef<HTMLDivElement>(null);
 * setRef(myRef, someValue);
 *
 * // Using with a callback ref:
 * setRef((ref) => { console.log(ref); }, someValue);
 */
export function setRef<T>(ref: ForwardedRef<T> | MutableRefObject<T> | ((ref: T) => void), value: any): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (isObject(ref) && Object.hasOwn(ref as MutableRefObject<T>, 'current')) {
    (ref as MutableRefObject<T>).current = value;
  }
}
