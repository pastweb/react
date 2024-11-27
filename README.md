# @pastweb/react

Set of tools for react web application development.
For a better documentation clarity, the following code examples will consider a project diredtory structure as below:


```
.
|-- src
|   |-- App
|   |   |-- App.tsx
|   |   `-- Layout
|   |       `-- Layout.tsx
|   |-- lib
|   |   |-- portals.ts
|   |   `-- router.ts
|   |-- react
|   |   |-- components
|   |   |-- getEntry
|   |   |-- portals
|   |   |-- redux
|   |   `-- router
|   `-- Views
|       |-- index.ts
|       |-- Views.tsx
|       `-- Home
|           `-- Home.tsx
```

Where the alias `@` inside the import path is intended to point to the `src` directory.
The reason of this structure is to keep all the Framework indipendent settings in a different code base area (`lib`) in order to be consistant and reusable even for other frameworks.
Also there will be a set of custom `hooks` with a specific lifecile name in order to be consistant in the code implementation as in the documentation even for other frameworks:
- [useBeforeMount](#usebeforemount)
- [useBeforeUnmount](#usebeforeunmount)
- [useMediator](#usemediator)
- [useMounted](#usemounted)

## Summary

- [Async](#async)
  - [AsyncComponent](#asynccomponent)
    - [normalizeDependency](#normalizedependency)
  - [createReduxAsyncStore](#createreduxasyncstore)
    - [ReduxProvider](#reduxprovider)
- [Browser](#browser)
  - [ViewRouter](#viewrouter)
    - [router setup](#router-setup)
      - [RouterProvider](#routerprovider)
      - [RouterView](#routerview)
      - [RouterLink](#routerLink)
    - [useLocation](#useLocation)
    - [useNavigate](#usenavigate)
    - [usePaths](#usepaths)
    - [useRoute](#useroute)
    - [useRouteDepth](#useroutedepth)
    - [useRouter](#userouter)
    - [useRouterLink](#userouterlink)
  - [useMatchDevice](#usematchdevice)
- [Element](#element)
  - [createEntry](#createentry)
  - [portals](#portals)
    - [portals setup](#portals-setup)
      - [PortalsProvider](#portalsprovider)
      - [usePortalAnchors](#useportalanchors)
    - [usePortals](#useportals)
    - [usePortal](#useportal)
      - [Portal](#portal)
- [Hooks](#hooks)
  - [useBeforeMount](#usebeforemount)
  - [useBeforeUnmount](#usebeforeunmount)
  - [useForceUpdate](#useforceupdate)
  - [useFunction](#usefunction)
  - [useMediator](#usemediator)
  - [useMounted](#usemounted)
- [Utility](#utility)
  - [setRef](#setref)

---
## Async

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

```tsx
// @/react/components/Async.tsx
import { useRef } from 'react';
import { AsyncComponent, normalizeDependency, Dependency, DependencyInfo, ComponentModule } from '@pastweb/react';
import { injectReducer } from '@/react/redux';

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
```typescript
// @/react/redux/index.ts
import { createReduxAsyncStore } from '@pastweb/react';

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

> #### Syntax
```typescript
function ReduxProvider(props: ReduxProviderProps): JSX.Element;
```

Props

* `reduxStore`: `ReduxStore`
  * The Redux store object, which includes the `isReady` promise and store itself.
* `children`: `React.ReactNode`
  * The React elements (usually components) to be rendered inside the Redux `Provider` once the store is ready.
* `fallback`: `React.ReactElement` _(optional)_
  * An optional React element to be displayed as a fallback UI while the Redux store is initializing.
---

## Browser

### `ViewRouter`

The `ViewRouter` use [path-to-regexp](https://github.com/pillarjs/path-to-regexp) and [history](https://github.com/browserstate/history.js) libraries covering the most common
functionalities implemented in other router UI Frameworks like [react-router](https://reactrouter.com/en/main).
The goal of this implementation is to obtain a consistant set of API and terminology cross framework.
You can get more information about `ViewRouter` [here](https://github.com/pastweb/tools/tree/master?tab=readme-ov-file#createviewrouter).
---
### `router setup`

The router setup will be the same regardless the FE framework used.
The 2 mandatory options are:

* `routes` configuration
* `RouterView` componet as is use from the router to handle nested routes.

**Example:**
```tsx
// @/lib/router.ts
import { createViewRouter, RouterOptions, Route } from '@pastweb/tools';
import { RouterView } from '@pastweb/react';
import { routes } from '@/views';

