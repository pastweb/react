import type { ReactNode } from 'react';
import type { IslandDefaultProps as IDP, IslandProps as IP } from '@pastweb/tools';

export type { ClientStrategy } from '@pastweb/tools';

/**
 * Props for the React {@link Island} component.
 *
 * React Island uses the shared `@pastweb/tools` island contract for hydration
 * strategies, media queries, idle timeout, and `islandId`, then specializes the
 * renderable values as React nodes.
 *
 * `Island` only controls when a server-rendered subtree is hydrated. It does
 * not receive provider props and does not install API, router, or portal
 * context by itself. When an island needs providers, render a component that
 * already includes them.
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
export interface IslandProps extends Omit<IP, 'fallback'> {
  /** What to render both on the server and client. */
  children: ReactNode;

  /** Optional React fallback content shown before hydration. */
  fallback?: ReactNode;
}

/**
 * React Island props after defaults from `@pastweb/tools` have been applied.
 */
export interface IslandDefaultProps extends Omit<IDP, 'fallback'> {
  /** What to render both on the server and client. */
  children: ReactNode;

  /** Optional React fallback content shown before hydration. */
  fallback?: ReactNode;
}
