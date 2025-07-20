import { cloneElement, isValidElement, Fragment } from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { createEntry } from '@pastweb/tools';
import { UpdateEntry } from './UpdateEntry';
import { WaitFor } from './WaitFor';
import { ReactEntry, type ReactEntryOptions } from './types';

function getRenderComponent(entry: ReactEntry) {
  const { Providers = Fragment, initData, waitFor = [], fallback = Fragment } = entry.options;
  const { EntryComponent } = entry;
  
  const RootComponent = (initData: { [propName: string]: any }) => (
    <Providers>
      <UpdateEntry on={entry.on} { ...initData }>
        {isValidElement(EntryComponent) ?
          cloneElement(EntryComponent, initData)
        : <EntryComponent />
      }
      </UpdateEntry>
    </Providers>
  );

  const RenderComponent = () => (
    <WaitFor wait={waitFor} fallback={fallback}>
      <RootComponent { ...initData } />
    </WaitFor>
  );

  return RenderComponent;
}

/**
 * Creates a server-side entry object with methods for rendering React components to static markup
 * or to a string, useful for server-side rendering (SSR).
 *
 * @param options - Configuration options for the React entry.
 * @param options.Providers - Optional provider components to wrap the entry component.
 * @param options.initData - Initial data to be passed as props to the entry component.
 * @param options.waitFor - Optional array of promises to wait for before rendering the entry component.
 * @param options.fallback - Optional fallback component to be rendered while waiting.
 *
 * @returns A `ReactEntry` object with methods for server-side rendering.
 * - `mount`: A method to render the entry component to a static markup or a string based on `isStatic`. 
 *   If `isStatic` is true, it uses `renderToStaticMarkup`, otherwise it uses `renderToString`.
 *
 * @remarks
 * - The `getRenderComponent` function generates a component that includes the necessary providers, 
 *   the entry component itself, and handles the `waitFor` and `fallback` props.
 * - `mount` method supports server-side rendering (SSR) by generating either static markup or a string 
 *   representation of the rendered component.
 * 
 * @example
 * // Example usage:
 * const serverEntry = createServerEntry({
 *   Providers: MyProviders,
 *   initData: { someProp: 'value' },
 *   waitFor: [fetchData()],
 *   fallback: <LoadingSpinner />,
 * });
 * 
 * const htmlString = serverEntry.mount({ isStatic: true });
 * // `htmlString` will contain the static markup of the rendered component.
 */
export function createServerEntry(options: ReactEntryOptions = {}): ReactEntry {
  const entry = createEntry(options) as ReactEntry;

  entry.mount = (options = {}): void | string => {
    const { isStatic = true } = options;
    const RenderComponent = getRenderComponent(entry);

    const renderString = async () => {
      if (isStatic) {
        return renderToStaticMarkup(<RenderComponent />);
      }
  
      return renderToString(<RenderComponent />);
    };

    entry.memoSSR(renderString);

    return entry.ssrId as string;
  };

  return entry as ReactEntry;
}
