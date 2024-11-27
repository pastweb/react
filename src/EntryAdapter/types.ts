import { Entry } from '@pastweb/tools';

export interface EntryAdapterProps {
  entry: () => Entry<any>;
  isStatic?: boolean;
  hydrate?: boolean;
  [propName: string]: any;
};