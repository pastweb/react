import type {
  MicroStoreActions,
  ReactMicroStoreSelector,
  ReuseMicroStoreResult,
} from './reuseMicroStore';

export type { MicroStoreActionsContext, MicroStoreConfig } from '@pastweb/tools';

export type ReactUseMicroStore<
  S extends Record<string, any>,
  A extends MicroStoreActions,
> = {
  (): ReuseMicroStoreResult<S, A>;
  <T>(selector: ReactMicroStoreSelector<T, S>): ReuseMicroStoreResult<S, A, T>;
};
