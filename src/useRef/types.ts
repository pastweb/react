import type { RefObject as RO } from 'react';

export type RefObject<T> = RO<T> & {
  value: T;
};
