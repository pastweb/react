import { useState, useRef, cloneElement, ReactElement, isValidElement, createElement } from 'react';
import { Component } from '../createEntry';
import { useBeforeMount } from '../useBeforeMount';
import { loadDependency, normalizeDependency } from './util';
import type { AsyncComponentProps, Dependency, DependencyInfo } from './types';

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
  const {
    component,
    dependencies,
    fallback = null,
    ...restProps
  } = props;

  const [_component, setComponent] = useState<ReactElement | null>(fallback);
  const depCounter = useRef(0);

  async function loadComponent() {
    try {
      const { default: Comp } = await component();
      setComponent(<Comp />);
    } catch (e) {
      console.error(e);
    }
  }

  function depCountIncrement(): void {
    depCounter.current += 1;
    if (depCounter.current === (dependencies!.length)) {
      loadComponent();
    }
  }

  async function loadDependencies() {
    if (dependencies) {
      dependencies.forEach(async (dep: Dependency | DependencyInfo, i: number) => {
        try {
          const depPromise = loadDependency(normalizeDependency(dep));
          depPromise.then(() => depCountIncrement());
        } catch (e) {
          console.error(`the dependency with the index ${i} has an error: ${e}`);
        }
      });
    } else {
      loadComponent();
    }
  }

  useBeforeMount(() => {
    loadDependencies();
  });

  return (
    _component ? 
      isValidElement(_component) ?
      cloneElement(_component as ReactElement, restProps) :
      createElement(_component as unknown as string | Component, restProps)
    : null
  );
}
