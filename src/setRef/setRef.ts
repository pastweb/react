import type { MutableRefObject, Ref } from 'react';

function isRefObject<T>(ref: unknown): ref is MutableRefObject<T | null> {
  return !!ref && typeof ref === 'object' && Object.hasOwn(ref, 'current');
}

/**
 * Assigns a value to an object ref or callback ref.
 *
 * This is useful in components that need to keep an internal ref while also
 * forwarding the same node to a consumer-provided ref.
 *
 * @typeParam T - Ref value type.
 * @param ref - React ref to update. `null` and unsupported values are ignored.
 * @param value - Value assigned to the ref. Pass `null` when clearing it.
 *
 * @example
 * ```tsx
 * const localRef = useRef<HTMLDivElement | null>(null);
 *
 * const assignRef = useCallback((node: HTMLDivElement | null) => {
 *   localRef.current = node;
 *   setRef(forwardedRef, node);
 * }, [forwardedRef]);
 * ```
 */
export function setRef<T>(ref: Ref<T> | MutableRefObject<T | null> | null | undefined, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (isRefObject<T>(ref)) {
    ref.current = value;
  }
}
