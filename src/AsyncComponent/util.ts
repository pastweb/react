import { isObject, noop } from '@pastweb/tools';
import { Dependency, DependencyInfo } from './types';

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
