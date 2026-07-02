import type {
  MicroStoreActions,
  ReactMicroStore,
  ReactMicroStoreSelector,
} from './types';

function readSnapshot(value: unknown, seen = new WeakSet<object>()): unknown {
  if (!value || typeof value !== 'object') return value;
  if (seen.has(value)) return value;

  seen.add(value);

  return Object.keys(value).map(key => readSnapshot((value as Record<string, unknown>)[key], seen));
}

export function getStoreSnapshot<
  S extends Record<string, any>,
  A extends MicroStoreActions,
  T,
>(
  store: ReactMicroStore<S, A>,
  selector?: ReactMicroStoreSelector<T, S>,
): unknown {
  const result = selector ? store(selector) : store();

  return readSnapshot(result.state);
}
