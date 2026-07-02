import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Slots } from '../Slots';
import { Template } from '../Template';
import { SLOTS_COMPONENT, TEMPLATE_COMPONENT } from '../constants';
import type { SlotContent, SlotFunction, TemplateProps } from '../types';

/**
 * Walks a React subtree and fills the provided slot maps.
 *
 * This stops at nested `Slots`, intrinsic DOM elements, `forwardRef`, and
 * `memo` boundaries so parent collectors do not steal slot content from nested
 * components.
 */
function traverse(
  node: ReactNode,
  slots: Record<string, SlotContent>,
  defaultNodes: Array<ReactNode | SlotFunction>,
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
    typeof el.type === 'string' ||
    (node as any).type?.$$typeof === Symbol.for('react.forward_ref') ||
    (node as any).type?.$$typeof === Symbol.for('react.memo')
  ) {
    defaultNodes.push(el);
    return;
  }

  if (el.type === Template || (el.type as Record<PropertyKey, any>)[TEMPLATE_COMPONENT]) {
    const slotName = el.props.name ?? 'default';
    const component = el.props.children;

    if (slotName === 'default') {
      defaultNodes.push(component);
      return;
    }
    if (slots[slotName]) return;

    slots[slotName] = component;
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
 * @returns A map keyed by slot name. The default slot is stored under `default`.
 *
 * @example
 * ```tsx
 * const slots = collectSlots(children);
 * const title = slots.title;
 * const body = slots.default;
 * ```
 */
export function collectSlots(children: ReactNode): Record<string, SlotContent> {
  const slots: Record<string, SlotContent> = {};
  const defaultNodes: Array<ReactNode | SlotFunction> = [];

  Children.forEach(children, child => traverse(child, slots, defaultNodes));

  if (defaultNodes.length) {
    slots['default'] = defaultNodes.length === 1 ? defaultNodes[0] : defaultNodes;
  }

  return slots;
}
