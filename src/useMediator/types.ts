export type {
  ContextUtils,
  Mediator,
  MediatorFunction,
  Props,
  Extras,
} from '@pastweb/tools';

/**
 * Import metadata shape used to detect development HMR APIs.
 *
 * Vite exposes `hot`; Webpack 5 and compatible bundlers such as Rspack expose
 * `webpackHot` for strict ESM modules.
 */
export type HotImportMeta = ImportMeta & {
  /** Vite HMR API. */
  hot?: unknown;
  /** Webpack/Rspack HMR API for strict ESM modules. */
  webpackHot?: unknown;
};
