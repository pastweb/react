import type { ReactNode } from 'react';

export type { GlobalContext } from '@pastweb/tools';

/**
 * Installs one or more values into a {@link GlobalContext} provider.
 *
 * The function receives the keys already available in the local context. It must
 * return a plain object whose keys will be merged into that context before
 * descendants render.
 *
 * @param globalContextKeys - Keys currently available in the local provider scope.
 * @returns Values to expose through the provider.
 *
 * @example
 * ```tsx
 * const installTheme = () => ({ theme: 'dark' });
 *
 * <GlobalContext use={installTheme}>
 *   <App />
 * </GlobalContext>
 * ```
 */
export type Installer = (globalContextKeys: string[]) => Record<string, any>;

/**
 * Props accepted by {@link GlobalContext}.
 */
export interface ContextProviderProps {
  /** React children rendered inside the provider. */
  children: ReactNode;
  /**
   * Installer or installers that merge values into the local context once,
   * before the provider's descendants render.
   */
  use?: Installer | Installer[];
  /**
   * Values merged into the local context on every render. Use this for dynamic
   * provider-scoped updates such as route depth or temporary overrides.
   */
  update?: Record<string, any>;
};
