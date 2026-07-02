import { cloneElement, isValidElement, useCallback, useState, type ReactNode, useEffect } from 'react';
import { useRef } from '../useRef';
import { Slots } from './Slots';
import { markComponent, SLOT_COMPONENT } from './constants';
import { collectSlots, isDifferentTree, renderSlotContent } from './utils';
import type { SlotProps } from './types';

/**
 * Collects default children and named `Template` children into renderable slots.
 *
 * The returned `Slot` component renders default content when no `name` is
 * supplied, renders fallback children when a named slot is missing, supports
 * `props` injection for element/function slot content, and supports `map` for
 * custom wrapping or transformation.
 *
 * @param defaultNodes - Children to scan for default content and `Template` markers.
 * @returns The slot boundary component and the collected slot renderer.
 *
 * @example
 * ```tsx
 * function Panel({ children }: { children: React.ReactNode }) {
 *   const { Slot } = useSlots(children);
 *
 *   return (
 *     <>
 *       <Slot name="title" />
 *       <Slot />
 *     </>
 *   );
 * }
 * ```
 */
export function useSlots(defaultNodes: ReactNode) {
  const prevDefaultNodes = useRef<ReactNode>(defaultNodes);
  const [slots, setSlots] = useState(() => collectSlots(defaultNodes));

  useEffect(() => {
    if (isDifferentTree(prevDefaultNodes.current, defaultNodes)) {
      setSlots(collectSlots(defaultNodes));
      prevDefaultNodes.current = defaultNodes;
    }
  }, [defaultNodes]);

  const Slot = useCallback(function Slot(props: SlotProps) {
    const { name = 'default', children, props: slotProps, map } = props;
    const slotContent = slots[name] ? Array.isArray(slots[name]) ? slots[name] : [slots[name]] : null;

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
  }, [slots]);

  markComponent(Slot, SLOT_COMPONENT);

  return { Slots, Slot };
}
