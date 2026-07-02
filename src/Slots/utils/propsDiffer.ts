/**
 * Returns `true` if the two objects are different in any of the following ways:
 * - different number of own enumerable keys
 * - different set of key names
 * - different values for the same key (shallow comparison using !==)
 *
 * Returns `false` if they have exactly the same keys and the same values.
 *
 * @param a - first object
 * @param b - second object
 * @returns `true` if they are different, `false` if they are equivalent
 */
export function propsDiffer(a: unknown, b: unknown): boolean {
  // Quick identity check
  if (a === b) return false;

  // Both must be non-null objects
  if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') {
    return true;
  }

  const keysA = Object.keys(a).filter(k => k !== 'children');
  const keysB = Object.keys(b).filter(k => k !== 'children');

  // Different number of keys → different
  if (keysA.length !== keysB.length) {
    return true;
  }

  // Check that every key in A exists in B and has the same value
  for (const key of keysA) {
    if (!(key in b) || (a as any)[key] !== (b as any)[key]) {
      return true;
    }
  }

  // If we got here → same keys, same values
  return false;
}