const options: RouterOptions = {
  routes: routes as Route[],
  RouterView,
  // other options
};

export const router = createViewRouter(options);

```

---
### `RouterProvider`

The `RouterProvider` component is a React context provider that manages and provides routing-related data to its child components. It integrates with the `ViewRouter` instance to handle route changes and supplies the current route, router instance, and route depth through React context.

> #### Syntax
```typescript
function RouterProvider(props: { router: ViewRouter; base?: string; children: ReactNode }): JSX.Element;
```

Props

* router: `ViewRouter`
  * The router instance responsible for managing application routing. This instance should be created and configured outside the component.
* base: `string` _(Optional)_
  * The base path for the routing system. If provided, this value sets the base path for all routes handled by the ViewRouter instance.
* children: `ReactNode`
  * The child components that will consume the routing context provided by RouterProvider.

**Example:**
```tsx
// @/react/getEntry/Providers.tsx
import type { ReactNode } from 'react'; 
import { router } from '@/lib/router';
import { ProvidersProps } from './types';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <RouterProvider router={router}>
      { children }
    </RouterProvider>
  );
}
```

---

### `RouterView`

The `RouterView` component dynamically renders a view component based on the current route and the route depth. It supports nested routing by managing the route depth context and provides a mechanism to preprocess the selected route before rendering the view.

> #### Syntax
```typescript
function RouterView({ name, beforeShow, ...rest }: RouterViewProps): JSX.Element | null;
```

Props

* name: `string` _(Optional)_
 * The name of the view to render from the views object in the selected route. Defaults to 'default'.
* beforeShow: `(route: SelectedRoute) => SelectedRoute` _(Optional)_
 * A callback function that runs before the view is shown. It receives the selected route and allows for modification of the route (e.g., for conditional logic or preprocessing).
* rest: `Record<string, any>`  _(Optional)_
 * Additional props that are passed to the rendered view component.

#### `Description`
The `RouterView` component enables dynamic rendering of views in a nested routing setup. It determines the appropriate view to render by diving into the route structure using the `routeDive` function and adjusts the route depth context accordingly.

#### `How It Works`
1. Route and Depth Management:
   * The component retrieves the current route using the useRoute hook and calculates the current depth by incrementing the value from useRouteDepth.

2. Route Selection:
   * The routeDive function is used to traverse the route structure up to the specified depth, ensuring that the correct nested route is selected.

3. Preprocessing with beforeShow:
   * If the beforeShow prop is provided, it is invoked with the selected route, allowing for any modifications before extracting the view components.

4. View Component Selection:
   * The appropriate view is determined from the views object in the selected route using the name prop.

5. Rendering and Context Update:
   * If a matching view is found, it is rendered with the additional props passed to RouterView. The routeDepthContext is updated to reflect the current depth.


**Basic Example:**
```tsx
// @/Views/Views.tsx
import { RouterView } from '@pastweb/react';

export function Views() {
  return (
    <RouterView />
  );
}
```

**Using `beforeShow` for Preprocessing:**
```tsx
// @/Views/Views.tsx
import { RouterView } from '@pastweb/react';

