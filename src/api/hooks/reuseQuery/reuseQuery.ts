import { useReactiveRender } from '../utils';

/**
 * Reuses a tools reactive query-like state inside React.
 *
 * `createState` is called only once, during the first React render. The
 * resulting reactive object is passed to `useReactiveRender`, which derives the
 * observed dependencies by mapping the fields of that first state object. When
 * any observed reactive field changes, React is forced to render again.
 *
 * This is useful for composing custom React query hooks from the core
 * `@pastweb/tools` API hooks without rewriting their state machines. Use
 * {@link reuseMutation} as a semantic alias when the reused state represents a
 * mutation rather than a query.
 *
 * @typeParam TState - Reactive state object returned by the core hook.
 * @param createState - Factory that creates the tools reactive state once.
 * @returns The same reactive state object, connected to React rendering.
 *
 * @example
 * ```tsx
 * import { useQuery as createToolsQuery } from '@pastweb/tools';
 * import { reuseQuery } from '@pastweb/react';
 *
 * function useUsers(agent: Agent) {
 *   return reuseQuery(() => createToolsQuery({
 *     fn: () => agent.get('/api/users', { queryKey: ['users'] }),
 *   }));
 * }
 * ```
 */
export function reuseQuery<TState extends Record<PropertyKey, any>>(
  createState: () => TState,
): TState {
  return useReactiveRender(createState);
}

/**
 * Semantic alias for {@link reuseQuery} when reusing a tools mutation-like
 * reactive state inside React.
 *
 * It uses the exact same implementation as `reuseQuery`; the separate name is
 * only for clearer custom hook code.
 *
 * @typeParam TState - Reactive mutation state object returned by the core hook.
 * @param createState - Factory that creates the tools reactive state once.
 * @returns The same reactive state object, connected to React rendering.
 *
 * @example
 * ```tsx
 * import { useMutation as createToolsMutation } from '@pastweb/tools';
 * import { reuseMutation } from '@pastweb/react';
 *
 * function useSaveUser(agent: Agent) {
 *   return reuseMutation(() => createToolsMutation({
 *     fn: user => agent.post('/api/users', user),
 *   }));
 * }
 * ```
 */
export const reuseMutation = reuseQuery;
