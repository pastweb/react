import { useState } from 'react';
import { createMediatorContextUtils, noop, effect, reactive, update } from '@pastweb/tools';
import { getContext, setContext } from '../GlobalContext';
import { useBeforeMount } from '../useBeforeMount';
import { useRef } from '../useRef';
import { isHMREnabled, getMediatorSignature } from './utils';
import type { ContextUtils, Mediator, MediatorFunction, Props, Extras } from './types';

/**
 * Creates and renders a tools mediator inside React.
 *
 * Props and extras are wrapped in tools reactive objects, and mediator state is
 * bridged into React rendering.
 *
 * @typeParam T - Mediator return type.
 * @param mediator - Tools mediator factory.
 * @param props - Reactive mediator props. `children` is ignored.
 * @param extras - Reactive mediator extras.
 * @returns Mediator return value with React-rendered state.
 *
 * @example
 * ```tsx
 * const counter = useMediator(createCounterMediator, { initial: 0 });
 *
 * return <button onClick={counter.increment}>{counter.state.count}</button>;
 * ```
 */
export const useMediator = <T>(mediator: MediatorFunction<T>, props: Props = {}, extras: Extras = {}): T => {
  const { children, ...restProps } = props;
  const isInit = useRef(true);
  const storedMediator = useRef<MediatorFunction<T> | null>(null);
  const storedMediatorSignature = useRef<string>('');
  const storedProps = useRef<Props>({});
  const storedExtras = useRef<Props>({});
  const m = useRef<Mediator>({});
  const updateState = useRef<(state: Record<string, any>) => void>(noop);
  const onStateChange = useRef((state: Record<string, any>) => updateState.value({ ...state || {}, ...m.value.state || {} }));
  const hmr = isHMREnabled();

  function init() {
    storedMediator.value = mediator;
    storedMediatorSignature.value = getMediatorSignature(mediator);
    storedProps.value = reactive({ ...restProps });
    storedExtras.value = reactive({ ...extras });

    const ctxUtils: ContextUtils = { getContext, setContext };
    m.value = createMediatorContextUtils(storedMediator.value, storedProps.value, storedExtras.value, ctxUtils);

    if (m.value.state) effect(onStateChange.value, m.value.state);
  }

  useBeforeMount(async () => {
    init();
    isInit.value = false;
  });

  if (!isInit.value) {
    if (hmr && storedMediatorSignature.value !== getMediatorSignature(mediator)) {
      init();
      updateState.value({ ...(m.value.state || {}) });
    } else {
      update(storedProps.value, restProps);
      update(storedExtras.value, extras);
    }
  }

  const [state, setState] = useState<Record<string, any>>({ ...m.value.state || {} });
  updateState.value = setState;

  return { ...m.value, state } as T;
}
