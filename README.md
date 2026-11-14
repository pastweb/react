# @pastweb/react

React integration package for building tools-powered React applications.

It provides React-specific bindings for the framework-agnostic primitives in `@pastweb/tools`: global context providers, API/query hooks, async component rendering, router integration, entry composition, islands, portals, and React utility hooks. Use it as a standalone React utility layer or as part of a larger Pastweb-based stack.

## Features

- **Tools-first architecture** — React components and hooks wrap the core `@pastweb/tools` functionality instead of replacing it.
- **Reactive Global Context** — `GlobalContext`, installers, `getContext`, and `setContext` bridge the tools global context into React trees.
- **API/query integration** — React wrappers for query cache access, `useQuery`, `useMutation`, `useQueries`, `useInfiniteQuery`, and reusable query state.
- **SSR-ready composition** — Entry helpers, `AsyncComponent`, and `Island` support the page-router SSR and partial hydration flow.
- **Router integration** — React hooks and components for `createViewRouter`.
- **Portal support** — React providers and hooks for portal descriptors and anchors.
- **Window management** — A provider, installer, and hook for sharing one reactive `createWindowManager()` instance across an application.
- **TypeScript-first** — Public APIs include TSDoc and exported types for app-level integration.

## Installation

```bash
npm i -S @pastweb/react
# or
pnpm i -S @pastweb/react
# or
yarn add -S @pastweb/react
```

## Documentation Overview

The documentation is organized into the following major categories. Each section provides syntax notes, practical examples, and integration guidance where useful.

- **Core functions** — `GlobalContext`, installers, and context hooks for sharing tools-powered services in React.
- **API functions** — Query cache provider, query cache installer, and React wrappers around tools API hooks.
- **Async functions** — Async Redux store helpers and color-scheme hooks.
- **Routing** — React integration for `createViewRouter`.
- **Browser functions** — Browser-aware hooks such as device matching.
- **Element functions** — Async components, remote-module loading, entry rendering, islands, portals, and UI composition helpers.
- **Hook functions** — General React lifecycle and mediator hooks.
- **Utility functions** — Small React utilities such as `Render` and `setRef`.

This project is distributed under the MIT licence.

## Summary

