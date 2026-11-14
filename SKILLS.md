# `@pastweb/react` implementation skills

This document contains React-specific workflow for the package. The general
Pastweb rules for public APIs, helper organization, mediators, documentation,
testing discipline, and release safety are inherited from `../tools/SKILLS.md`;
do not duplicate or weaken them here.

## Start from the shared contract

1. Read the relevant `@pastweb/tools` or `@pastweb/components-core` types,
   mediator, README, and tests before changing a React adapter.
2. Identify whether the requested behavior belongs in a shared mediator or only
   in the React bridge. Move shared state transitions and event semantics to the
   core package; keep JSX, refs, context providers, and React lifecycle here.
3. Preserve prop names, default behavior, callback ordering, IDs, accessibility
   state, slots, and context keys from the shared contract.
4. Update local barrels, package-root exports, TSDoc/README examples, and tests
   together when a public React API changes.

## Hooks and lifecycle

- Follow the Rules of Hooks. Never call a hook conditionally, inside a loop, from
  an event handler, or after an early return that can change hook order.
- List every changing value read by an effect or memoized callback in its
  dependency array. Use refs for mutable instance resources that must not trigger
  renders, not as a way to hide a missing dependency.
- Keep subscriptions, event listeners, timers, portal registrations, and mediator
  mounts paired with cleanup. Cleanup must be safe when React invokes setup and
  teardown more than once in Strict Mode.
- Use the existing `useMediator`, `useMounted`, `useBeforeMount`, and
  `useBeforeUnmount` bridges rather than reproducing their lifecycle logic in a
  component.
- Keep render functions pure. Do not call mediator actions, mutate stores, or
  register portals while rendering; use effects or explicit event callbacks.
- Avoid unnecessary state mirrors. If a value is already owned by a mediator or
  external store, subscribe through the package bridge instead of maintaining a
  second React state source.

## Refs and imperative handles

- Adapt React refs at the boundary and pass only the generic capability required
  by the mediator, such as `{ focus: () => void }`.
- Use `forwardRef` when a component contract exposes a ref. Use
  `useImperativeHandle` to expose the documented handle, and keep its identity
  stable unless the contract explicitly requires replacement.
- Accept callback refs, object refs, and `null` through the shared `setRef` or
  `useRef` utilities. Do not cast a React ref into a DOM class in shared code.
- Attach and detach forwarded refs consistently when a component conditionally
  renders its target. Never leave a stale portal, window, or focus reference after
  unmount.

## JSX, slots, and context

- Use the `Slots`, `Template`, and `useSlots` APIs for component slot semantics.
  Keep slot collection, fallback handling, mapping, and React-node conversion in
  the React package.
- Preserve the semantic shell required by `@pastweb/components-core`. A custom
  slot must not remove required roles, labels, keyboard handlers, IDs, or ARIA
  relationships unless the contract explicitly supplies replacements.
- Use typed React context providers and the package context helpers for portal,
  router, API-cache, store, and mediator integrations. Keep context values stable
  with `useMemo` or stable objects when consumers subscribe by identity.
- Do not use JSX as a substitute for a shared mediator action. A JSX handler may
  adapt the event, then call the mediator method with the shared argument shape.
- Preserve native semantics and accessibility attributes in JSX. Use the
  normalized mediator state for disabled, open, selected, busy, labelled, and
  unavailable values instead of recomputing them from raw props.

## Async, portals, routing, and stores

- `AsyncComponent` and `Remote` must separate loading, success, and error
  rendering. Keep dependency promises cancellable or stale-result safe, and use
  the documented error-boundary behavior for render failures.
- Keep `Remote` independent from `AsyncComponent` when server-side composition or
  micro-frontend behavior requires a separate contract.
- Portal providers and portal hooks must register anchors and handlers through
  the shared portal contract, clean up on unmount, and remain safe during SSR
  where browser APIs are unavailable.
- Router providers and hooks should adapt `@pastweb/tools` router state without
  adding a second navigation source. Keep links, route views, and location hooks
  synchronized with provider lifecycle.
- React store bridges may expose Redux or micro-store hooks, but shared state
  transitions belong to the underlying store implementation. Do not recreate
  store state in provider render functions.
- Window-manager bridges must register, update, activate, and unregister windows
  with balanced effects. Verify Strict Mode does not create duplicate windows or
  taskbar entries.

## Type and export discipline

- Use React and DOM types only at the React boundary. Shared packages should
  receive framework-neutral types.
- Type component props so callback events match the actual React event adapter;
  do not widen every handler to `any` to silence JSX errors.
- Prefer named exports and local `index.ts` barrels. Add package-root exports only
  for APIs intended for general use, and keep dynamic-import-only defaults
  explicitly documented.
- Keep peer dependencies accurate for React integrations. Optional integrations
  such as Redux must be marked optional when the package can operate without them.
- In examples, use root imports when a symbol is exported from `@pastweb/tools`
  and use subpaths only for symbols unavailable from the root or for a
  subpath-specific example.

## React tests

- Use Vitest with React Testing Library and `user-event` for rendered behavior.
  Use `vi` for mocks, timers, and spies.
- Keep tests under `tests/<feature>/<feature>.<environment>.test.tsx` or `.ts`;
  use `.node.test.tsx` for renderer-independent React logic and `.web.test.tsx`
  for DOM/jsdom behavior.
- Name tests with `given..., when..., then...` and cover initial render, prop
  changes, callback ordering, keyboard interaction, focus and ref behavior,
  Strict Mode remounts, SSR-safe behavior, portal cleanup, async errors, and
  optional provider integrations.
- Test adapters through user-visible behavior. Test mediator state transitions in
  `@pastweb/components-core` rather than copying every core test into React.
- Run focused tests first, then `pnpm test --run`, typecheck, and build scripts.
  Treat screenshots and browser tests as artifacts to review, not as a substitute
  for semantic assertions.

## Documentation and review checklist

When a React API changes, update its README/TSDoc example, local and root exports,
peer dependency metadata, and changelog entry when appropriate. Examples should
show the React adapter and identify the shared core contract it consumes.

Before handoff, verify:

- hooks obey stable ordering and dependency rules;
- refs, listeners, subscriptions, timers, and portal registrations clean up;
- Strict Mode and SSR do not duplicate or access unavailable resources;
- JSX preserves shared semantic and accessibility contracts;
- async and error states cannot become stale or stuck;
- package exports and peer dependencies are accurate; and
- focused tests, the full suite, type checks, and builds are either passing or
  their environmental blockers are documented.