export function Views() {
  const beforeShow = (route) => {
    // Modify the route if necessary
    if (route.meta.requiresAuth && !isLoggedIn()) {
      return { ...route, views: { main: LoginView } };
    }
    return route;
  };

  return (
    <RouterView beforeShow={beforeShow} />
  );
}
```

#### Notes
1. Default View:
   * If no name is provided, the RouterView defaults to rendering the default view from the selected route.
2. Error Handling:
   * If a view matching the name is not found in the selected route's views object, the component renders null.
3. Route Depth Context:
   The routeDepthContext ensures that nested RouterView components correctly manage their depth relative to the root.
4. Composable with Context:
   * Use alongside other components that consume the routeContext or routerContext for a fully integrated routing solution.


#### Practical Use Cases
1. Dynamic Component Rendering:
   * Dynamically load components based on route configuration.
2. Nested Routing:
   * Handle complex, multi-level routes with ease.
3. Custom Route Logic:
  * Preprocess routes with the beforeShow prop for authentication, redirection, or custom logic.
4. Flexible Route Configuration:
   * Support a configurable views structure within routes, enabling modular and reusable routing setups.


---
### `RouterLink`

The `RouterLink` component is a custom navigational link designed to work seamlessly with the application's routing system. It enables navigation without triggering a full page reload, supporting features such as route parameters, query parameters, and fragment identifiers.

> #### Syntax
```typescript
export const RouterLink: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<{
    path: string;
    params?: Record<string, string | number | boolean | null | undefined>;
    searchParams?: URLSearchParams;
    hash?: string;
    className?: string;
    preventNavigate?: boolean;
    children: React.ReactNode;
  }> & React.RefAttributes<HTMLAnchorElement>
>;
```

Props
* path: `string`
  * The target path for the link.
* params: `Record<string, string | number | boolean | null | undefined>` _(Optional)_
  * An object containing route parameters to be interpolated into the path.
* searchParams: `URLSearchParams` _(Optional)_
  * A URLSearchParams object representing query parameters to append to the path.
* hash: `string` _(Optional)_
  * A string representing the fragment identifier (e.g., #section) for the link.
* className: `string` _(Optional)_
  * A string of classes to apply to the anchor (`<a>`) element.
* preventNavigate: `boolean` _(Optional)_
  * A boolean that, if set to true, prevents navigation when the link is clicked. Defaults to false.
* ref: `React.Ref<HTMLAnchorElement>`_(Optional)_
  * A React ref that is forwarded to the anchor (`<a>`) element.
* children: `ReactNode`

The content to be displayed inside the link.

**Basic Link:**
```tsx
<RouterLink path="/home" className="nav-link">
  Home
</RouterLink>
```

**With Route Parameters:**
```tsx
<RouterLink 
  path="/user/:id" 
  params={{ id: 123 }} 
  className="user-link"
>
  View User
</RouterLink>
```
**With Query Parameters:**
```tsx
const searchParams = new URLSearchParams({ q: 'search term', page: '1' });

<RouterLink 
  path="/search" 
  searchParams={searchParams} 
  hash="results" 
  className="search-link"
>
  Search Results
</RouterLink>
```
**Prevent Navigation:**
```tsx
<RouterLink 
  path="/example" 
  preventNavigate={true}
  className="inactive-link"
>
  Inactive Link
