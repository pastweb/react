import { isValidElement, cloneElement, createElement } from 'react';
import type { RenderProps, Component } from './types';

/**
 * Renders dynamic React content from a value, element, or component.
 *
 * Use this helper when a higher-level API accepts flexible render content, such
 * as a fallback, preloaded async component, or entry component. Primitive
 * content is rendered as-is, React elements are cloned with `props`, and
 * component constructors are instantiated with `props`.
 *
 * @param props - Dynamic content and optional props to apply.
 * @returns A React node for the provided content.
 *
 * @example
 * ```tsx
 * <Render content="Saved" />
 * <Render content={<Status />} props={{ tone: 'success' }} />
 * <Render content={Status} props={{ tone: 'success' }} />
 * ```
 */
export function Render(props: RenderProps) {
  const { content, props: _props = {} } = props;
  if (typeof content === 'string' || typeof content === 'number') return <>{content}</>;
  if (isValidElement(content)) return cloneElement(content, _props);
  return createElement(content as Component, _props);
}
