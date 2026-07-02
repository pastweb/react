import { reduceWithOut, templateOnly } from './utils';
import { markComponent, TEMPLATE_COMPONENT } from './constants';

import type { TemplateProps } from './types';

/**
 * Declares slot content for a parent component using `useSlots`.
 *
 * A named template (`name="title"`) fills the matching `<Slot name="title" />`.
 * A template without `name` contributes to the default slot. The component does
 * not render by itself; it is consumed during slot collection.
 *
 * @param _props - Template props consumed by `useSlots`.
 * @returns `null`; templates are markers rather than rendered elements.
 *
 * @example
 * ```tsx
 * <Template name="action">
 *   {({ label }) => <button>{label}</button>}
 * </Template>
 * ```
 */
export function Template(_props: TemplateProps) {
  return null;
}

Template.reduce = reduceWithOut;
Template.only = templateOnly;
markComponent(Template, TEMPLATE_COMPONENT);
