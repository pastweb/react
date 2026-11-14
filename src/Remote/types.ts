import type { ReactNode } from 'react';
import type { Component } from '../createEntry';

/** Loads one prerequisite module before the remote component is imported. */
export type RemoteDependency = () => Promise<any>;

/** Props accepted by {@link Remote}. */
export interface RemoteProps {
  /** Function that resolves the remote module's default component export. */
  component: () => Promise<{ default: Component }>;

  /** One loader or a group of loaders that must finish before `component`. */
  dependency?: RemoteDependency | RemoteDependency[];

  /** Content rendered while dependencies and the remote module are loading. */
  fallback?: ReactNode;

  /** Content rendered when dependency or remote-module loading fails. */
  errorFallback?: ReactNode;

  /** Props forwarded to the loaded remote component. */
  [key: string]: unknown;
}
