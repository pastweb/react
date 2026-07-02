import type { MediatorFunction, HotImportMeta } from './types';

/**
 * Checks whether the current module is running with an HMR API available.
 *
 * Vite exposes `import.meta.hot`; Webpack 5 and compatible bundlers such as
 * Rspack expose `import.meta.webpackHot` for strict ESM modules.
 *
 * @param meta - Import metadata to inspect. Defaults to this module's `import.meta`.
 * @returns `true` when either Vite or Webpack-compatible HMR is available.
 */
export function isHMREnabled(meta: HotImportMeta = import.meta as HotImportMeta): boolean {
  const { hot, webpackHot } = meta;
  return !!(hot || webpackHot);
}

/**
 * Returns a development-only signature for a mediator factory.
 *
 * The signature is based on the function source string and is used only when
 * HMR is enabled. This lets `useMediator` detect hot-updated mediator logic
 * without treating every inline function identity change as a mediator update.
 *
 * @param fn - Mediator factory to describe.
 * @param meta - Import metadata to inspect. Defaults to this module's `import.meta`.
 * @returns The mediator source signature when HMR is enabled, otherwise an empty string.
 */
export function getMediatorSignature(
  fn: MediatorFunction<any>,
  meta: HotImportMeta = import.meta as HotImportMeta,
): string {
  return isHMREnabled(meta) ? Function.prototype.toString.call(fn) : '';
}
