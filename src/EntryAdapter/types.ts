import type { Entry } from '@pastweb/tools/createEntry';
import type { MountOptions } from '../createEntry';

export type GenericEntry = Entry<any> & {
  mount: (options?: MountOptions) => string | void;
  unmount: () => void;
};

/**
 * Props for {@link EntryAdapter}.
 *
 * Hydration is inferred from the nearest `Island` context. Render the adapter
 * inside an `Island` when the nested entry should hydrate server markup.
 */
export interface EntryAdapterProps {
  /**
   * Factory returning the entry controlled by this adapter.
   *
   * When `ssrEntry` is omitted during SSR, this entry is used as the server
   * renderer too. This supports frameworks with a single client/server entry.
   */
  entry: () => GenericEntry;
  /**
   * Optional async factory returning the server-side entry.
   *
   * The loader is registered through the SSR async task queue, allowing the
   * server renderer to live in a separate server-only bundle. Once resolved, it
   * is reused by later SSR passes. Omit it when `entry` can render on both
   * client and server.
   *
   * @example
   * ```tsx
   * <EntryAdapter
   *   entry={createClientEntry}
   *   {...(import.meta.env.SSR
   *     ? { ssrEntry: () => import('./entry.server').then(module => module.entry()) }
   *     : {})}
   * />
   * ```
   */
  ssrEntry?: () => Promise<GenericEntry>;
  /** Additional props merged into the entry `initData`. */
  [propName: string]: any;
};
