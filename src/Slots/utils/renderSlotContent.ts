import { cloneElement, createElement, isValidElement, type ReactNode } from 'react';
import type { SlotFunction, SlotProps } from '../types';

/**
 * Renders one collected slot item.
 *
 * Function slots become React elements, element slots receive injected props,
 * and custom `map` callbacks can override rendering entirely.
 *
 * @param child - Collected slot content.
 * @param index - Child index inside the slot.
 * @param slotProps - Props to inject into element/function slot content.
 * @param map - Optional mapper from `SlotProps`.
 * @returns Renderable React content.
 */
export function renderSlotContent(
  child: ReactNode | SlotFunction,
  index: number,
  slotProps?: Record<string, any>,
  map?: SlotProps['map'],
): ReactNode | ReactNode[] {
  if (map) return map(child, index);
  if (typeof child === 'function') return createElement(child, slotProps);
  if (isValidElement(child) && slotProps && Object.keys(slotProps).length) {
    return cloneElement(child, slotProps);
  }

  return child;
}
