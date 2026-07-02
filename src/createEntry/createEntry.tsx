import { cloneElement, Fragment, isValidElement } from 'react';
import { createRoot, hydrateRoot, type Root } from 'react-dom/client';
import { createEntry as _createEntry } from '@pastweb/tools/createEntry';
import { UpdateEntry } from './UpdateEntry';
import { WaitFor } from './WaitFor';
import type { ReactEntry, ReactEntryOptions } from './types';

function getRenderComponent(entry: ReactEntry) {
  const {
    Providers = Fragment,
    initData,
    waitFor = [],
    fallback = Fragment,
  } = entry.options;
  const { EntryComponent } = entry;

  return () => (
    <WaitFor wait={waitFor} fallback={fallback}>
      <Providers>
        <UpdateEntry on={entry.on} {...initData}>
          {isValidElement(EntryComponent) ? (
            cloneElement(EntryComponent, initData)
          ) : (
            <EntryComponent />
          )}
        </UpdateEntry>
      </Providers>
    </WaitFor>
  );
}

/**
 * Creates a React entry object with methods for mounting and unmounting React components.
 *
 * @param options - Configuration options for the React entry.
 * @param options.Providers - Optional provider components to wrap the entry component.
 * @param options.initData - Initial data to be passed as props to the entry component.
 * @param options.waitFor - Optional array of promises to wait for before rendering the entry component.
 * @param options.fallback - Optional fallback component to be rendered while waiting.
 *
 * @returns A `ReactEntry` object with methods for mounting and unmounting the React component.
 * - `mount`: A method to render the entry component. Can optionally hydrate if `hydrate` is true.
 * - `unmount`: A method to unmount the entry component from the DOM.
 *
 * @example
 * // Example usage:
 * const entry = createEntry({
 *   EntryComponent: MyComponent,
 *   Providers: MyProviders,
 *   initData: { someProp: 'value' },
 *   waitFor: [fetchData()],
 *   fallback: <LoadingSpinner />,
 * });
 *
 * entry.mount({ hydrate: false });
 * // Later in the lifecycle
 * entry.unmount();
 */
export function createEntry(options: ReactEntryOptions = {}): ReactEntry {
  const entry = _createEntry(options) as ReactEntry;
  let _root: Root | null;

  entry.mount = ({ hydrate = false } = {}): void => {
    const RenderComponent = getRenderComponent(entry);

    if (hydrate) {
      _root = hydrateRoot(
        entry.entryElement as HTMLElement,
        <RenderComponent />
      );
    } else {
      _root = createRoot(entry.entryElement as HTMLElement);
      _root.render(<RenderComponent />);
    }
  };

  entry.unmount = (): void => {
    (_root as Root).unmount();
  };

  return entry as ReactEntry;
}
