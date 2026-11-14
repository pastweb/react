import { cloneElement, isValidElement, useCallback, type ReactNode } from 'react';
import { useRef } from '../useRef';
import { Slots } from './Slots';
import { markComponent, SLOT_COMPONENT } from './constants';
import { collectSlots, renderSlotContent } from './utils';
import type { SlotProps, UseSlotsResult } from './types';

/**
 * Collects default children and named `Template` children into renderable slots.
 *
 * The returned `Slot` component renders default content when no `name` is
 * supplied, renders fallback children when a named slot is missing, supports
 * `props` injection for element slot content, and supports `map` for
 * custom wrapping or transformation. `map` applies only to projected slot
 * content; fallback children are rendered as-is.
 *
 * @param defaultNodes - Children to scan for default content and `Template` markers.
 * @returns The slot boundary component, the collected slot renderer, and the
 *   `slots` map. Each present `slots` entry is an array of nodes, including
 *   when the slot has one child. Missing slots are `undefined`.
 *
 * @example
 * ```tsx
 * function ScrollPanel({ children }: { children: React.ReactNode }) {
 *   const { Slot, slots } = useSlots(children);
 *
 *   return (
 *     <Panel>
 *       <Template name="header">{slots.header}</Template>
 *       <Template>
 *         <div className="scroll-area">
 *           <Slot />
 *         </div>
 *       </Template>
 *     </Panel>
 *   );
 * }
 * ```
 */
export function useSlots(defaultNodes: ReactNode): UseSlotsResult {
  const slots = collectSlots(defaultNodes);
  const slotsRef = useRef(slots);
  slotsRef.current = slots;

  const Slot = useCallback(function Slot(props: SlotProps) {
    const { name = 'default', children, props: slotProps, map } = props;
    const slotContent = slotsRef.current[name];

    if (slotContent) {
      return slotContent.map((child, i) => {
        const rendered = renderSlotContent(child, i, slotProps, map);

        if (isValidElement(rendered) && rendered.key == null) {
          return cloneElement(rendered, { key: i });
        }

        return rendered;
      });
    }

    return children ? <>{children}</> : null;
  }, []);

  markComponent(Slot, SLOT_COMPONENT);

  return { Slots, Slot, slots };
}