</RouterLink>
```

---
### `useLocation`

The `useLocation` hook provides the current location object from the router, updating automatically on route changes.

#### Returns
* `Location`: An object containing information about the current route, such as the path and query parameters.

**Example:**
```tsx
const location = useLocation();
console.log(`Current path: ${location.pathname}`);
```

---
### `useNavigate`

The `useNavigate` hook provides a function to programmatically navigate within the application.

#### Returns
* `navigate(path: string, state?: any): void`
  A function to change routes, optionally passing additional state.


**Example:**
```tsx
const navigate = useNavigate();
navigate('/dashboard', { from: 'login' });
```

---
### `usePaths`

The `usePaths` hook filters and returns a list of routes based on specified criteria.

#### Parameters
* filter: `FilterDescriptor` _(optional)_
An object defining the filter criteria. Defaults to {}, returning all routes.

#### Returns
* `Route[]` An array of routes that match the filter criteria.

**Example:**
```tsx
const adminPaths = usePaths({ role: 'admin' });
console.log(adminPaths); // Logs routes accessible by an admin
```

#### How It Works
* Retrieves all routes from the router using `useRouter`.
* Filters the routes using the `filterRoutes` utility.
* Updates the list dynamically when new routes are added.

---
### `useRoute`

The `useRoute` hook retrieves the currently active route at the specified depth in the routing hierarchy.

#### Returns
* `SelectedRoute` The active route object at the current depth.

**Example:**
```tsx
const currentRoute = useRoute();
console.log(`Current route path: ${currentRoute.path}`);
```

#### How It Works
1. Retrieves the router instance with useRouter.
2. Determines the route depth using useRouteDepth.
3. Initializes the current route using routeDive to get the route at the specified depth.
4. Dynamically updates the route whenever it changes.

---
### `useRouteDepth`

The `useRouteDepth` hook retrieves the current route depth from the routeDepthContext.

#### Returns
* `number` The current route depth.

**Example:**
```tsx
const depth = useRouteDepth();
console.log(`Current route depth is: ${depth}`);
```

#### How It Works
* Uses the useContext utility to access the routeDepthContext.
* Ensures that the hook is used within a valid context provider by throwing an error if the context is missing.

---
### `useRouter`

The `useRouter` hook provides access to the `ViewRouter` instance from the `routerContext`.

#### Returns
* `ViewRouter` The router instance, offering methods like navigation and route management.

**Example:**
```tsx
const router = useRouter();
router.navigate('/home'); // Navigate to the '/home' route
```

#### How It Works
* Uses the `useContext` utility to fetch the `ViewRouter` instance from the `routerContext`.
* Ensures proper usage within a valid context provider by throwing an error if the `routerContext` is unavailable.

---
### `useRouterLink`

The `useRouterLink` hook creates a dynamic link object for routing, including path generation, active state detection, and navigation functionality.

#### Parameters
* props: `Object` containing the following properties:
  * path: `string` The target path for the link.
  * params: `Object` of route parameters. _(Optional)_
  * searchParams: `URLSearchParams` object for query parameters. _(Optional)_
  * hash: `string` representing a fragment identifier (e.g., #section). _(Optional)_

#### Returns
An object with the following properties:

* pathname: `string` The computed pathname for the link.
* isActive: `boolean` Whether the current route matches the link's path.
* isExactActive: `boolean` Whether the current route exactly matches the link's path.
* navigate: `function` A function to navigate to the path or an alternative route if specified.

**Example:**
```tsx
const link = useRouterLink({
  path: '/about',
  params: { id: 123 },
  searchParams: new URLSearchParams('query=test'),
  hash: 'section',
});

// In JSX:
<a href={link.pathname} onClick={link.navigate}>
  Go to About
</a>;
```

#### How It Works
1. Link Creation:
  * Uses router.getRouterLink to generate the link object based on the given path, params, searchParams, and hash.
2. Route Change Handling:
  * Listens for route changes to update the link's state dynamically.
3. Navigation:
  * The navigate method facilitates programmatic navigation to the specified route.

---
### `useMatchDevice`

The `useMatchDevice` hook provides device matching functionality based on a given configuration. It tracks the matched devices and allows manual updates.

#### Parameters
* config: An object of type DevicesConfig defining the criteria for matching devices. This configuration determines which devices are considered a match.

#### Returns
An object of type DevicesResult with the following properties:

* devices: The current matched devices as a `MatchDevicesResult` object.
* onMatch: A function to manually trigger the matching logic.

**Example:**
```tsx
const cvonfig = {
  phone: { mediaQuery: '(max-width: 320px)' },
  tablet: { mediaQuery: '(max-width: 600px)' },
  desktop: { mediaQuery: '(max-width: 1024px)' },
};
const { devices, onMatch } = useMatchDevice(config);

