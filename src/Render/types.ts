import type { ReactElement } from 'react';
import type { Component } from '../createEntry';

export type { Component } from '../createEntry';

/**
 * Content accepted by {@link Render}.
 *
 * Strings and numbers are rendered directly. React elements are cloned with the
 * provided props, and component constructors are rendered with those props.
 */
export type Content = string | number | ReactElement | Component;

/**
 * Props accepted by {@link Render}.
 */
export interface RenderProps {
  /** String, number, React element, or React component to render. */
  content: Content;
  /** Props passed to element and component content. */
  props?: Record<string, any>
};
