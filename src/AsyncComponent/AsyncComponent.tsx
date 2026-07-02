import { useState, cloneElement, isValidElement, createElement, type ReactElement } from 'react';
import { isServer } from '@pastweb/tools';
import { registerAsyncTask } from '@pastweb/tools/ssrUtils';
import { Render } from '../Render';
import { useBeforeMount } from '../useBeforeMount';
import { useRef } from '../useRef';
import { loadDependency, normalizeDependency } from './utils';
import type { Component } from '../createEntry';
import type { AsyncComponentProps, Dependency, DependencyInfo } from './types';

// WeakMap keyed by the loader function so we can store the loaded component
const preloadedOnServer = new WeakMap<() => Promise<any>, any>();

/**
 * A React component that asynchronously loads and renders another component based on the provided `component` prop.
 * It also handles asynchronous dependencies before loading the component.
 *
 * @param props - The properties for the `AsyncComponent`.
 * @param props.component - A function returning a promise that resolves to the component to be loaded.
 * @param props.dependencies - An optional array of dependencies that need to be resolved before the component is loaded.
 * @param props.fallback - An optional fallback React element or component to display while the main component is loading.
 * @param restProps - Any additional props to pass to the loaded component.
 *
 * @returns A React element that either displays the fallback, the loaded component, or `null` if neither is available.
 *
 * @remarks
 * - The `component` prop should be a function that returns a promise resolving to a React component.
 * - The `dependencies` prop should be an array of dependencies, which will be resolved before loading the main component.
 * - The `fallback` prop will be shown while waiting for the main component and dependencies to load.
 * - Once all dependencies are resolved, the `component` will be loaded and rendered with any additional `restProps`.
 * - If the `component` or dependencies fail to load, errors will be logged to the console.
 * 
 * @example
 * // Example usage:
 * <AsyncComponent
 *   component={() => import('./MyComponent')}
 *   dependencies={[import('./dependency1'), import('./dependency2')]}
 *   fallback={<LoadingSpinner />}
 *   someProp={value}
 * />
 * // The `AsyncComponent` will render `LoadingSpinner` until all dependencies are resolved
 * // and the component is loaded, then it will render the loaded component with `someProp`.
 */
export function AsyncComponent(props: AsyncComponentProps) {
  return isServer ? serverSide(props) : clientSide(props);
}

/**
 * Handles the client-side rendering of the async component.
 * Loads dependencies and the main component asynchronously, displaying a fallback while loading.
 *
 * @param props - The properties for the `AsyncComponent`.
 * @returns A React element representing the loaded component, the fallback, or `null`.
 */
function clientSide(props: AsyncComponentProps): ReactElement | null {
  const { component, dependencies, fallback = null, ...restProps } = props;

  const [_component, setComponent] = useState<ReactElement | null>(fallback);
  const depCounter = useRef(0);

  /**
   * Loads the main component and updates the state with the rendered element.
   * Logs an error to the console if the component fails to load.
   */
  async function loadComponent() {
    try {
      const { default: Comp } = await component();
      setComponent(<Comp />);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Increments the dependency counter and triggers component loading
   * once all dependencies have been processed.
   */
  function depCountIncrement(): void {
    depCounter.value += 1;
    if (depCounter.value === (dependencies!.length)) {
      loadComponent();
    }
  }

  /**
   * Loads all dependencies asynchronously. Each dependency is loaded and its counter incremented.
   * Once all dependencies are processed, the main component is loaded.
   * If no dependencies are provided, the main component is loaded immediately.
   */
  async function loadDependencies() {
    if (dependencies) {
      dependencies.forEach(async (dep: Dependency | DependencyInfo, i: number) => {
        try {
          await loadDependency(normalizeDependency(dep));
        } catch (e) {
          console.error(`the dependency with the index ${i} has an error:`, e);
        } finally {
          depCountIncrement();
        }
      });
    } else {
      loadComponent();
    }
  }

  useBeforeMount(() => loadDependencies());

  return (
    _component ?
      isValidElement(_component) ?
        cloneElement(_component as ReactElement, restProps) :
        createElement(_component as unknown as string | Component, restProps)
      : null
  );
}

/**
 * Handles the server-side rendering of the async component.
 * Awaits all dependencies and the main component before rendering synchronously.
 *
 * @param props - The properties for the `AsyncComponent`.
 * @returns A promise resolving to a React element representing the loaded component, the fallback, or `null`.
 */
function serverSide(props: AsyncComponentProps): ReactElement | null {
  const { component, dependencies = [], fallback = null, ...restProps } = props;

  // If we already resolved this loader (after resolveAsyncTasks), render it
  const Preloaded = preloadedOnServer.get(component);
  if (Preloaded) {
    return <Render content={Preloaded} props={restProps} />;
  }

  // During collection render: just register the work and return fallback immediately.
  // The actual loading + nested discovery happens later in resolveAsyncTasks().
  registerAsyncTask(async () => {
    // 1. Load dependencies
    if (dependencies && dependencies.length > 0) {
      const normalized = dependencies.map(normalizeDependency);
      await Promise.all(
        normalized.map(async (dep, index) => {
          try {
            await loadDependency(dep);
          } catch (err) {
            console.error(`dependency ${index} failed:`, err);
          }
        })
      );
    }

    // 2. Load the component
    const module = await component();
    const Comp = module.default as Component;

    if (!Comp) {
      console.error('AsyncComponent: No default export found');
      return;
    }

    // 3. Store it so the final server render can use it directly
    preloadedOnServer.set(component, Comp);
  });

  return null;
}
