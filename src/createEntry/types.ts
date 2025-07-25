import { FC, FunctionComponent, ComponentClass, ReactElement } from 'react';
import { Entry, EntryOptions } from '@pastweb/tools';
import { WaitForProps } from './WaitFor';

export type Component = FC<any> | FunctionComponent<any> | ComponentClass<any, any>;

export type ReactEntryOptions = EntryOptions & {
  Providers?: Component;
  EntryComponent?: Component | ReactElement;
  waitFor?: WaitForProps['wait'];
  fallback?: WaitForProps['fallback'];
};

export interface MountOptions {
  hydrate?: boolean;
  isStatic?: boolean;
};

export type ReactEntry = Omit <Entry<ReactEntryOptions>, 'mount'| 'update' | 'unmount'> & {
  mount: (options?: MountOptions) => string | void;
  hydrate: () => void;
  render: (isStatic?: boolean) => string;
  update: (value: Record<string, any>) => void;
  unmount: () => void;
};
