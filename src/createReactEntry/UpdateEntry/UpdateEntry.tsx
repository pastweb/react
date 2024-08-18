import { cloneElement, useState } from 'react';
import { UpdateEntryProps } from './types';

export function UpdateEntry({ on, children, ...restProps }: UpdateEntryProps) {
  const [entryProps, setEntryProps] = useState<{ [propName: string]: any }>(restProps);

  on('update', (newProps: { [propName: string]: any }): void => {
    setEntryProps(newProps);
  });

  return cloneElement(children, entryProps);
}
