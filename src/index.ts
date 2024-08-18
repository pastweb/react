export { AsyncComponent, normalizeDependency } from './AsyncComponent';
export type { AsyncComponentProps, Dependency, DependencyInfo, ComponentModule } from './AsyncComponent';

export { createReactEntry } from './createReactEntry';
export type { ReactEntry, ReactEntryOptions, Component } from './createReactEntry';

export { createReduxStore, ReduxProvider } from './createReduxStore';
export type { ReduxStore, ReduxStoreOptions } from './createReduxStore';

export { EntryAdapter } from './EntryAdapter';
export type { EntryAdapterProps } from './EntryAdapter';

export { useForceUpdate } from './useForceUpdate';

export { useFunction } from './useFunction';

export { useMatchDevice } from './useMatchDevice';
export type { DevicesConfig, DevicesResult } from './useMatchDevice';

export { useMediator } from './useMediator';
export type { Mediator, MediatorFunction } from './useMediator';

export { useMounted } from './useMounted';

export {
  RouterLink,
  RouterProvider,
  RouterView,
  useLocation,
  useNavigate,
  usePaths,
  useRoute,
  useRouter,
  useRouterLink,
} from './router';
export type {
  ViewComponent,
  Route,
  RouterOptions,
} from './router';

export { setRef } from './setRef';
export { useBeforeMount } from './useBeforeMount';
export { useBeforeUnmount } from './useBeforeUnmount';

export {
  PortalsProvider,
  Portal,
  usePortalAnchors,
  usePortal,
  usePortals,
} from './portals';

export type {
  PortalFunction,
  PortalProps,
  EntryDescriptor,
} from './portals';

export { withDefaults as withDefaultProps } from '@pastweb/tools';
