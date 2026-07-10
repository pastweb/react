import { isObject, noop } from '@pastweb/tools';
import type { Dependency, DependencyInfo } from './types';

/**
 * Loads a dependency and returns the requested export.
 *
 * @param info - A dependency function, promise, or `DependencyInfo` object to load.
 * @returns A promise that resolves to the requested export from the loaded module.
 *
 * @throws Will throw an error if the dependency fails to load.
 *
 * @remarks
 * - The `dependency` can be a function that returns a promise or a direct promise.
 * - The `exportName` specifies which export to return from the loaded module (default is `'default'`).
 * - Optional `onSuccess` and `onError` callbacks can be provided in the `DependencyInfo` for handling success or failure.
 * 
 * @example
 * // Example usage:
 * const info: DependencyInfo = { dependency: () => import('./module'), exportName: 'default' };
 * const moduleExport = await loadDependency(info);
 * // `moduleExport` contains the default export from the loaded module.
 */
export async function loadDependency(info: Dependency | DependencyInfo): Promise<any> {
  const normalized = isObject(info)
    ? {
        ...info,
        exportName: (info as DependencyInfo).exportName ?? 'default',
      } as DependencyInfo
    : {
        exportName: 'default',
        dependency: typeof info === 'function' ? info() : info,
      } as DependencyInfo;

  const { exportName, dependency, onSuccess = noop, onError = noop } = normalized;

  const depPromise =  typeof dependency === 'function' ? dependency() : dependency;
  try {
    const module = await Promise.resolve(depPromise);
    onSuccess(module[exportName as string]);
    return module[exportName as string];
  } catch(e) {
    (onError as any)(e);
    throw e;
  }
}
