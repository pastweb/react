import { Suspense, lazy, useMemo } from 'react';
import { ComponentErrorBoundary } from './ComponentErrorBoundary';
import type { RemoteProps } from './types';

/**
 * Loads and renders a remote micro-frontend component.
 *
 * Dependencies are resolved before the remote module is imported. A dependency
 * or module-loading failure is rendered through `errorFallback`; the loader is
 * kept separate from {@link AsyncComponent} because remote-module resolution
 * and server composition have distinct requirements.
 *
 * @param props - Remote module loader, optional dependency loaders, fallbacks,
 * and props forwarded to the loaded component.
 *
 * @example
 * ```tsx
 * import { Remote } from '@pastweb/react';
 *
 * export function BillingPage() {
 *   return (
 *     <Remote
 *       component={() => import('billing/App')}
 *       dependency={() => import('billing/bootstrap')}
 *       fallback={<p>Loading billing…</p>}
 *       errorFallback={<p>Billing is unavailable.</p>}
 *     />
 *   );
 * }
 * ```
 */
export function Remote(props: RemoteProps) {
  const {
    component,
    dependency,
    fallback = <div>Loading remote component...</div>,
    errorFallback = <div>⚠️ Failed to load micro-frontend module.</div>,
    ...componentProps
  } = props;
  const LazyComponent = useMemo(() => lazy(async () => {
    const dependencies = dependency ? (Array.isArray(dependency) ? dependency : [dependency]) : [];

    try {
      await Promise.all(dependencies.map(loadDependency => loadDependency()));
    } catch (error) {
      console.error('Remote dependency loading error:', error);
      throw error;
    }

    return component();
  }), [component, dependency]);

  return (
    <ComponentErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        <LazyComponent {...componentProps} />
      </Suspense>
    </ComponentErrorBoundary>
  );
}
