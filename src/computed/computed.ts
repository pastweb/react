import { useMemo, type DependencyList } from 'react';

/**
 * Memoizes the result of a computed value based on a dependency list.
 *
 * This is a lightweight wrapper around React's `useMemo` hook that provides
 * a more semantic API for derived or computed values.
 *
 * @typeParam T - The type of the computed value.
 *
 * @param fn - A function that computes and returns the memoized value.
 * @param deps - A dependency list that determines when the computed value
 * should be recalculated.
 *
 * @returns The memoized computed value.
 *
 * @remarks
 * The computation function will only be re-executed when one of the values
 * in the dependency list changes.
 *
 * @example
 * ```tsx
 * const total = computed(() => price * quantity, [price, quantity]);
 * ```
 *
 * @example
 * ```tsx
 * const filteredUsers = computed(() => users.filter((user) => user.active), [users]);
 * ```
 */
export function computed<T = any>(fn: () => T, deps: DependencyList): T {
  return useMemo(fn, deps);
}
