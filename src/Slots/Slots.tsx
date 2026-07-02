import { markComponent, SLOTS_COMPONENT } from './constants';
import type { SlotsProps } from './types';

/**
 * Marks a subtree as a slot boundary.
 *
 * `useSlots` treats nested `Slots` components as opaque children and does not
 * collect `Template` elements inside them. This lets composed slot-aware
 * components keep their own slot scope.
 *
 * @param props - Slot boundary props.
 * @returns The original children.
 *
 * @example
 * ```tsx
 * <Slots>
 *   <Template name="nested">Nested content</Template>
 * </Slots>
 * ```
 */
export function Slots(props: SlotsProps) {
  return props.children;
}

markComponent(Slots, SLOTS_COMPONENT);
