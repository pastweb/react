import { cloneElement, isValidElement, type ReactNode } from 'react';
import type { SlotProps } from '../types';

/**
 * Renders one collected slot item.
 *
 * Element slots receive injected props, and custom `map` callbacks can
 * override rendering entirely.
 *
 * @param child - Collected slot content.
 * @param index - Child index inside the slot.
 * @param slotProps - Props to inject into element slot content.
 * @param map - Optional mapper from `SlotProps`.
 * @returns Renderable React content.
 *
 * @example
 * ```ts
 * renderSlotContent(child, 0, { label: 'Save' });
 * ```
 */
export function renderSlotContent(
  child: ReactNode,
  index: number,
  slotProps?: Record<string, any>,
  map?: SlotProps['map'],
): ReactNode | ReactNode[] {
  if (map) return map(child, index);
  if (isValidElement(child) && slotProps && Object.keys(slotProps).length) {
    return cloneElement(child, slotProps);
  }

  return child;
}
