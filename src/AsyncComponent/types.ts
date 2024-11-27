import { ReactElement } from 'react';
import { Component } from '../createEntry';

export interface DependencyInfo {
  exportName?: string;
  dependency: Promise<any> | (() => Promise<any>);
  onSuccess?: (dependency: any) => void;
  onError?: (error: any) => void;
}

export type ComponentModule = {
  default: Component;
};

export type Dependency = Promise<any> | (() => Promise<any>) | DependencyInfo;

export interface AsyncComponentProps {
  component: () => Promise<any>;
  dependencies?: (Dependency | DependencyInfo)[];
  fallback?: ReactElement | null;
};

