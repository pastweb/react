import { AsyncStore } from '@pastweb/tools';
import { Component } from '../types';
import { ReactNode } from 'react';

export type Wait = Promise<any> | (() => Promise<any>) | AsyncStore<any>;

export type WaitForProps = {
  fallback?: Component;
  wait: Promise<any> |
    (() => Promise<any>) |
    AsyncStore<any> |
    (Promise<any> | (() => Promise<any>) | AsyncStore<any>)[];
  children: ReactNode
}