console.log(devices); // Logs the current matched devices
onMatch('phone', (result: boolean: device: string) => console.log(`${device}: ${result}`)); // Manually triggers the matching logic
```

#### How It Works
1. Device Matcher Creation:
  * Uses createMatchDevice to create a matcher instance based on the provided config.
2. State Management:
  * Tracks the current matched devices using useState.
3. Updates on Change:
  Subscribes to the matcher's onChange event to update the state whenever the matched devices change.
4. Manual Trigger:
  * Exposes onMatch for manually invoking the match logic.

---

## Element

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
### `portals`

React provide already support for [portals](https://react.dev/reference/react-dom/createPortal), the goal of this implementation is to provide a set of functionalities portals related with consistant apis crtoss framework.

---
### `portals setup`

Portals `Entry`s as micro-apps to render the component inside the correct DOM Element called `anchor`.
You need to setup the anchors using `generateAnchors` function which accept an array of strings representring an Object path `.` dot separated in order to be better organised. 

**Example:**
```ts
// @/lib/portals.ts
import { generateAnchors } from '@pastweb/tools';

export const anchors = generateAnchors([
  'window',
  'slider.menu',
  'slider.view',
  'toaster',
]);
```

The `anchors` Object created is an Object organised as below:
```js
{
  window: '_aslkdaj',
  slider: {
    menu: '_sdkdjkp',
    view: '_ndikalq',
  },
  toaster: '_tiubvjs'
}
```

These strings are unique in the document and will be used as `id` HTML attribute for the element which will be used for renter the component inside.

---
### `PortalsProvider`

The `PortalsProvider` component establishes and manages contexts for handling portals and portal anchors in a React application. It uses the `portalsContext` and portalAnchorsContext to make portal-related functionality accessible to its descendant components.

Props

* anchors: `{ [key: string]: string }`
  * A mapping of anchor names to their corresponding DOM identifiers or references.
  * Purpose: Specifies the target locations (anchors) where portals can be rendered.
* descriptor: `object` _(Optional)_
  * Configuration object describing how portals should be managed.
  * Default: {} (an empty object).
* getEntry: `(id: string) => any` _(Optional)_
  * A function to retrieve entries from the portals cache.
  * Purpose: Provides a mechanism for fetching portal-specific data.
* idChahe `Map<string, any>` _(Optional)_
  * The cache for portal IDs, used to store and manage portal instances.
  * Default: `DEFAULT_ID_CACHE`.
* portalsCache: `Map<string, any>` _(Optional)_
  * The cache for portal instances, storing the content or state of active portals.
  * Default: `DEFAULT_PORTALS_CACHE`.
* children: `React.ReactNode`
  * The child elements that will have access to the portals and portal anchors contexts.

**Example:**
```tsx
// @/react/getEntry/Providers.tsx
import { ReduxProvider, PortalsProvider, RouterProvider, ReactEntry } from '@pastweb/react';
import { anchors } from '@/lib/portals';
import { ProvidersProps } from './types';

export default (getEntry: () => ReactEntry) => function Providers({ children }: ProvidersProps) {
  return (
    <PortalsProvider getEntry={getEntry} anchors={anchors}>
      { children }
    </PortalsProvider>
  );
}
```

How you can see t in the example above the `Providers.tsx` exports a function getting the the `getEntry` function as paramenter and returns the `Providers` component. This is because the `PortalsProvider` needs the `getEntry` function to be used the set correctly the `Entry` object in order to be able to render the component.
It is possioble customise the rendered Component with a comonent wrapper as in the example below:

```ts
// @/react/portals.ts
import { usePortals as UP, usePortalAnchors as UPA, EntryDescriptor } from '@pastweb/react';
import { getEntry } from '@/react/getEntry';
import { Window } from '@/react/components/Window';
import { PortalAnchorsId } from '@/lib/portals';

