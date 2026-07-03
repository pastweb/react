import { DEFAULT_ISLAND_PROPS, ISLAND_CONTEXT_KEY } from '@pastweb/tools';
import type { IslandDefaultProps as IDP } from './types';

export { ISLAND_CONTEXT_KEY };

/**
 * React Island defaults adapted from the framework-agnostic tools contract.
 */
export const DEFAULT_PROPS: Pick<IDP, 'client' | 'idleTimeout'> = DEFAULT_ISLAND_PROPS;
