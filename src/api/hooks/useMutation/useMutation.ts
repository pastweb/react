import { useMutation as createToolsMutation } from '@pastweb/tools/api/hooks/useMutation';
import { reuseMutation } from '../reuseQuery';
import type { MutationConfig, MutationInfo } from '@pastweb/tools/api/hooks/useMutation';

/**
 * React wrapper for `@pastweb/tools` `useMutation`.
 *
 * The mutation object is created once, and React re-renders when its reactive
 * fields change.
 *
 * @example
 * ```tsx
 * const saveUser = useMutation({
 *   fn: payload => agent.post('/api/users', payload),
 * });
 *
 * <button disabled={saveUser.isMutating} onClick={() => saveUser.mutate(user)}>
 *   Save
 * </button>
 * ```
 */
export function useMutation<T>(config: MutationConfig<T>): MutationInfo<T> {
  return reuseMutation(() => createToolsMutation(config));
}