- [Core functions](#core-functions)
  - [GlobalContext](#globalcontext)
  - [getContext](#getcontext)
  - [setContext](#setcontext)
  - [Window management](#window-management)
- [API functions](#api-functions)
  - [ApiQueryProvider](#apiqueryprovider)
  - [installApiCache](#installapicache)
  - [reuseQuery](#reusequery)
  - [reuseMutation](#reusemutation)
  - [useQuery](#usequery)
  - [useMutation](#usemutation)
  - [useQueries](#usequeries)
  - [useInfiniteQuery](#useinfinitequery)
- [Async functions](#async-functions)
  - [createReduxAsyncStore](#createreduxasyncstore)
    - [ReduxProvider](#reduxprovider)
  - [useColorScheme](#usecolorscheme)
    - [reuseColorScheme](#reusecolorscheme)
- [Routing](#routing)
  - [ViewRouter](#viewrouter)
    - [router setup](#router-setup)
      - [installRouter](#installrouter)
      - [RouterProvider](#routerprovider)
      - [RouterView](#routerview)
      - [RouterLink](#routerlink)
    - [useLocation](#uselocation)
    - [useNavigate](#usenavigate)
    - [usePaths](#usepaths)
    - [useRoute](#useroute)
    - [useRouteDepth](#useroutedepth)
    - [useRouter](#userouter)
    - [useRouterLink](#userouterlink)
    - [useSearchParams](#usesearchparams)
- [Browser functions](#browser-functions)
  - [useMatchDevice](#usematchdevice)
  - [reuseMatchDevice](#reusematchdevice)
- [Element functions](#element-functions)
  - [AsyncComponent](#asynccomponent)
    - [normalizeDependency](#normalizedependency)
  - [Remote](#remote)
  - [createEntry](#createentry)
  - [EntryAdapter](#entryadapter)
  - [Island](#island)
  - [portals](#portals)
    - [portals setup](#portals-setup)
    - [PortalsProvider](#portalsprovider)
    - [usePortalAnchors](#useportalanchors)
    - [usePortals](#useportals)
    - [usePortal](#useportal)
    - [Portal](#portal)
  - [Slots](#slots)
    - [useSlots](#useslots)
      - [Forwarding slots](#forwarding-slots)
    - [Template](#template)
- [Hook functions](#hook-functions)
  - [useBeforeMount](#usebeforemount)
  - [useBeforeUnmount](#usebeforeunmount)
  - [useForceUpdate](#useforceupdate)
  - [useMediator](#usemediator)
  - [createMicroStore](#createmicrostore)
  - [reuseMicroStore](#reusemicrostore)
  - [useMounted](#usemounted)
  - [useRef](#useref)
- [Utility functions](#utility-functions)
  - [Render](#render)
  - [setRef](#setref)
  - [withDefaultProps](#withdefaultprops)

---
## Core functions

### `GlobalContext`

`GlobalContext` provides the reactive global context from `@pastweb/tools` to a React subtree. It can receive installer functions through `use`, and provider-scoped values through `update`.

Use installers for shared app services that should be available to descendants, such as routers, portal caches, or API query caches.

**Example:**
```tsx
import { GlobalContext } from '@pastweb/react';

const installSession = () => ({
  session: {
    userId: 'user-1',
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <GlobalContext use={installSession}>
      {children}
    </GlobalContext>
  );
}
```

Installers receive the keys already present in the local context. This is useful for defensive installers that need to avoid duplicate setup:

**Example:**
```tsx
const installTheme = keys => {
  if (keys.includes('theme')) return {};

  return {
    theme: 'dark',
  };
};
```

Nested providers inherit parent values and can add or override values with `update`:

**Example:**
```tsx
<GlobalContext update={{ appName: 'Docs' }}>
  <GlobalContext update={{ routeDepth: 1 }}>
    <Page />
  </GlobalContext>
</GlobalContext>
```

If an installer returns a key that already exists in the local context, `GlobalContext` throws. This catches accidental double installation early.

### `getContext`

Reads one context key and re-renders when that key changes.

**Example:**
```tsx
import { getContext } from '@pastweb/react';

function UserName() {
  const user = getContext<{ name: string }>('user');

  return <span>{user.name}</span>;
}
```

### `setContext`

Writes one value into the active context. Components reading the same key with `getContext` will update.

`setContext` reads React context internally, so call it during a component or custom hook render path.

**Example:**
```tsx
import { setContext } from '@pastweb/react';

function StatusWriter({ ready }: { ready: boolean }) {
  setContext('status', ready ? 'ready' : 'idle');

  return null;
}
```

### `Window management`

Create one `WindowManager` at the application boundary and provide that same
instance to every managed window and taskbar component. `WindowManagerProvider`
is the convenient React setup; `installWindowManager` is available when the
application already composes services with `GlobalContext`.

`useWindowManager` returns the original manager or `undefined`; it does not
subscribe to manager state or force React renders. Use the manager's state and
commands where the application needs them.

**Example:**
```tsx
import { createWindowManager } from '@pastweb/tools';
import { WindowManagerProvider, useWindowManager } from '@pastweb/react';

const windowManager = createWindowManager();

function Taskbar() {
  const manager = useWindowManager();

  if (!manager) return null;

  return manager.state.windows.map(window => (
    <button key={window.id} onClick={() => manager.manageWindow(window)}>
      {window.meta.label}
    </button>
  ));
}

export function App() {
  return (
    <WindowManagerProvider manager={windowManager}>
      <Taskbar />
    </WindowManagerProvider>
  );
}
```

For an existing `GlobalContext` composition, pass
`installWindowManager({ manager: windowManager })` in its `use` array.

---
## API functions

The API helpers are React wrappers around the framework-agnostic query/cache primitives from `@pastweb/tools`. The cache and agent still live in `tools`; this package only provides React context access and React render updates for the reactive query states.

### `ApiQueryProvider`

Provides a `QueryCache` to a React subtree without using `GlobalContext`.

**Example:**
```tsx
import { createQueryCache } from '@pastweb/tools';
import { ApiQueryProvider } from '@pastweb/react';

const queryCache = createQueryCache();

<ApiQueryProvider queryCache={queryCache}>
  <App />
</ApiQueryProvider>
```

### `installApiCache`

Installs a `QueryCache` into `GlobalContext`, which can then be read with `useApiQueryCache`.

**Example:**
```tsx
import { createQueryCache } from '@pastweb/tools';
import { GlobalContext, installApiCache } from '@pastweb/react';

const queryCache = createQueryCache();

<GlobalContext use={installApiCache({ queryCache })}>
  <App />
</GlobalContext>
```

### `reuseQuery`

Bridges any tools reactive query-like state into React rendering. The state is created once, and React re-renders when the enumerable fields from the first created state change.

> #### Syntax

```ts
function reuseQuery<TState extends Record<PropertyKey, any>>(
  createState: () => TState,
): TState
```

**Example:**
```tsx
import { createApiAgent, createQueryCache } from '@pastweb/tools';
import { useQuery as createToolsQuery } from '@pastweb/tools';
import { reuseQuery } from '@pastweb/react';

const queryCache = createQueryCache();
const agent = createApiAgent({ queryCache });

function useUsers() {
  return reuseQuery(() => createToolsQuery({
    fn: () => agent.get('/api/users', { queryKey: ['users'] }),
  }));
}
```

### `reuseMutation`

Alias of `reuseQuery` for mutation-style state. It uses the same implementation, but makes custom mutation hooks easier to read.

> #### Syntax

```ts
function reuseMutation<TState extends Record<PropertyKey, any>>(
  createState: () => TState,
): TState
```

**Example:**
```tsx
import { useMutation as createToolsMutation } from '@pastweb/tools';
import { reuseMutation } from '@pastweb/react';

function useSaveUser() {
  return reuseMutation(() => createToolsMutation({
    fn: user => agent.post('/api/users', user),
  }));
}
```

### `useQuery`

React wrapper for `@pastweb/tools` `useQuery`.

> #### Syntax

```ts
function useQuery<T>(config: QueryConfig<T>): QueryInfo<T>
```

**Example:**
```tsx
function Users() {
  const users = useQuery({
    fn: () => agent.get('/api/users', { queryKey: ['users'] }),
  });

  if (users.isLoading) return <span>Loading...</span>;
  if (users.isError) return <span>Could not load users</span>;

  return (
    <ul>
      {(users.data ?? []).map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### `useMutation`

React wrapper for `@pastweb/tools` `useMutation`.

> #### Syntax

```ts
function useMutation<T>(config: MutationConfig<T>): MutationInfo<T>
```

**Example:**
```tsx
const saveUser = useMutation({
  fn: payload => agent.post('/api/users', payload),
});

<button disabled={saveUser.isMutating} onClick={() => saveUser.mutate(user)}>
  Save
</button>
```

### `useQueries`

React wrapper for multiple tools queries.

> #### Syntax

```ts
function useQueries<T extends readonly QueryConfig<any>[]>(
  config: UseQueriesInput<T>,
): UseQueriesInfo<T>
```

**Example:**
```tsx
const dashboard = useQueries({
  queries: [
    { fn: () => agent.get('/api/users', { queryKey: ['users'] }) },
    { fn: () => agent.get('/api/posts', { queryKey: ['posts'] }) },
  ],
});
```

### `useInfiniteQuery`

React wrapper for paginated tools queries.

> #### Syntax

```ts
function useInfiniteQuery<TPage, TPageParam = unknown>(
  config: InfiniteQueryConfig<TPage, TPageParam>,
): InfiniteQueryInfo<TPage, TPageParam>
```

**Example:**
```tsx
const posts = useInfiniteQuery({
  initialPageParam: 1,
  fn: page => agent.get(`/api/posts?page=${page}`, {
    queryKey: ['posts', page],
  }),
});

<button disabled={!posts.hasNextPage} onClick={posts.fetchNextPage}>
  More
</button>
```

---
## Async functions

### `createReduxAsyncStore`

Generally there is not any need to initialise redux asyncronusly, even if you are using a micro-frontends loader helper as [Module Federation](https://module-federation.io/) or [Native Federation](https://www.npmjs.com/package/@angular-architects/native-federation) cares about it, anyway there are other cases where this functionality is a need, as example if you need to initialise the redux store getting data from [indexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).
The `createReduxAsyncStore` function sets up and configures an asynchronous Redux store that supports dynamically adding and removing reducers after the store has been created. It also provides hooks for dispatching actions and selecting state within a TypeScript-safe environment.

> #### Syntax
```typescript
function createReduxAsyncStore(options: ReduxStoreOptions): ReduxAsyncStore;
```

Parameters
* `options`: `ReduxStoreOptions`
  * An object containing configuration options for the Redux store.
    * `settings`: `object`
      * The settings object used to configure the Redux store, passed directly to configureStore from Redux Toolkit.
    * `onInit`: `(store: Store) => Promise<void> | void`
      * An optional initialization function that is executed when the store is initialized. This can be used for custom setup logic, such as loading initial data or middleware.

Returns
* `ReduxAsyncStore`: A tools async store that wraps a Redux store. It includes:
  * `store`: The underlying Redux store. Dynamically added reducers are kept on `store.asyncReducers`.
  * `useDispatch`: A typed hook for dispatching actions in a type-safe manner.
  * `useSelector`: A typed hook for selecting state from the store, ensuring type safety.
  * `init()`: A method that initializes the store and executes the `onInit` function, then marks the async store ready.
  * `isReady`: A promise that resolves when `init()` has finished.
  * `addReducer(reducerKey: string, reducer: Reducer)`: A method for dynamically adding a new reducer to the store.
    * Adds a new reducer to the store, keyed by `reducerKey`. If a reducer with the same key already exists, it won't be added again.
  * `removeReducer(reducerKey: string)`: A method for dynamically removing an existing reducer from the store.
    * Removes an existing reducer from the store based on the provided `reducerKey`. If the reducer does not exist, the store remains unchanged.

Pass the async store to `createEntry` `waitFor` (or call `init()` yourself) so `onInit` runs before the UI reads state. `normalizeAsyncQueue` recognizes the store because it is created with `createAsyncStore` from `@pastweb/tools`.

**Example:**
```bash
$ npm i -S @reduxjs/toolkit
```

**Example:**
```typescript
// @/react/redux/index.ts
import { createReduxAsyncStore } from '@pastweb/react/createReduxAsyncStore';

export const redux = createReduxAsyncStore({
  settings: {
    reducer: { /* initial reducers */ },
  },
  onInit: async (store) => {
    // Custom initialization logic, e.g., loading initial data
  },
});

// Dynamically adding a reducer
redux.addReducer('newFeature', newFeatureReducer);

// Dynamically removing a reducer
redux.removeReducer('oldFeature');

// Using typed hooks in your components
export const injectReducer = redux.addReducer;
export const useSelector = redux.useSelector;
export const useDispatch = redux.useDispatch;
```

Then in your Providers component you can use the `ReduxProvider` for the async store:

**Example:**
```tsx
// @/react/getEntry/Providers.tsx
import type { ReactNode } from 'react';
import { ReduxProvider } from '@pastweb/react/createReduxAsyncStore';
import { redux } from '@/react/redux';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider store={redux} fallback={<div>Loading...</div>}>
      { children }
    </ReduxProvider>
  );
}
```
---
### `ReduxProvider`

The `ReduxProvider` wraps children with the Redux `Provider` once the store is ready. Pass a `ReduxAsyncStore` from `createReduxAsyncStore`, or a regular Redux store.

For an async store it waits until `isReady` resolves, then passes `store.store` into `react-redux`. Regular Redux stores render immediately.

Props

* `store`: `Store | ReduxAsyncStore`
  * A regular Redux store, or the async store returned by `createReduxAsyncStore`.
* `children`: `React.ReactNode`
  * The React elements (usually components) to be rendered inside the Redux `Provider` once the store is ready.
* `fallback`: `React.ReactElement` _(optional)_
  * An optional React element to be displayed as a fallback UI while the Redux store is initializing. Defaults to an empty fragment.
---

### `useColorScheme`

React hook for managing and tracking color scheme changes.

Creates an internal `MatchScheme` with `createMatchScheme` from `@pastweb/tools`, then listens for mode and system changes so the React component re-renders. To bind a pre-created `MatchScheme`, use [`reuseColorScheme`](#reusecolorscheme).

> #### Syntax

```ts
function useColorScheme(options?: SchemeOptions): [ColorSchemeInfo, (mode: string) => void]
```

Parameters
* `options`: `SchemeOptions` _(optional)_
  * Options passed to `createMatchScheme`.

Returns
* `[ColorSchemeInfo, (mode: string) => void]`
  * A tuple with the current color scheme information and a function to update the color mode.

**Example:**
```ts
import { useColorScheme } from '@pastweb/react';

const [info, setMode] = useColorScheme({ defaultMode: 'auto' });

console.log(info.selected); // Outputs the currently selected color scheme
setMode('dark'); // Updates the mode to 'dark'
```
---

### `reuseColorScheme`

Creates a React hook bound to an existing tools `MatchScheme`. Use this when the scheme is created outside React, for example next to a `createMatchSchemeAsyncStore`.

> #### Syntax

```ts
function reuseColorScheme(matchScheme: MatchScheme): () => [ColorSchemeInfo, (mode: string) => void]
```

Parameters
* `matchScheme`: `MatchScheme`
  * A pre-created `MatchScheme` instance.

Returns
* `() => [ColorSchemeInfo, (mode: string) => void]`
  * A React hook that returns the current color scheme information and a function to update the color mode.

**Example:**
```tsx
import { createMatchScheme } from '@pastweb/tools';
import { reuseColorScheme } from '@pastweb/react';

const matchScheme = createMatchScheme({ defaultMode: 'auto' });
const useColorScheme = reuseColorScheme(matchScheme);

function ThemeButton() {
  const [scheme, setMode] = useColorScheme();

  return (
    <button onClick={() => setMode(scheme.selected === 'dark' ? 'light' : 'dark')}>
      Current theme: {scheme.selected}
    </button>
  );
}
```
---

## Routing

### `ViewRouter`

`ViewRouter` comes from `@pastweb/tools`. The React package installs that router with `GlobalContext`; `RouterProvider` is the component form of that installation. Components and hooks then render route views, links, and reactive router state.

---
### `router setup`

Create the router with `createViewRouter`, passing the React `RouterView` component as the view renderer. Install the router with `installRouter` and `GlobalContext`.

**Example:**
```tsx
// @/lib/router.ts
import { createViewRouter, type Route } from '@pastweb/tools';
import { RouterView } from '@pastweb/react';
import { routes } from '@/views';

export const router = createViewRouter({
  routes: routes as Route[],
  RouterView,
});
```

**Example:**
```tsx
// @/AppProviders.tsx
import type { ReactNode } from 'react';
import { GlobalContext, installRouter } from '@pastweb/react';
import { router } from '@/lib/router';

const installRouterContext = installRouter({ router });

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <GlobalContext use={installRouterContext}>
      {children}
    </GlobalContext>
  );
}
```

For a component provider style, use `RouterProvider` directly:

**Example:**
```tsx
import type { ReactNode } from 'react';
import { RouterProvider } from '@pastweb/react';
import { router } from '@/lib/router';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <RouterProvider router={router}>
      {children}
    </RouterProvider>
  );
}
```

---
### `installRouter`

`installRouter` creates a `GlobalContext` installer for the tools router. It stores the router under the tools router context key and initializes route depth to `-1`, so the first `RouterView` renders the root selected route.

**Example:**
```ts
import { installRouter } from '@pastweb/react';

const installRouterContext = installRouter({
  router,
  base: '/app',
});
```

---
### `RouterProvider`

`RouterProvider` is the component form of `installRouter`. It installs the tools `ViewRouter` and the root route depth through `GlobalContext`, so router hooks and nested `RouterView` instances resolve the same scoped values.

**Example:**
```tsx
import { RouterProvider, RouterView } from '@pastweb/react';

<RouterProvider router={router} base="/app">
  <RouterView />
</RouterProvider>
```

---
### `RouterView`

`RouterView` renders the selected route view for the current route depth. Nested `RouterView` components increment the depth through the nearest router provider context, while keeping compatibility with `GlobalContext`.

Props

* name: `string`
  * Named view to render from `SelectedRoute.views`. Defaults to `default`.
* beforeShow: `(route: SelectedRoute) => SelectedRoute`
  * Optional transform before the view is selected.
* rest: `Record<string, any>`
  * Extra props forwarded to the selected view component.

**Example:**
```tsx
import { RouterView } from '@pastweb/react';

export function Views() {
  return <RouterView />;
}
```

**Example:**
```tsx
import { RouterView } from '@pastweb/react';

export function Views() {
  const beforeShow = (route) => {
    if (route.meta.requiresAuth && !isLoggedIn()) {
      return { ...route, views: { default: LoginView } };
    }

    return route;
  };

  return <RouterView beforeShow={beforeShow} />;
}
```

---
### `RouterLink`

`RouterLink` renders an anchor whose `href`, active state, and click navigation come from `router.getRouterLink`.

Props

* path: `string`
  * The target path for the link.
* params: `Record<string, string | number | boolean | null | undefined>`
  * Optional route parameters interpolated into the path.
* searchParams: `URLSearchParams`
  * Optional query parameters.
* hash: `string`
  * Optional hash without the leading `#`.
* className: `string`
  * Optional anchor class.
* preventNavigate: `boolean`
  * Prevents click navigation while keeping the generated `href`.
* children: `ReactNode`
  * Anchor content.

**Example:**
```tsx
<RouterLink
  path="/users/:id"
  params={{ id: 123 }}
  searchParams={new URLSearchParams({ tab: 'profile' })}
  hash="details"
>
  User profile
</RouterLink>
```

---
### `useLocation`

`useLocation` returns the current router location and re-renders when it changes.

> #### Syntax

```ts
function useLocation(): Location
```

**Example:**
```tsx
const location = useLocation();

return <span>{location.pathname}</span>;
```

---
### `useNavigate`

`useNavigate` returns the router navigation function.

> #### Syntax

```ts
function useNavigate(): (path: string, state?: any) => Promise<void>
```

**Example:**
```tsx
const navigate = useNavigate();

await navigate('/dashboard', { from: 'login' });
```

---
### `usePaths`

`usePaths` returns the router paths filtered by the tools `filterRoutes` helper.

> #### Syntax

```ts
function usePaths(filter?: FilterDescriptor): Route[]
```

**Example:**
```tsx
const adminPaths = usePaths({ role: 'admin' });
```

---
### `useRoute`

`useRoute` returns the selected route at the current `RouterView` depth.

> #### Syntax

```ts
function useRoute(): SelectedRoute
```

**Example:**
```tsx
const currentRoute = useRoute();

return <h1>{currentRoute.path}</h1>;
```

---
### `useRouteDepth`

`useRouteDepth` returns the current router view depth. The installed root value is `-1`.

> #### Syntax

```ts
function useRouteDepth(): number
```

**Example:**
```tsx
const depth = useRouteDepth();
```

---
### `useRouter`

`useRouter` returns the installed tools `ViewRouter`.

> #### Syntax

```ts
function useRouter(): ViewRouter
```

**Example:**
```tsx
const router = useRouter();

await router.navigate('/home');
```

---
### `useRouterLink`

`useRouterLink` returns the descriptor from `router.getRouterLink` and re-renders when the active route changes. `isActive` is true for the link path and nested paths under it (`/blog` on `/blog/post`), but not for sibling paths that only share a string prefix (`/dropdown` on `/dropdownmenu`).

> #### Syntax

```ts
function useRouterLink(props: RouterLinkOptions): RouterLink
```

**Example:**
```tsx
const link = useRouterLink({
  path: '/about',
});

<a href={link.pathname} onClick={() => link.navigate()}>
  Go to About
</a>
```

---
### `useSearchParams`

`useSearchParams` returns the current `URLSearchParams` and the router setter.

> #### Syntax

```ts
function useSearchParams(): {
  params: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
}
```

**Example:**
```tsx
const { params, setSearchParams } = useSearchParams();
const next = new URLSearchParams(params);

next.set('page', '2');
setSearchParams(next);
```

---
## Browser functions

### `useMatchDevice`

`useMatchDevice` tracks device matches with the tools `createMatchDevice` helper.

> #### Syntax

```ts
function useMatchDevice(config: DevicesConfig): DevicesResult
```

**Example:**
```tsx
import { useMatchDevice, useMounted } from '@pastweb/react';

const config = {
  phone: { mediaQuery: '(max-width: 320px)' },
  tablet: { mediaQuery: '(max-width: 600px)' },
  desktop: { mediaQuery: '(max-width: 1024px)' },
};

const { devices, onMatch } = useMatchDevice(config);

useMounted(() => {
  onMatch('phone', (matches, device) => {
    console.log(`${device}: ${matches}`);
  });
});

return devices.phone ? <MobileNav /> : <DesktopNav />;
```

---

### `reuseMatchDevice`

`reuseMatchDevice` bridges a reactive device state created by the tools `useMatchDevice` helper into React rendering.

> #### Syntax

```ts
function reuseMatchDevice(matchDevice: DevicesResult): DevicesResult
```

**Example:**
```tsx
import { useMatchDevice as createToolsMatchDevice } from '@pastweb/tools';
import { reuseMatchDevice } from '@pastweb/react';

const deviceState = createToolsMatchDevice({
  phone: { mediaQuery: '(max-width: 640px)' },
});

function Navigation() {
  const { devices } = reuseMatchDevice(deviceState);

  return devices.phone ? <MobileNav /> : <DesktopNav />;
}
```

---

## Element functions

### `AsyncComponent`

`AsyncComponent` loads a React component with the [import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) function and can wait for optional dependencies before rendering. Use it for route-level code splitting, feature modules, or setup work such as loading reducers before the component appears.

> #### Syntax

```ts
function AsyncComponent(props: AsyncComponentProps): ReactElement | null
```

Props

* `component`: `() => Promise<ComponentModule>`
  * The function that returns the component module promise.
* `dependencies`: `(Dependency | DependencyInfo)[]` _(optional)_
  * Dependencies to load before rendering the component.
* `fallback`: `ReactElement | null` _(optional)_
  * The element rendered while the component and dependencies are loading.

**Example:**
```tsx
import { AsyncComponent } from '@pastweb/react';
import { injectReducer } from '@/react/redux';

export function ProductRoute() {
  return (
    <AsyncComponent
      component={() => import('@/react/components/ProductDetails')}
      dependencies={[
        {
          dependency: () => import('@/react/redux/productReducer'),
          exportName: 'default',
          onSuccess: reducer => {
            injectReducer('product', reducer);
          },
        },
      ]}
      fallback={<div>Loading...</div>}
    />
  );
}
```

---

### `Remote`

`Remote` loads a micro-frontend module after resolving an optional remote bootstrap dependency or dependency group. It uses React Suspense while loading and renders `errorFallback` if a dependency or the remote module cannot be loaded. It is intentionally separate from `AsyncComponent`, which is for local async component loading and SSR task composition.

> #### Syntax

```ts
function Remote(props: RemoteProps): ReactElement
```

Props

* `component`: `() => Promise<{ default: Component }>`
  * Resolves the remote module's default component export.
* `dependency`: `(() => Promise<any>) | Array<() => Promise<any>>` _(optional)_
  * One or more remote bootstrap loaders that resolve before the component import.
* `fallback`: `ReactNode` _(optional)_
  * Content rendered while the dependencies and remote module load.
* `errorFallback`: `ReactNode` _(optional)_
  * Content rendered if a dependency or remote module fails to load.

**Example:**

```tsx
import { Remote } from '@pastweb/react';

export function ReportsRoute() {
  return (
    <Remote
      component={() => import('reports/App')}
      dependency={[
        () => import('reports/bootstrap'),
        () => import('reports/translations'),
      ]}
      fallback={<p>Loading reports…</p>}
      errorFallback={<p>Reports is currently unavailable.</p>}
      locale="en-GB"
    />
  );
}
```

---

### `normalizeDependency`

`normalizeDependency` turns a dependency function, promise, or `DependencyInfo` object into a consistent `DependencyInfo`. Use it when you want to attach `onSuccess` or `onError` to a dependency that was not already written as a `DependencyInfo`, for example to inject a Redux reducer before the async component renders.

> #### Syntax

```ts
function normalizeDependency(dependency: Dependency | DependencyInfo): DependencyInfo
```

Parameters

* `dependency`: `Dependency | DependencyInfo`
  * A loader function, a module promise, or an existing `DependencyInfo` object.

Returns

* `DependencyInfo`
  * The normalized dependency, with `exportName` defaulting to `'default'`.

**Example:**
```tsx
import { useRef } from 'react';
import {
  AsyncComponent,
  normalizeDependency,
  type Dependency,
  type DependencyInfo,
} from '@pastweb/react';
import { injectReducer } from '@/react/redux';

type ReducerInfo = {
  [reducerName: string]: Dependency | DependencyInfo;
};

type AsyncProps = {
  component: () => Promise<{ default: React.ComponentType }>;
  reducer?: ReducerInfo;
};

export function Async(props: AsyncProps) {
  const { component, reducer, ...rest } = props;
  const dependencies = useRef(((reducerInfo?: ReducerInfo) => {
    if (!reducerInfo) return;

    const [reducerName] = Object.keys(reducerInfo);
    const dependency = normalizeDependency(reducerInfo[reducerName]);

    dependency.onSuccess = loadedReducer => {
      injectReducer(reducerName, loadedReducer);
    };

    return [dependency];
  })(reducer));

  return (
    <AsyncComponent
      component={component}
      dependencies={dependencies.current}
      fallback={<div>Loading...</div>}
      {...rest}
    />
  );
}

export function ProductRoute() {
  return (
    <Async
      component={() => import('@/react/components/ProductDetails')}
      reducer={{
        product: () => import('@/react/redux/productReducer'),
      }}
    />
  );
}
```

`Async` accepts a `reducer` map whose value can be a loader function, a promise, or a `DependencyInfo`. `normalizeDependency` converts that value so `onSuccess` can inject the loaded reducer with `injectReducer` before `ProductDetails` renders.

---

### `createEntry`

The `createEntry` function simplifies the process of setting up, rendering, and unmounting a React component in a web application. It includes support for asynchronous dependencies and customizable providers.

#### Parameters
* options: `ReactEntryOptions`
An object that defines the configuration for the React entry. This includes options for providers, initial data, fallback components, and asynchronous dependencies.

#### Properties of `options`:
1. Providers: `React.ComponentType | React.Fragment`
  * A wrapper component or React.Fragment to provide context or functionality to the entry component.
  * Default: `Fragment`.
2. initData: `{ [key: string]: any }`
  * Initial data passed as props to the entry component.
3. waitFor: `Array<Promise<any>>`
  * A list of promises to resolve before rendering the entry component. This allows for data fetching or other asynchronous operations to complete before display.
4. fallback: `React.ReactNode`
  * A component or element to render while waiting for the promises in waitFor to resolve.
  * Default: `Fragment`.

#### Returns
A `ReactEntry` object containing methods for managing the lifecycle of the React component.
For more info about the `Entry` Object click [here](https://github.com/pastweb/tools?tab=readme-ov-file#createentry).

**Example:**
```ts
// @/react/getEntry/getEntry.ts
import { createEntry } from '@pastweb/react';
import { redux } from '@/react/redux';
import { Providers } from './Providers';

type EntryParams = {
  entry?: Component | ReactElement;
  props?: Record<string, any>;
  entryElement?: HTMLElement;
};

export function getEntry(params: EntryParams = {}): ReactEntry {
  const { entry, entryElement, props = {} } = params;

  return createEntry({
    entryElement,
    EntryComponent: entry,
    Providers,
    initData: props,
    waitFor: [ redux ],
    fallback: <LoadingSpinner />,
  });
}

// @/main.tsx
import { getEntry } from '@/react/getEntry';
import { App } fgrom './App';

const entry = getEntry({
  entry: App,
  entryElement: document.querySelector('#root') as HTMLElement,
});
// Mount the component
entry.mount();

// Later, unmount it
entry.unmount();
```

---
### `EntryAdapter`

`EntryAdapter` renders an entry inside a React tree. On the client it mounts the `entry` returned by `createEntry`; on the server it can load a separate `ssrEntry` through the SSR async task queue, keeping the server renderer out of the client bundle.

If your renderer uses the same entry implementation on client and server, omit `ssrEntry`; `EntryAdapter` will use `entry` during SSR too.

When using Vite, guard the async server import with `import.meta.env.SSR` so the client build can tree-shake the server-only module:

**Example:**
```tsx
import { createEntry, EntryAdapter } from '@pastweb/react';
import { ProfileCard } from './ProfileCard';

function createProfileEntry() {
  return createEntry({
    EntryComponent: ProfileCard,
  });
}

export function ProfileSlot(props: { userId: string }) {
  return (
    <EntryAdapter
      entry={createProfileEntry}
      {...(import.meta.env.SSR
        ? {
            ssrEntry: () =>
              import('./profile.server-entry').then(module => module.createProfileServerEntry()),
          }
        : {})}
      userId={props.userId}
    />
  );
}
```

`EntryAdapter` also reads the nearest `Island` context. When rendered inside an `Island`, the nested entry hydrates existing server markup; outside an island it mounts normally.

---
### `Island`

`Island` marks a server-rendered subtree that can hydrate with a client strategy such as `load`, `idle`, `visible`, `media`, or `none`.

The component does not accept provider props and does not install API, router, portal, or cache context. When an island needs those providers, extend the component rendered inside the island and include the providers there.

`Island` also provides an internal island context. Nested `EntryAdapter` components read that context and hydrate their entries automatically only when they are rendered inside an island.

**Example:**
```tsx
function ProductIsland() {
  return (
    <AppProviders>
      <ProductCard />
    </AppProviders>
  );
}

<Island client="visible" islandId="product-card">
  <ProductIsland />
</Island>
```

---
### `portals`

React already supports [portals](https://react.dev/reference/react-dom/createPortal). These helpers add a small framework wrapper around the `@pastweb/tools` portal primitives so applications can share the same portal model across packages.

---
### `portals setup`

Portal entries render components into DOM elements called anchors. Create the anchor ids with `generateAnchors`, then install the portal descriptor with `installPortals` or use `PortalsProvider`, which installs the same values through `GlobalContext`.

**Example:**
```tsx
// @/lib/portals.ts
import { Fragment, type ReactNode } from 'react';
import { generateAnchors } from '@pastweb/tools';
import { GlobalContext, createEntry, installPortals } from '@pastweb/react';

export const portalAnchors = generateAnchors([
  'modal',
  'toast',
]);

const installPortalContext = installPortals({
  anchorsIds: portalAnchors,
  getEntry: (props, component) => createEntry({
    EntryComponent: component ?? Fragment,
    initData: props,
  }),
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <GlobalContext use={installPortalContext}>
      {children}
    </GlobalContext>
  );
}
```

The generated ids must be rendered as DOM anchors somewhere in the app shell:

**Example:**
```tsx
import { portalAnchors } from '@/lib/portals';

export function PortalAnchors() {
  return (
    <>
      <div id={portalAnchors.modal} />
      <div id={portalAnchors.toast} />
    </>
  );
}
```

`getEntry` is the customization point for portal rendering. Wrap the returned entry there when a portal needs providers, layout, or framework-specific mounting behavior.

---
### `PortalsProvider`

`PortalsProvider` is the component form of `installPortals`. It installs portal helpers through `GlobalContext`, so `Portal`, `usePortals`, and `usePortalAnchors` resolve the same scoped values.

**Example:**
```tsx
import { PortalsProvider } from '@pastweb/react';
import { portalAnchors } from '@/lib/portals';

<PortalsProvider anchorsIds={portalAnchors} getEntry={getEntry}>
  <App />
</PortalsProvider>
```

---
### `usePortalAnchors`

The `usePortalAnchors` hook reads the installed portal anchor ids.

> #### Syntax

```ts
function usePortalAnchors<T>(): T
```

**Example:**
```tsx
import { usePortalAnchors } from '@pastweb/react';

function PortalTargets() {
  const anchors = usePortalAnchors<{ modal: string; toast: string }>();

  return (
    <>
      <div id={anchors.modal} />
      <div id={anchors.toast} />
    </>
  );
}
```

---
### `usePortals`

The `usePortals` hook reads the installed portal descriptor. Use a local type to keep portal paths typed in application code.

> #### Syntax

```ts
function usePortals<T>(): T
```

**Example:**
```tsx
import { usePortals, type PortalFunction } from '@pastweb/react';

type AppPortals = {
  modal: PortalFunction;
};

function OpenDirectly() {
  const portals = usePortals<AppPortals>();

  const openModal = () => portals.modal(<Dialog />).open();

  return <button onClick={openModal}>Open Modal</button>;
}
```

---
### `usePortal`

The `usePortal` hook creates the handler consumed by the `Portal` component. The handler exposes `open`, `update`, `close`, and `remove`.

Calls made before the `Portal` component finishes wiring itself are replayed once the component is ready.

> #### Syntax

```ts
function usePortal(): PortalHandler & { isReady: () => void }
```

---
### `Portal`

The `Portal` component binds a `usePortal` handler to a portal path. It renders `null` directly; the child element is mounted by the portal entry when the handler opens.

Pass an application window manager through the optional `manager` prop to
register each successfully opened entry with it. Portal uses the entry ID,
routes a manager close request to the existing handler close action, and
unregisters the entry when the handler reports removal. Without a `manager`
prop, Portal retains its existing unmanaged behavior.

Props

* path: `string`
  * Dot-separated path used to select the portal function from the descriptor.
* use: `PortalHandler`
  * Handler returned by `usePortal`.
* children: `ReactElement`
  * Element rendered by the portal entry.

**Example:**
```tsx
import { Portal, usePortal } from '@pastweb/react';

function ProductModalButton() {
  const modal = usePortal();

  return (
    <>
      <button onClick={() => modal.open()}>Open details</button>
      <button onClick={() => modal.update({ variant: 'compact' })}>Compact</button>
      <button onClick={() => modal.close()}>Close</button>

      <Portal path="modal" use={modal}>
        <ProductDetails variant="full" />
      </Portal>
    </>
  );
}
```
---

### `Slots`

`Slots` is a boundary component for nested slot-aware components.

When `useSlots` scans children, it treats nested `Slots` boundaries and
intrinsic DOM elements as opaque and does not collect `Template` elements
inside them. `forwardRef` and `memo` are not boundaries; collection continues
through their declared children. Nested slot-aware components should wrap
their own slot tree in `Slots` so a parent collector cannot steal it.

#### Parameters

- **`children`** (`ReactNode`)  
  The nested slot-aware subtree.

#### Returns

The component renders its children unchanged.

**Example:**
```tsx
import { Slots, Template, useSlots } from '@pastweb/react';

function Panel({ children }: { children: React.ReactNode }) {
  const { Slot } = useSlots(children);

  return (
    <section>
      <header>
        <Slot name="title" />
      </header>
      <main>
        <Slot />
      </main>
    </section>
  );
}

<Panel>
  <Template name="title">Settings</Template>
  <Slots>
    <Template name="title">Nested title</Template>
  </Slots>
  <p>Panel body</p>
</Panel>
```

#### Nested slots

Wrap a nested slot-aware component with `Slots` when it appears inside another slot-aware component. The wrapper tells the parent collector to leave the child component's templates untouched so the child can collect them itself. Wrapping with `forwardRef` or `memo` is not enough.

**Example:**
```tsx
import { Slots, Template, useSlots } from '@pastweb/react';

function Page({ children }: { children: React.ReactNode }) {
  const { Slot } = useSlots(children);

  return (
    <main>
      <h1>
        <Slot name="title" />
      </h1>
      <Slot />
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  const { Slot } = useSlots(children);

  return (
    <article>
      <h2>
        <Slot name="title" />
      </h2>
      <div>
        <Slot />
      </div>
      <footer>
        <Slot name="action" />
      </footer>
    </article>
  );
}

<Page>
  <Template name="title">Dashboard</Template>

  <Slots>
    <Card>
      <Template name="title">Revenue</Template>
      <p>Quarterly report</p>
      <Template name="action">
        <button>Open report</button>
      </Template>
    </Card>
  </Slots>
</Page>
```

#### Best practice

Prefer `Template` for every projected slot, including the default slot. Omit `name` (or use `name="default"`) for default content. Collection stores a template's children as one payload and does not walk into hosts such as `forwardRef` buttons, so the trigger or nested host stays intact.

This matters most for nested slot-aware components. Put the nested component's trigger and its named slots in `Template` markers, and wrap the nested component in `Slots` so the parent collector cannot steal those templates.

```tsx
<Menu>
  <Template>
    <Button>Open</Button>
  </Template>
  <Template name="items">
    <MenuItem>Item 1</MenuItem>
    <Slots>
      <SubMenu>
        <Template>More</Template>
        <Template name="items">
          <MenuItem>Nested item</MenuItem>
        </Template>
      </SubMenu>
    </Slots>
  </Template>
</Menu>
```

Passing `<Button>Open</Button>` as a raw child can unwrap the button: collection walks into `forwardRef` hosts and keeps the inner text. A default `Template` avoids that.

---
### `useSlots`

`useSlots` collects default children and named `Template` children into renderable slots.

The returned `Slot` component renders the default slot when no name is provided, renders fallback children when a named slot is missing, supports prop injection for element slot content, and supports custom mapping. `map` is applied only to projected `Template` content; fallback children are rendered as-is.

Collected `slots` values are always arrays. A template with one child yields `[child]`. A missing named slot stays `undefined`, so forwarding `{slots.header}` still lets an inner `Slot` fallback render.

> #### Syntax

```ts
function useSlots(defaultNodes: ReactNode): UseSlotsResult
```

#### Parameters

- **`defaultNodes`** (`ReactNode`)  
  Children to scan for default content and `Template` markers.

#### Returns

An object containing:

- **`Slots`** (`FunctionComponent<SlotsProps>`)  
  Boundary component for nested slot-aware components.
- **`Slot`** (`FunctionComponent<SlotProps>`)  
  Renderer for default or named slot content.
- **`slots`** (`SlotsMap`)  
  Collected slot content, including `default`. Each present entry is a
  `ReactNode[]`, including when the slot has one node. Missing slots are
  `undefined`. Forward entries through another `Template` when wrapping or
  composing slot-aware components.

**Example:**
```tsx
import { Template, useSlots } from '@pastweb/react';

function ActionButton({ label }: { label?: string }) {
  return <button>{label}</button>;
}

function Toolbar({ children }: { children: React.ReactNode }) {
  const { Slot } = useSlots(children);

  return (
    <Slot
      name="action"
      props={{ label: 'Save' }}
      map={(child, index) => (
        <span key={index} className="toolbar-action">
          {child}
        </span>
      )}
    />
  );
}

<Toolbar>
  <Template name="action">
    <ActionButton />
  </Template>
</Toolbar>
```

`map` does not wrap fallback `Slot` children. Put the finished markup in the fallback when a mapped wrapper is required without projected content.

#### Forwarding slots

Use the `slots` map when a wrapper must collect content, wrap part of it, and
pass the rest through to another slot-aware component.

`useSlots` walks `Template` markers and default children. If a custom wrapper
such as a scroll area is passed as a child of the inner host, collection walks
through that wrapper and drops it. Collect first, then re-project:

- named entries with `<Template name={...}>{slots[name]}</Template>`
- default content with `<Template>{slots.default}</Template>`, or `<Slot />`
  inside extra markup when the default slot needs a wrapper

```tsx
import { Template, useSlots } from '@pastweb/react';

function Panel({ children }: { children: React.ReactNode }) {
  const { Slot } = useSlots(children);

  return (
    <article>
      <header>
        <Slot name="header" />
      </header>
      <div>
        <Slot />
      </div>
      <footer>
        <Slot name="footer" />
      </footer>
    </article>
  );
}

function ScrollPanel({ children }: { children: React.ReactNode }) {
  const { slots, Slot } = useSlots(children);

  return (
    <Panel>
      <Template name="header">{slots.header}</Template>
      <Template>
        <div className="scroll-area">
          <Slot />
        </div>
      </Template>
      <Template name="footer">{slots.footer}</Template>
    </Panel>
  );
}

<ScrollPanel>
  <Template name="header">Account</Template>
  <p>Long body content</p>
  <Template name="footer">
    <button>Save</button>
  </Template>
</ScrollPanel>
```

**Notes:**

- Collected `slots` entries are always arrays, including for a single node, so
  `{slots.header}` type-checks as `Template` children.
- Put `<Slot />` inside extra markup when wrapping default content so collection
  does not drop the wrapper. `{slots.default}` is enough when the default slot
  is forwarded unchanged.
- Forwarding `<Template name="header">{slots.header}</Template>` with no header
  still lets the inner `Slot` fallback render, because the collected value is
  `undefined`.

---
### `Template`

`Template` marks content that should be collected by `useSlots`.

Omitting `name` makes the template content part of the default slot. Prefer a
default `Template` even when the slot has no name, especially for nested
slot-aware components; see Best practice under `Slots`. `Template.reduce` and
`Template.only` are available for filtering child collections while preserving
the same public API.

#### Parameters

- **`name`** (`string`, optional)  
  Name of the slot to register. Defaults to the default slot.
- **`children`** (`ReactNode`, optional)  
  Static content, React elements, arrays of nodes, or collected `slots`
  entries forwarded from another `useSlots` host. Collected entries are always
  arrays.

#### Returns

`Template` renders `null`; its content is consumed by `useSlots`.

#### Static methods

- **`Template.reduce(children, fn)`**  
  Maps children while excluding `Slot` and `Template` marker elements.
- **`Template.only(children)`**  
  Returns only `Template` elements from a child collection.

**Example:**
```tsx
import { Template, useSlots } from '@pastweb/react';

function ActionButton({ label }: { label?: string }) {
  return <button>{label}</button>;
}

function ActionPanel({ children }: { children: React.ReactNode }) {
  const { Slot } = useSlots(children);

  return <Slot name="action" props={{ label: 'Save changes' }} />;
}

<ActionPanel>
  <Template name="action">
    <ActionButton />
  </Template>
</ActionPanel>
```

## Hook functions

### `useBeforeMount`

`useBeforeMount` runs a function once during the component's first render. Use it for synchronous setup that must be available before the initial React commit.

> #### Syntax
```ts
function useBeforeMount(fn: () => void): void
```

**Example:**
```tsx
import { useBeforeMount } from '@pastweb/react';

function ExampleComponent() {
  useBeforeMount(() => {
    registry.register('example');
  });

  return <div>Hello, world!</div>;
}
```

---
### `useBeforeUnmount`

`useBeforeUnmount` runs the latest callback when the component unmounts.

> #### Syntax
```tsx
function useBeforeUnmount(fn: () => void): void
```

**Example:**
```tsx
import { useBeforeUnmount } from '@pastweb/react';

function ExampleComponent() {
  useBeforeUnmount(() => {
    subscription.close();
  });

  return <div>Hello, world!</div>;
}
```

---
### `useForceUpdate`

`useForceUpdate` returns a stable function that forces the component to re-render.

> #### Syntax
```ts
function useForceUpdate(): () => void
```

**Example:**
```tsx
import { useForceUpdate } from '@pastweb/react';

function ExampleComponent() {
  const forceUpdate = useForceUpdate();

  return (
    <div>
      <p>Rendered at: {new Date().toLocaleTimeString()}</p>
      <button onClick={forceUpdate}>Force Re-render</button>
    </div>
  );
}
```

---
### `useMediator`

`useMediator` creates a tools mediator inside React. Props and extras are wrapped in tools reactive objects, and mediator state is bridged into React rendering.

In development, `useMediator` detects Vite (`import.meta.hot`) and Webpack/Rspack-compatible (`import.meta.webpackHot`) HMR. When the mediator factory source changes, the mediator is recreated and its React state snapshot is refreshed, so Fast Refresh does not leave old mediator logic resident until the component remounts. Inline mediators keep their state across ordinary rerenders because the comparison is based on the mediator source signature, not only the function reference.

> #### Syntax
```ts
function useMediator<T>(mediator: MediatorFunction<T>, props?: Props, extras?: Extras): T;
```

#### Type Parameters
* T: `extends Mediator`
  * A type that extends the Mediator type, representing the mediator object used for managing state, props, and logic.

#### Parameters
* mediator: `MediatorFunction`
  * A function that initializes and returns a mediator object managing state and logic. The mediator often encapsulates complex business logic.

* props: `any & object = {}`
  * Component props passed to the mediator. This defaults to an empty object if no props are provided.

* extras: `T['extras'] = {} as T['extras']`
  * Additional data passed to the mediator for handling extra configurations or logic. Defaults to an empty object.

#### Returns
An object that contains:

* state: The state managed by the mediator.
* props: The props passed to the mediator, including the component’s children.
* extras: The extras passed to the mediator.
* Additional properties defined by the mediator, excluding `state`, `props`, and `extras`.

**Example:**
```tsx
import { useMediator } from '@pastweb/react';
import { reactive } from '@pastweb/tools';

function myMediator(props, extras) {
  const { initialCount } = props;
  const { log } = extras;
  const state = reactive({ count: initialCount });

  function increment() {
    state.count = state.count + 1;
    if (log) console.log('count:', state.count);
  }

  return {
    state,
    props,
    extras,
    increment,
  };
}

function Counter() {
  const { state, increment } = useMediator(myMediator, { initialCount: 0 }, { log: true });
  const { count } = state;

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

---
### `useMounted`

`useMounted` runs a callback once after the component mounts. Async callbacks are allowed, but returned promises are not used as cleanup functions.

> #### Syntax
```ts
function useMounted(fn: () => void | Promise<void>): void;
```

**Example:**
```tsx
import { useMounted } from '@pastweb/react';

function ExampleComponent() {
  useMounted(() => {
    analytics.track('mounted');
  });

  return <div>Hello, World!</div>;
}
```

---
### `createMicroStore`

`createMicroStore` takes the same parameters as `createMicroStore` from `@pastweb/tools`, creates the tools store, and returns a React-ready hook. The returned hook keeps the same readonly state/actions shape and re-renders after actions update selected state.

> #### Syntax
```ts
function createMicroStore<S, A>(
  name: string,
  setup: (select: <T>(fn: Selector<T, S>) => T) => MicroStoreConfig<S, A>,
): ReactUseMicroStore<S, A>;
```

**Example:**
```ts
// @/stores/counterStore.ts
import { createMicroStore } from '@pastweb/react';

export const useCounterStore = createMicroStore('counter', () => ({
  state: { count: 0 },
  actions: {
    increment() {
      this.state.count += 1;
    },
  },
}));
```

```tsx
// Counter.tsx
import { useCounterStore } from '@/stores/counterStore';

export function Counter() {
  const counter = useCounterStore(state => state.count);

  return (
    <button onClick={counter.increment}>
      {counter.state}
    </button>
  );
}
```

---
### `reuseMicroStore`

`reuseMicroStore` is the lower-level bridge for a tools store that was already created elsewhere. It returns a **React hook** (same shape as `createMicroStore`). Call that hook inside components, optionally with a selector.

> #### Syntax
```ts
function reuseMicroStore<S, A>(
  store: UseMicroStore<S, A>,
): ReuseMicroStoreHook<S, A>
// useStore() | useStore(selector)
```

**Example:**
```ts
// @/stores/settingsStore.ts
import { createMicroStore } from '@pastweb/tools';
import { reuseMicroStore } from '@pastweb/react';

const settingsStore = createMicroStore('settings', () => ({
  state: {
    user: {
      name: 'Ada',
      preferences: {
        theme: 'light',
      },
    },
  },
  actions: {
    rename(name: string) {
      this.state.user.name = name;
    },
    useDarkTheme() {
      this.state.user.preferences.theme = 'dark';
    },
  },
}));

export const useSettingsStore = reuseMicroStore(settingsStore);
```

```tsx
// UserSummary.tsx
import { useSettingsStore } from '@/stores/settingsStore';

export function UserSummary() {
  const user = useSettingsStore(state => state.user);

  return (
    <section>
      <strong>{user.state.name}</strong>
      <button onClick={user.useDarkTheme}>
        Theme: {user.state.preferences.theme}
      </button>
    </section>
  );
}
```

The selector keeps the component focused on `state.user`, but the returned value still includes the store actions. Because the tools micro-store state is deeply reactive, changing `user.preferences.theme` refreshes the React component even though the store instance and selector are stable.

---
### `useRef`

`useRef` creates a React ref with a `value` alias for `current`. Pastweb internals use `value` for cross-framework ref consistency, while the returned object still behaves like a normal React ref.

> #### Syntax
```ts
function useRef<T>(value: T): RefObject<T> & { value: T };
```

**Example:**
```tsx
import { useRef } from '@pastweb/react';

function Counter() {
  const count = useRef(0);

  count.value += 1;

  return <span>{count.current}</span>;
}
```

---

## Utility functions

### `Render`

The `Render` component renders dynamic content from a string, number, React element, or React component.

> #### Syntax
```ts
function Render(props: RenderProps): ReactElement | null
```

The `props` object is optional and is applied when `content` is a React element or component.

**Example:**
```tsx
import { Render } from '@pastweb/react';

function Status({ tone }: { tone: 'success' | 'warning' }) {
  return <span>{tone}</span>;
}

function Example() {
  return (
    <>
      <Render content="Ready" />
      <Render content={<Status tone="warning" />} props={{ tone: 'success' }} />
      <Render content={Status} props={{ tone: 'success' }} />
    </>
  );
}
```

---

### `setRef`

The `setRef` utility assigns a value to an object ref or callback ref. It is useful when a component needs to keep an internal ref and also forward the same node to a consumer-provided ref.

> #### Syntax
```ts
function setRef<T>(ref: Ref<T> | MutableRefObject<T | null> | null | undefined, value: T | null): void
```

**Example:**
```tsx
import { forwardRef, useCallback, useRef } from 'react';
import { setRef } from '@pastweb/react';

const ExampleComponent = forwardRef<HTMLDivElement>((props, forwardedRef) => {
  const localRef = useRef<HTMLDivElement | null>(null);

  const assignRef = useCallback((node: HTMLDivElement | null) => {
    localRef.current = node;
    setRef(forwardedRef, node);

    if (localRef.current) {
      localRef.current.focus();
    }
  }, [forwardedRef]);

  return (
    <div ref={assignRef} tabIndex={-1}>
      Hello, world!
    </div>
  );
});
```

It also works with callback refs:

**Example:**
```tsx
setRef((node: HTMLDivElement | null) => {
  if (node) {
    node.focus();
  }
}, document.createElement('div'));
```

---
### `withDefaultProps`

`withDefaultProps` merges props with defaults while preserving explicitly provided values. A default is used only when the prop value is `undefined`.

> #### Syntax
```ts
function withDefaultProps<TProps>(props: Partial<TProps>, defaults: Partial<TProps>): TProps
```

**Example:**
```tsx
import { withDefaultProps } from '@pastweb/react';

type ButtonProps = {
  tone: 'neutral' | 'accent';
  size: 'sm' | 'md';
};

function Button(props: Partial<ButtonProps>) {
  const p = withDefaultProps<ButtonProps>(props, {
    tone: 'neutral',
    size: 'md',
  });

  return <button data-tone={p.tone}>{p.size}</button>;
}
```

---

## License

[MIT](./LICENSE) License (c) 2026 [Domenico Pasto](https://github.com/pastweb)
