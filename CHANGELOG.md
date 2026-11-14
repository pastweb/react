# Changelog

- Added `WindowManagerProvider`, `installWindowManager`, and `useWindowManager` to share one application-owned `createWindowManager()` instance through React `GlobalContext`. The hook returns the original manager without subscribing to its state. `Portal` accepts an optional manager prop, registers successful opens, routes manager close requests to the portal handler, and unregisters removals.

- Updated `PortalsProvider` to install portal helpers through `GlobalContext`, matching `installPortals` and `WindowManagerProvider`. Removed the unused dedicated portal React contexts; `usePortals` and `usePortalAnchors` now resolve directly from `GlobalContext`.

- Updated `RouterProvider` to install the tools router through `GlobalContext`, matching `installRouter`, `PortalsProvider`, and `WindowManagerProvider`. Removed the unused dedicated router React context; `useRouter` now resolves directly from `GlobalContext`.

- Collected `useSlots` `slots` entries are always arrays, including for a single node. `SlotContent` is `ReactNode[]`. Missing slots remain `undefined`.
- Typed `Template` children as `ReactNode` so a single node still type-checks, while forwarded `slots` entries remain arrays.
- Documented the always-array `slots` map and covered single-child collection in the Slots tests.

- Removed the `SlotFunction` type from `useSlots`. Slot content is now a React node or an array of nodes.
- Updated Slots documentation and tests to drop function-slot examples and keep element content with injected props.
- Added a `slots` map to `useSlots` so collected content can be forwarded into another `Template`.
- Widened `Template` children to `SlotContent` so forwarded `slots` entries type-check.
- Documented forwarding slots, including wrapping default content before passing it to a nested slot-aware host.
- Covered slot forwarding in the Slots tests, including wrapped default content and inner fallbacks.

- Documented a Slots best practice: wrap default slot content in `Template` as well as named slots, especially for nested slot-aware components.

- Removed `forwardRef` from `useSlots` collection boundaries. Collection stops at `Slots` hosts and intrinsic DOM elements, and continues through `forwardRef` and `memo` declared children.
- Updated Slots tests so `forwardRef`, `memo`, and `memo(forwardRef)` hosts still yield inner templates, while `Slots` still hides nested templates.

- Stopped treating `forwardRef` and `memo` as `useSlots` collection boundaries. Collection now stops only at `Slots` hosts and intrinsic DOM elements, and continues through `forwardRef` and `memo` declared children.
- Covered `forwardRef`, `memo`, and `memo(forwardRef)` slot collection in the Slots tests, including `Slots` still hiding nested templates.
- Documented that nested slot-aware components must wrap their slot tree in `Slots` because `forwardRef` and `memo` are no longer opaque to parent collectors.

- Added `reuseColorScheme` to bind a pre-created tools `MatchScheme` into a React hook.
- Removed the optional `MatchScheme` argument from `useColorScheme`; the hook now always creates its scheme with `createMatchScheme`.
- Documented `reuseColorScheme` under `useColorScheme` and split hook tests between created and reused schemes.
- Documented `ReduxProvider`'s `store` prop and that it unwraps a tools async store to the inner Redux store for `react-redux`.
- Covered `createReduxAsyncStore` recognition by tools `isAsyncStore` and `normalizeAsyncQueue`, and `ReduxProvider` `useSelector` access after init.
- Fixed `ReduxProvider` to detect tools async stores and pass the inner Redux store to `react-redux`.
- Documented loading a Redux reducer on demand with `AsyncComponent` and `normalizeDependency`.
- Removed `normalizeDependency` from the public React package exports and AsyncComponent utility barrels.
- Kept dependency normalization internal to `loadDependency`, allowing `AsyncComponent` to continue accepting dependency functions, promises, and `DependencyInfo` objects.
- Moved the `AsyncComponent` README documentation into the Element functions section and removed the public `normalizeDependency` documentation.
- Updated the AsyncComponent server tests to assert the supported internal dependency loading flow without mocking `normalizeDependency`.
- Added `reuseMatchDevice` to bridge tools reactive device state into React rendering.
