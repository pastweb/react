import { ReactElement } from 'react';
import { Portal as P, PortalHandler } from '@pastweb/tools';
import { ReactEntry } from '../createEntry';

export type Portal = Omit<P, 'open'> & {
  open: (component: ReactElement | null, props?: Record<string, any> | (() => Record<string, any>), defaults?: Record<string, any>) => string | false;
};

export declare function portalFunction(component: ReactElement | null, props?: Record<string, any> | (() => Record<string, any>), defaults?: Record<string, any>,): PortalHandler
export declare namespace portalFunction {
  const open: (component: ReactElement | null, props?: Record<string, any> | (() => Record<string, any>) | undefined, defaults?: Record<string, any> | undefined) => string | false;
  const update: (entryId: string, props: Record<string, any>) => boolean;
  const close: (entryId: string) => void;
  const remove: (entryId: string) => boolean;
  const getEntryId: () => string;
  const removeEntryId: (id: string) => void;
};

export type PortalFunction = typeof portalFunction;

export interface PortalsDescriptor {
  [pathName: string]: Portal | PortalsDescriptor | typeof portalFunction;
};

export interface EntryDescriptor {
  [ pathName: string]: EntryDescriptor | ((props: Record<string, any>, component: ReactElement | null) => ReactEntry);
};
