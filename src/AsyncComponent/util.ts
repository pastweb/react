import { isObject, noop } from '@pastweb/tools';
import type { Dependency, DependencyInfo } from './types';

/**
 * Normalizes a dependency into a consistent `DependencyInfo` structure.
 *
 * @param dependency - The dependency to normalize. It can either be a `Dependency` (function or promise) or `DependencyInfo` object.
 * @returns A `DependencyInfo` object containing the normalized dependency information.
 *
 * @remarks
 * - If the `dependency` is an object, it is assumed to be a `DependencyInfo` and will be returned with a default `exportName` of `'default'` if not provided.
 * - If the `dependency` is a function or promise, it will be wrapped into a `DependencyInfo` with a default `exportName` of `'default'`.
 * 
 * @example
 * // Example with a DependencyInfo object:
 * const normalized = normalizeDependency({ dependency: () => import('./module'), exportName: 'customExport' });
 * // normalized = { dependency: Promise, exportName: 'customExport' }
 *
 * @example
 * // Example with a function:
 * const normalized = normalizeDependency(() => import('./module'));
 * // normalized = { dependency: Promise, exportName: 'default' }
 */
export function normalizeDependency(dependency: Dependency | DependencyInfo): DependencyInfo {
  if (isObject(dependency)) {
    const { exportName = 'default', ...rest } = dependency as DependencyInfo;
    return { exportName, ...rest } as DependencyInfo;
  }

  const depPromise =  typeof dependency === 'function' ? dependency() : dependency;
  return {
    exportName: 'default',
    dependency: depPromise,
  } as DependencyInfo;
}

/**
 * Loads a dependency based on the provided `DependencyInfo` object and returns the requested export.
 *
 * @param info - The `DependencyInfo` object containing the details of the dependency to load.
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
export async function loadDependency(info: DependencyInfo): Promise<any> {
  const { exportName, dependency, onSuccess = noop, onError = noop } = info;

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
