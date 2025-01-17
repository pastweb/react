import { useRef, useState } from 'react';
import { update, noop, effect } from '@pastweb/tools';
import { Mediator, MediatorFunction } from './types';

/**
 * Custom hook that manages state and props through a mediator pattern.
 *
 * @template T - Type of the mediator, extending from the `Mediator` type.
 * 
 * @param mediator - A function that initializes and returns a mediator object. 
 *                   The mediator typically manages the component's state and other logic.
 * @param props - An object containing component props. Defaults to an empty object.
 * @param extras - An object containing additional data that might be needed by the mediator.
 *                 Defaults to an empty object of type `T['extras']`.
 *
 * @returns A mediator object excluding 'state', 'props', and 'extras', 
 *          but with these properties added back as part of the return type.
 *
 * @example
 * // Example usage:
 * const mediatorResult = useMediator(myMediatorFunction, { prop1: 'value1' }, { extra1: 'value2' });
 * console.log(mediatorResult.state);  // Access the state managed by the mediator
 * console.log(mediatorResult.props);  // Access the props managed by the mediator
 * console.log(mediatorResult.extras); // Access the extras passed to the mediator
 */
export const useMediator = <T extends Mediator>(
  mediator: MediatorFunction,
  props: any & object = {},
  extras: T['extras'] = {} as T['extras'],
): Omit<T, 'state' | 'props' | 'extras'> & { props: T['props'], state: T['state'], extras: T['extras'] } => {
  const isInit = useRef(true);
  const { children, ...restProps } = props;
  const storedProps = useRef<T['props']>({ ...restProps });
  const storedExtras = useRef<T['extras']>({ ... extras });

  if (!isInit.current) {
    update(storedProps.current, restProps);
    update(storedExtras.current, extras);
  }

  const updateState = useRef<(state: T['state']) => void>(noop);
  const md = useRef<Mediator>(mediator(storedProps.current, storedExtras.current));
  const onStateChange = useRef((state: T['state']) => updateState.current({ ...state || {}, ...md.current.state || {} }));

  if (isInit.current) {
    if (md.current.state) {
      effect(md.current.state, onStateChange.current);
    }

    isInit.current = false;
  }
  
  const [state, setState] = useState<T['state']>({ ...md.current.state  || {}});
  
  updateState.current = setState;

  return {
    ...md.current,
    state,
    props: { ...(md.current as any).props || storedProps.current, children },
    extras,
  } as Omit<T, 'state' | 'props' | 'extras'> & { props: T['props'], state: T['state'], extras: T['extras'] };
}
