import type { FC, FunctionComponent, ComponentClass, ReactElement } from 'react';
import type { Entry, EntryOptions } from '@pastweb/tools';
import type { WaitForProps } from './WaitFor';

/**
 * React component shape accepted by entry helpers.
 */
export type Component = FC<any> | FunctionComponent<any> | ComponentClass<any, any>;

/**
 * Options used to create a React entry.
 *
 * React entries extend the framework-agnostic `EntryOptions` from
 * `@pastweb/tools` with React-specific rendering concerns such as providers,
 * async waits, and fallback content.
 */
export type ReactEntryOptions = EntryOptions & {
  /** Optional provider component wrapping the entry component. */
  Providers?: Component;
  /** React component or element rendered by the entry. */
  EntryComponent?: Component | ReactElement;
  /** Async dependencies that must resolve before rendering the entry content. */
  waitFor?: WaitForProps['wait'];
  /** Content rendered while `waitFor` dependencies are pending or failed. */
  fallback?: WaitForProps['fallback'];
};

/**
 * Options passed to {@link ReactEntry.mount}.
 */
export interface MountOptions {
  /** Hydrates existing server-rendered markup instead of creating a fresh root. */
  hydrate?: boolean;
  /**
   * Server render mode. `createServerEntry` uses this to choose static markup
   * (`renderToStaticMarkup`) or hydratable HTML (`renderToString`).
   */
  isStatic?: boolean;
};

/**
 * React-specific entry object.
 *
 * It keeps the core `Entry` behavior from `@pastweb/tools`, but replaces the
 * lifecycle methods with React-aware mount, render, and unmount operations.
 */
export type ReactEntry = Omit <Entry<ReactEntryOptions>, 'mount'| 'update' | 'unmount'> & {
  /** Mounts or server-renders the entry depending on the factory that created it. */
  mount: (options?: MountOptions) => string | void;
  /** Convenience hydration hook for compatible entry implementations. */
  hydrate: () => void;
  /** Server-side render helper returning HTML. */
  render: (isStatic?: boolean) => string;
  /** Unmounts the React root created for this entry. */
  unmount: () => void;
};
