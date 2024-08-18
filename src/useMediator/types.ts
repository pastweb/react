import { ReactElement } from 'react';

export type Mediator<Props extends { children?: ReactElement; } = {}, State extends {} = {}, Extras extends {} = {}> = {
  props?: Props;
  state?: State;
  extras?: Extras;
} & object;

export type MediatorFunction = (props: any & object, extras: any & object) => any & object;
