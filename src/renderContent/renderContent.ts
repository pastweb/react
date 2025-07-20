import { isValidElement, cloneElement, createElement } from 'react';
import type { Content, Component } from './types';

export function renderContent(content: Content, props: Record<string, any> = {}): Content {
  if (typeof content === 'string' || typeof content === 'number') return content;
  if (isValidElement(content)) return cloneElement(content, props);
  return createElement(content as Component, props);
}
