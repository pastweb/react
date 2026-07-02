/** Marker used to identify `Slot` components created by `useSlots`. */
export const SLOT_COMPONENT = Symbol.for('@pastweb/react.slot');

/** Marker used to identify `Slots` boundary components. */
export const SLOTS_COMPONENT = Symbol.for('@pastweb/react.slots');

/** Marker used to identify `Template` slot marker components. */
export const TEMPLATE_COMPONENT = Symbol.for('@pastweb/react.template');

/**
 * Adds a non-enumerable marker to a component function.
 *
 * The marker lets slot helpers detect components reliably after re-exports,
 * wrapping, or test-local component creation.
 *
 * @param component - Component function to mark.
 * @param marker - Symbol marker to attach.
 * @returns The same component function.
 */
export function markComponent<T extends Function>(component: T, marker: symbol): T {
  if (!Object.hasOwn(component, marker)) {
    Object.defineProperty(component, marker, { value: true });
  }

  return component;
}
