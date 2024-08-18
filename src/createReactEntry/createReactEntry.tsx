import { cloneElement, isValidElement, Fragment } from 'react';
import { createRoot, hydrateRoot, Root } from 'react-dom/client';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { isSSR, createEntry } from '@pastweb/tools';
import { UpdateEntry } from './UpdateEntry';
import { WaitFor } from './WaitFor';
import { ReactEntry, ReactEntryOptions } from './types';

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

export function createReactEntry(options: ReactEntryOptions = {}): ReactEntry {
  const entry = createEntry(options) as ReactEntry;
  let _root: Root | null;

  entry.mount = (hydrate = false, isStatic = true): void => {
    const RenderComponent = getRenderComponent(entry);

    if (isSSR) {
      const renderString = async () => {
        if (isStatic) {
          return renderToStaticMarkup(<RenderComponent />);
        }
    
        return renderToString(<RenderComponent />);
      };

      entry.memoSSR(renderString);
    }

    if (hydrate) {
      _root = hydrateRoot(entry.entryElement as HTMLElement, <RenderComponent />);
    } else {
      _root = createRoot(entry.entryElement as HTMLElement);
      _root.render(<RenderComponent />);
    }
  };

  entry.hydrate = (): void => {
    const RenderComponent = getRenderComponent(entry);
    _root = hydrateRoot(entry.entryElement as HTMLElement, <RenderComponent />);
  };

  entry.render = (isStatic = true): string => {
    const RenderComponent = getRenderComponent(entry);
    const renderString = async () => {
      if (isStatic) {
        return renderToStaticMarkup(<RenderComponent />);
      }
  
      return renderToString(<RenderComponent />);
    };

    entry.memoSSR(renderString);

    if (isStatic) {
      return renderToStaticMarkup(<RenderComponent />);
    }

    return renderToString(<RenderComponent />);
  };

  entry.unmount = (): void => {
    (_root as Root).unmount();
  };

  return entry as ReactEntry;
}