export type Portals = {
  window: PortalFunction,
  slider: {
    menu: PortalFunction,
    view: PortalFunction,
  },
  toaster: PortalFunction,
};

export const usePortals = (): Portals => UP<Portals>();
export const usePortalAnchors = (): PortalAnchorsId => UPA<PortalAnchorsId>();

// descriptor definition
export const descriptor: EntryDescriptor = {
  window: () => getEntry({ entry: Window }),
};
```

Tghe `EntryDescriptor` object kkeps the same structure of the `anchors` object, but redefine the `getEntry` function for thet pecific portal.

---
### `usePortalAnchors`

The `usePortalAnchors` hook provides access to the `portalAnchorsContext`, which manages the identifiers (IDs) of portal anchors in a React application. This hook ensures that components can interact with and utilize the portal anchor IDs efficiently, supporting type safety and customizable context types.

**Example:**
```ts
import { usePortalAnchors } from '@pastweb/react';

function ExampleComponent() {
  // Access the portal anchors context with a custom type
  const portalAnchors = usePortalAnchors<{ mainAnchorId: string }>();

  console.log(`Main anchor ID: ${portalAnchors.mainAnchorId}`);

  return <div>Check the console for the main anchor ID.</div>;
}
```

---
### `usePortals`

The `usePortals` hook provides access to the `portalsContext`, enabling interaction with the application's portal system. This hook facilitates managing dynamic UI elements such as modals, tooltips, and other overlays.

> #### Syntax
```typescript
function usePortals<T>(): T
```

#### Returns
The current portals context cast to the specified type T.

**Example:**
```ts
import { usePortals } from '@/react/portals';

function ExampleComponent() {
  // Access the portals context with a custom type
  const portals = usePortals<{ modal: { open: (content: JSX.Element) => void } }>();

  const openModal = () => {
    portals.modal.open(<div>My Modal Content</div>);
  };

  return <button onClick={openModal}>Open Modal</button>;
}
```

---
### `usePortal`

The `usePortal` hook provides access to a `PortalHandler` object, which offers methods and properties for managing and interacting with portals in the application. This utility ensures that the `PortalHandler` object is initialized before the component mounts, allowing consistent access to portal management functionalities and must be used with the `Portal` Component.

##### Returns
* PortalHandler:
  * An object with methods and properties related to portal management, including an id property and an internal identifier `$$portalHandler`.

---
### `Portal`

The `Portal` component integrates seamlessly with a portal management system, enabling the rendering of its children into specific portal locations. It handles the portal lifecycle through a set of tools provided by the `PortalHandler` object, including methods to `open`, `update`, and `close` portals.

Props

* path:	`string`
  * The path identifying the target portal where the content should be rendered.
* use: `PortalHandler`
  * A `PortalHandler` object used to manage the portal's lifecycle. Must include an id property and a `$$portalHandler` identifier.
* children:	`ReactNode`
  * The content to render inside the portal.
* rest:	`Record<string, any>`
  * Additional props to be passed to the rendered content inside the portal.

**Example:**
```tsx
import { Portal, usePortal } from '@pastweb/react';

function MyComponent() {
  const tools = usePortal();

  return (
    <>
      <button onClick={() => tools.open()} />
      <Portal path='my.portal.path' use={tools}>
        <div>Content to render in the portal</div>
      </Portal>
    </>
  );
}
```
---

## Hooks

All the following hooks less `useMediator` are just a rename for consistant reference cross frameworks,

### `useBeforeMount`

The `useBeforeMount` hook provides a simple way to execute a function exactly once, before the component mounts. This is particularly useful for performing setup logic that needs to occur before the initial render.

> #### Syntax
```ts
function useBeforeMount(fn: () => void): void
```

**Example:**
```tsx
import { useBeforeMount } from '@pastweb/react';

