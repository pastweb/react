import { Entry } from '@pastweb/tools';

export interface EntryAdapterProps {
  entry: () => Entry<any>;
  isStatic?: boolean;
  [propName: string]: any;
};