import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Slots } from '../Slots';
import { Template } from '../Template';
import { SLOTS_COMPONENT, TEMPLATE_COMPONENT } from '../constants';
import type { SlotsMap, TemplateProps } from '../types';

/**
 * Walks a React subtree and fills the provided slot maps.
 *
 * This stops at nested `Slots` hosts and intrinsic DOM elements so parent
 * collectors do not steal slot content from nested slot-aware components.
 * `forwardRef` and `memo` wrappers are not boundaries; collection keeps
 * walking their declared `props.children`.
 */
function traverse(
  node: ReactNode,
  slots: SlotsMap,
  defaultNodes: ReactNode[],
): void {
  if (node == null) return;
  if (Array.isArray(node)) {
    node.forEach(node => traverse(node, slots, defaultNodes));
    return;
  }
  if (!isValidElement(node)) {
    defaultNodes.push(node);
    return;
  }

  const el = node as ReactElement<TemplateProps>;

  if (
    el.type === Slots ||
    (el.type as Record<PropertyKey, any>)[SLOTS_COMPONENT] ||
    typeof el.type === 'string'
  ) {
    defaultNodes.push(el);
    return;
  }

  if (el.type === Template || (el.type as Record<PropertyKey, any>)[TEMPLATE_COMPONENT]) {
    const slotName = el.props.name ?? 'default';
    const component = el.props.children;

    if (slotName === 'default') {
      if (Array.isArray(component)) defaultNodes.push(...component);
      else if (component !== undefined) defaultNodes.push(component);
      return;
    }
    if (slots[slotName] !== undefined || component === undefined) return;

    slots[slotName] = Array.isArray(component) ? component : [component];
    return;
  }

  if (el.props?.children) {
    Children.forEach(el.props.children as ReactNode, child => traverse(child, slots, defaultNodes));
  }

  if (!el.props?.children) defaultNodes.push(el);
}

/**
 * Collects default content and named `Template` content from a React subtree.
 *
 * @param children - Children passed to a slot-aware component.
 * @returns A map keyed by slot name. Each present slot is an array of nodes.
 *
 * @example
 * ```tsx
 * const slots = collectSlots(children);
 * const title = slots.title; // ReactNode[] | undefined
 * const body = slots.default; // ReactNode[] | undefined
 * ```
 */
export function collectSlots(children: ReactNode): SlotsMap {
  const slots: SlotsMap = {};
  const defaultNodes: ReactNode[] = [];

  Children.forEach(children, child => traverse(child, slots, defaultNodes));

  if (defaultNodes.length) {
    slots['default'] = defaultNodes;
  }

  return slots;
}
