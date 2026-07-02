import type { ReactElement } from 'react';
import type { Portal as P, PortalHandler } from '@pastweb/tools';

export type Portal = Omit<P, 'open'> & {
  open: (component: ReactElement | null, props?: Record<string, any> | (() => Record<string, any>), defaults?: Record<string, any>) => string | false;
};

export type PortalFunction = ((
  component: ReactElement | null,
  props?: Record<string, any> | (() => Record<string, any>),
  defaults?: Record<string, any>,
) => PortalHandler) & {
  update: (entryId: string, props: Record<string, any>) => boolean;
  close: (entryId: string) => void;
  remove: (entryId: string) => boolean;
  getEntryId: () => string;
  removeEntryId: (id: string) => void;
};

export interface PortalsDescriptor {
  [pathName: string]: Portal | PortalsDescriptor | PortalFunction;
};