function ExampleComponent() {
  useBeforeMount(() => {
    console.log('Component is about to mount!');
  });

  return <div>Hello, world!</div>;
}
```

---
### `useBeforeUnmount`

The `useBeforeUnmount` hook provides a simple way to execute a function just before a React component unmounts. This is particularly useful for cleanup operations, such as unsubscribing from services, clearing timers, or resetting global states.

> #### Syntax
```tsx
function useBeforeUnmount(fn: () => void): void
```

**Example:**
```tsx
import { useBeforeUnmount } from '@pastweb/react';

function ExampleComponent() {
  useBeforeUnmount(() => {
    console.log('Component is about to unmount!');
  });

  return <div>Hello, world!</div>;
}
```

---
### `useForceUpdate`

The `useForceUpdate` hook allows you to force a React component to re-render by triggering a state update. This is useful in situations where changes do not automatically trigger a re-render, such as when working with external libraries or non-reactive data sources.

> #### Syntax
```ts
export const useForceUpdate = (): () => void;
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
### `useFunction`

The `useFunction` hook is designed to return a stable, memoized reference of a provided function, preventing unnecessary re-creation across renders. This is especially useful when passing functions as dependencies in `useEffect`, `useMemo`, or as props to child components.

> #### Syntax
```ts
function useFunction<T extends (...args: any[]) => any>(fn: T): T;
```

**Example:**
```tsx
import { useFunction } from '@pastweb/react';

function ExampleComponent() {
  const memoizedLog = useFunction((message: string) => {
    console.log(message);
  });

  return (
    <button onClick={() => memoizedLog('Button clicked!')}>
      Click Me
    </button>
  );
}
```

---
### `useMediator`

The `useMediator` hook manages a component's state and props using a mediator pattern, which allows centralized state management and logic control. It provides a flexible way to handle complex state and prop interactions while keeping the component logic organized.

> #### Syntax
```ts
function useMediator<T extends Mediator>(
  mediator: MediatorFunction,
  props: any & object = {},
  extras: T['extras'] = {} as T['extras'],
): Omit<T, 'state' | 'props' | 'extras'> & { props: T['props'], state: T['state'], extras: T['extras'] };
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

function myMediator(props, extras) {
  const { initialCount } = props;
  const { log } = extras;
  const state = { count: initialCount };

  function incrtement() {
    state.count = state.count + 1;
    if (log) console.log('count:', state.count);
  }

  return {
    state,
    props,
    extras,
    incrtement,
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

The `useMounted` hook is a simple, yet powerful hook that executes a provided effect function only once, when the component mounts. It is particularly useful for performing setup logic or starting side effects such as API calls, subscriptions, or event listeners.

> #### Syntax
```ts
function useMounted(fn: EffectCallback): void;
```

**Example:**
```tsx
import { useMounted } from '@pastweb/react';

function ExampleComponent() {
  useMounted(() => {
    console.log('Component mounted');
  });

  return <div>Hello, World!</div>;
}
```

---

## Utility

### `setRef`

The `setRef` utility function provides a convenient way to assign values to React refs. It supports both `MutableRefObject` refs and `callback` refs, ensuring compatibility with various ref handling patterns in React.

> #### Syntax
```ts
function setRef<T>(ref: MutableRefObject<T> | ((ref: T) => void), value: any): void
```

**Example:**
```tsx
import { forwardRef, useCallback } from 'react';
import { setRef } from '@pastweb/react';

const ExampleComponent = forwardRef((props, ref) => {
  const myRef = useCallback((node: null | <HTMLDivElement>) => {
    if (node) {
      node.focus();
      // Set the ref value
      setRef(ref, node);
    }
  }, []);

  return <div ref={myRef}>Hello, world!</div>;
});
```

---

### License

This project is licensed under the MIT License.This project is licensed under the MIT License.
