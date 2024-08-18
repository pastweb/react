import { EventCallback } from '@pastweb/tools';

export interface UpdateEntryProps {
  on: (event: string, eventCallback: EventCallback) => void;
  children: React.ReactElement;
  [propName: string]: any;
}
