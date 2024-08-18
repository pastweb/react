import { useState, useRef, cloneElement, ReactElement, isValidElement, createElement } from 'react';
import { Component } from '../createReactEntry';
import { useBeforeMount } from '../useBeforeMount';
import { loadDependency, normalizeDependency } from './util';
import { AsyncComponentProps, Dependency, DependencyInfo } from './types';

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
