import { useRef as uR, type RefObject } from 'react';
import { useBeforeMount } from '../useBeforeMount';

/**
 * Creates a React ref with a `value` alias for `current`.
 *
 * Pastweb internals use `value` for cross-framework ref consistency, while the
 * returned object still behaves like a normal React ref.
 *
 * @typeParam T - Stored value type.
 * @param value - Initial ref value.
 * @returns React ref with a mutable `value` getter/setter.
 *
 * @example
 * ```tsx
 * const count = useRef(0);
 *
 * count.value += 1;
 * console.log(count.current);
 * ```
 */
export function useRef<T>(value: T): RefObject<T> & { value: T } {
  const ref = uR<T>(value);

  useBeforeMount(() => {
    Object.defineProperty(ref, 'value', {
      get: () => ref.current,
      set: (value: T) => { ref.current = value; },
    });
  });

  return ref as RefObject<T> & { value: T };
}
