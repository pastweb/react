import type { ReactNode } from 'react';

export type ClientStrategy =
  | 'load'
  | 'idle'
  | 'visible'
  | 'media'
  | 'none';

/**
 * Props for {@link Island}.
 *
 * `Island` only controls when a server-rendered subtree is hydrated. It does
 * not receive provider props and does not install API/router/portal context by
 * itself. When an island needs providers, render a component that already
 * includes them:
 *
 * Components inside an island can call `useIsland()` to detect the island
 * boundary. `EntryAdapter` uses that context automatically to hydrate nested
 * entries only when they are rendered inside an island.
 *
 * @example
 * ```tsx
 * function ProductIsland() {
 *   return (
 *     <AppProviders>
 *       <ProductCard />
 *     </AppProviders>
 *   );
 * }
 *
 * <Island client="visible">
 *   <ProductIsland />
 * </Island>
 * ```
 */
export interface IslandProps {
  /** Which hydration strategy to use */
  client?: ClientStrategy;
  /** Media query for 'media' strategy (e.g. '(min-width: 1024px)') */
  media?: string;
  /** Children = what to render both on server & client */
  children: ReactNode;
  /** Optional: fallback content shown before hydration (rarely needed) */
  fallback?: ReactNode;
  /**
   * Maximum delay in milliseconds before forcing hydration when using client="idle".
   * Only used when requestIdleCallback is available.
   * @default 5000
   */
  idleTimeout?: number;
  /** Stable id exposed as `data-island-id` for external orchestration. */
  islandId?: string;
};

export interface IslandDefaultProps {
  client: ClientStrategy;
  media?: string;
  children: ReactNode;
  fallback?: ReactNode;
  idleTimeout: number;
  islandId?: string;
};
