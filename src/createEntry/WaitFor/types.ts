import type { ReactNode } from 'react';
import type { AsyncStore } from '@pastweb/tools';
import type { Component } from '../types';

export type Wait = Promise<any> | (() => Promise<any>) | AsyncStore<any>;

export type WaitForProps = {
  fallback?: Component;
  wait: Promise<any> |
    (() => Promise<any>) |
    AsyncStore<any> |
    (Promise<any> | (() => Promise<any>) | AsyncStore<any>)[];
  children: ReactNode
};
