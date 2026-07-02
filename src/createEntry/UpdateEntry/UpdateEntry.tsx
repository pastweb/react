import { cloneElement, useState } from 'react';
import type { UpdateEntryProps } from './types';

/**
 * React component that listens for external entry updates
 * and re-renders its child element with updated props.
 *
 * `UpdateEntry` is designed to integrate with an event-based
 * entry system where updates are emitted through an `update`
 * event listener.
 *
 * Whenever the `update` event is triggered, the component
 * replaces the current child props with the new payload and
 * re-renders the child element.
 *
 * @param props - Component configuration.
 *
 * @param props.on - Event subscription function used to listen
 * for entry updates.
 *
 * @param props.children - The React element to clone and update
 * with incoming props.
 *
 * @param props.restProps - Initial props passed to the child element.
 *
 * @returns A cloned React element with reactive props applied.
 *
 * @remarks
 * - The child must be a valid React element.
 * - Incoming update payloads fully replace the current props state.
 * - Initial props are taken from the remaining component props.
 *
 * @example
 * ```tsx
 * <UpdateEntry on={entry.on} title="Hello">
 *   <App />
 * </UpdateEntry>
 * ```
 *
 * @example
 * ```ts
 * entry.emit('update', {
 *   title: 'Updated title'
 * });
 * ```
 */
export function UpdateEntry({ on, children, ...restProps }: UpdateEntryProps) {
  const [entryProps, setEntryProps] = useState<{ [propName: string]: any }>(restProps);

  on('update', (newProps: { [propName: string]: any }): void => {
    console.log('UpdateEntry', newProps);
    setEntryProps(newProps);
  });

  return cloneElement(children, entryProps);
}
