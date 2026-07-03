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
- **Async functions** — Async component loading, dependency normalization, async Redux store helpers, and color-scheme hooks.
- **Routing** — React integration for `createViewRouter`.
- **Browser functions** — Browser-aware hooks such as device matching.
- **Element functions** — Entry rendering, islands, portals, and UI composition helpers.
- **Hook functions** — General React lifecycle and mediator hooks.
- **Utility functions** — Small React utilities such as `Render` and `setRef`.

This project is distributed under the MIT licence.

## Summary

- [Core functions](#core-functions)
  - [GlobalContext](#globalcontext)
  - [getContext](#getcontext)
  - [setContext](#setcontext)
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
  - [AsyncComponent](#asynccomponent)
    - [normalizeDependency](#normalizedependency)
  - [createReduxAsyncStore](#createreduxasyncstore)
    - [ReduxProvider](#reduxprovider)
  - [useColorScheme](#usecolorscheme)
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
- [Element functions](#element-functions)
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

### `AsyncComponent`

As a code base application can grow in complexity and quantity of code, this component helps to split your bundle using the [import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) ES6 standard function for the component to be loaded as for its own dependencies if needed.

Props

* `component`: `() => Promise<any>`
 * the function which returns the component module Promise.
* `dependencies`: `(Dependency | DependencyInfo)[]` _(optional)_
 * an array of dependencies to be loaded before the component rendering.
* `fallback`: `ReactElement | null` _(optional)_
 * the placehoder component to be rendered waiting the the component and the dependencies a ready.

**Example:**
Immaging we want to load dynamically a react component and a redux reducer.
We can extend our `AsyncComponent` as in the example below using the [injectReducer](https://redux.js.org/usage/code-splitting) function.

**Example:**
```tsx
// @/react/components/Async.tsx
import { useRef } from 'react';
import { AsyncComponent, normalizeDependency } from '@pastweb/react';
import { injectReducer } from '@/react/redux';
import type { Dependency, DependencyInfo, ComponentModule } from '@pastweb/react';

export interface ReducerInfo {
  [reducerName: string]: Dependency | DependencyInfo;
}

export interface AsyncProps {
  component:  () => Promise<ComponentModule>;
  reducer?: ReducerInfo;
};

export function Async(props: AsyncProps) {
  const { component, reducer, ...rest } = props;
  const dep = useRef<undefined | DependencyInfo[]>(((reducer?: ReducerInfo): undefined | DependencyInfo[] => {
    if (!reducer) return;

    const [ reducerName ] = Object.keys(reducer);
    const dependency = normalizeDependency(reducer[reducerName]);
    
    dependency.onSuccess = (reducer: any) => {
      injectReducer(reducerName as string, reducer);
    };

    return [ dependency ];
  })(reducer));

  return (
    <AsyncComponent
      component={component}
      dependencies={dep.current}
      fallback={<div>Loading...</div>}
      {...rest}
    />
  );
}
```

Then we can use the `Async` component:

**Example:**
```tsx
import { Async } from '@/react/components/Async';

export function MyComponent() {
  return (
    <Async
      component={() => import('@/react/components/MyAsyncComponent')}
      reducer={{ myReducer: () => import('@/react/redux/myReducer') }}
    />
  );
}
```
Below the detail of the [normalizeDependency](#normalizedependency) function.

---
### `normalizeDependency`

The `normalizeDependency` function standardizes a given dependency into a consistent `DependencyInfo` structure. This is particularly useful in scenarios where dependencies can be provided in multiple formats, such as functions, promises, or objects, and need to be normalized for consistent handling.

> #### Syntax
```typescript
function normalizeDependency(dependency: Dependency | DependencyInfo): DependencyInfo;
```

Parameters

* `dependency`: `Dependency | DependencyInfo`
  * The dependency to be normalized. It can be either:
    * A `Dependency`: A function that returns a promise or a promise directly.
    * A `DependencyInfo`: An object containing detailed information about the dependency, including an optional exportName.

Returns
* `DependencyInfo`:
  * An object containing the normalized dependency information. The `DependencyInfo` object includes:
    * `dependency`: A promise representing the resolved dependency.
    * `exportName`: A string indicating the name of the export from the module. If not provided, it defaults to `'default'`.

---

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
* `ReduxAsyncStore`: An object that represents the custom Redux store with enhanced functionality. It includes:
  * `store`: The underlying Redux store, with added support for asynchronous reducers.
  * `asyncReducers`: An object that stores the dynamically added reducers, keyed by their names.
  * `useDispatch`: A typed hook for dispatching actions in a type-safe manner.
  * `useSelector`: A typed hook for selecting state from the store, ensuring type safety.
  * `init()`: A method that initializes the store and executes the onInit function.
    * Initializes the store and executes the optional onInit function provided in the options.
  * `addReducer(reducerKey: string, reducer: Reducer)`: A method for dynamically adding a new reducer to the store.
    * Adds a new reducer to the store, keyed by `reducerKey`. If a reducer with the same key already exists, it won't be added again.
  * `removeReducer(reducerKey: string)`: A method for dynamically removing an existing reducer from the store.
    * Removes an existing reducer from the store based on the provided `reducerKey`. If the reducer does not exist, the store remains unchanged.

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

Then in your Providers component you can use the `ReduxProvider` for the `asyncReduxStore`:

**Example:**
```tsx
// @/react/getEntry/Providers.tsx
import type { ReactNode } from 'react'; 
import { ReduxProvider } from '@pastweb/react';
import { redux } from '@/react/redux';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider reduxStore={redux} fallback={<div>Loading...</div>}>
      { children }
    </ReduxProvider>
  );
}
```
---
### `ReduxProvider`

The `ReduxProvider` is a React component that ensures your application is wrapped with the Redux `Provider` only when the asynchronous Redux store is fully initialized.
It provides a convenient way to handle the async setup of a Redux store and offers an optional fallback UI to be displayed while the store is preparing as in the example above.

Props

* `reduxStore`: `ReduxStore`
  * The Redux store object, which includes the `isReady` promise and store itself.
* `children`: `React.ReactNode`
  * The React elements (usually components) to be rendered inside the Redux `Provider` once the store is ready.
* `fallback`: `React.ReactElement` _(optional)_
  * An optional React element to be displayed as a fallback UI while the Redux store is initializing.
---

### `useColorScheme`

React hook for managing and tracking color scheme changes.

This hook mirrors `useColorScheme` from `@pastweb/tools`: pass options to create an internal `MatchScheme`, or pass a pre-created `MatchScheme` as the second argument. It listens for changes in the system's preferred color scheme and user-selected mode, then re-renders the React component.

> #### Syntax

```ts
function useColorScheme(
  options?: SchemeOptions,
  matchScheme?: MatchScheme,
): [ColorSchemeInfo, (mode: string) => void]
```

#### Parameters

- **`options`** (`SchemeOptions`)  
  Options passed to `createMatchScheme` when `matchScheme` is not provided.
- **`matchScheme`** (`MatchScheme`, optional)  
  A pre-created `MatchScheme` instance.

#### Returns

A tuple containing:
- **`ColorSchemeInfo`**  
  The current color scheme information.
- **`(mode: string) => void`**  
  A function to update the color mode.

**Example:**
```ts
import { useColorScheme } from '@pastweb/react';

const [info, setMode] = useColorScheme({ defaultMode: 'auto' });

console.log(info.selected); // Outputs the currently selected color scheme
setMode('dark'); // Updates the mode to 'dark'
```
---

## Routing

### `ViewRouter`

`ViewRouter` comes from `@pastweb/tools`. The React package can install that router with `GlobalContext`, or provide it locally with `RouterProvider`, then expose components/hooks that render route views, links, and reactive router state.

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

For a local provider style, use `RouterProvider` directly:

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

`RouterProvider` provides a tools `ViewRouter` through dedicated React context. Use it when a subtree needs router hooks/components but you do not want to install the router through `GlobalContext`.

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

`useRouterLink` returns the descriptor from `router.getRouterLink` and re-renders when the active route changes.

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

## Element functions

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

Portal entries render components into DOM elements called anchors. Create the anchor ids with `generateAnchors`, then either install the portal descriptor with `installPortals` and `GlobalContext`, or provide it locally with `PortalsProvider`.

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

`PortalsProvider` provides portal helpers through dedicated React context. Use it when a subtree needs portals but you do not want to install them through `GlobalContext`.

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

When `useSlots` scans children, it treats nested `Slots` boundaries as opaque children and does not collect `Template` elements inside them. This keeps parent and child slot collections independent while preserving the rendered child tree.

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

Wrap a nested slot-aware component with `Slots` when it appears inside another slot-aware component. The wrapper tells the parent collector to leave the child component's templates untouched so the child can collect them itself.

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

---
### `useSlots`

`useSlots` collects default children and named `Template` children into renderable slots.

The returned `Slot` component renders the default slot when no name is provided, renders fallback children when a named slot is missing, supports prop injection for element/function slot content, and supports custom mapping.

> #### Syntax

```ts
function useSlots(defaultNodes: ReactNode): {
  Slots: typeof Slots;
  Slot: (props: SlotProps) => ReactNode;
}
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

**Example:**
```tsx
import { Template, useSlots } from '@pastweb/react';

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
    {({ label }) => <button>{label}</button>}
  </Template>
</Toolbar>
```

---
### `Template`

`Template` marks content that should be collected by `useSlots`.

Omitting `name` makes the template content part of the default slot. `Template.reduce` and `Template.only` are available for filtering child collections while preserving the same public API.

#### Parameters

- **`name`** (`string`, optional)  
  Name of the slot to register. Defaults to the default slot.
- **`children`** (`ReactNode | SlotFunction`, optional)  
  Static content, React elements, arrays, or a function that receives slot props.

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

function ActionPanel({ children }: { children: React.ReactNode }) {
  const { Slot } = useSlots(children);

  return <Slot name="action" props={{ label: 'Save changes' }} />;
}

<ActionPanel>
  <Template name="action">
    {({ label }) => <button>{label}</button>}
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
```tsx
import { createMicroStore } from '@pastweb/react';

const useCounterStore = createMicroStore('counter', () => ({
  state: { count: 0 },
  actions: {
    increment() {
      this.state.count += 1;
    },
  },
}));

function Counter() {
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

`reuseMicroStore` is the lower-level bridge for a tools store that was already created elsewhere. Use it when the store belongs to the framework-agnostic layer, but a React component needs to read it and re-render when the selected state changes.

> #### Syntax
```ts
function reuseMicroStore<S, A, T = S>(
  store: UseMicroStore<S, A>,
  selector?: ReactMicroStoreSelector<T, S>,
): ReuseMicroStoreResult<T, A>
```

**Example:**
```tsx
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

function UserSummary() {
  const user = reuseMicroStore(settingsStore, state => state.user);

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
