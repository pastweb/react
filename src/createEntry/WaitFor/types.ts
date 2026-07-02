import type { ReactElement, ReactNode } from 'react';
import type { AsyncStore } from '@pastweb/tools';
import type { Component } from '../types';

export type Wait = Promise<any> | (() => Promise<any>) | AsyncStore<any>;

export type WaitForProps = {
  /**
   * Optional fallback component rendered while async tasks are pending.
   */
  fallback?: ReactElement | Component;

  /**
   * Async task(s) to wait for before rendering children.
   */
  wait: Wait | Wait[];

  /**
   * Child elements to render once all async tasks are resolved.
   */
  children: ReactNode;
};
