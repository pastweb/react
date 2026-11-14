# `@pastweb/react` contribution guide

## Package identity

`@pastweb/react` is Pastweb's React integration layer. It adapts the shared
contracts from `@pastweb/tools` and `@pastweb/components-core` to React hooks,
JSX, refs, context, portals, and event types. It owns React lifecycle and
rendering integration; it must not duplicate framework-neutral mediator logic.

Apply the inherited package guidance in [`../tools/AGENTS.md`](../tools/AGENTS.md)
and [`../tools/SKILLS.md`](../tools/SKILLS.md), together with the component
contracts documented by `@pastweb/components-core`.

## Architectural boundaries

- Keep shared behavior in `@pastweb/tools` or `@pastweb/components-core`; keep
  React-specific behavior in this package.
- Do not import private or closed-source packages into this public package.
- Do not expose React component instances, JSX, React events, or DOM classes from
  framework-neutral packages.
- Preserve the public mediator contracts while adapting refs, events, context,
  and lifecycle to React.
- Prefer local feature barrels and deliberate package-root exports. Keep public
  documentation and examples safe for release.

## React-specific standards

- Follow the Rules of Hooks. Hooks must be called unconditionally and in stable
  order, with dependency arrays describing every changing value they read.
- Keep callbacks and context values stable when their identity is part of a
  mediator, portal, router, or store contract. Avoid render-time recreation that
  causes subscriptions or registrations to churn.
- Use the package's ref bridge for framework refs. Forward refs and expose
  imperative handles only when the shared component contract requires them; do
  not leak renderer-only refs into mediators.
- Adapt native React events at the renderer boundary and preserve the shared
  callback argument order. Do not add business behavior to JSX event handlers
  that belongs in the mediator.
- Use the package `Slots`, `Template`, and context helpers for shared slot and
  context semantics. Keep fallback rendering and React-node conversion in this
  package rather than in `@pastweb/tools`.
- Make async components, portal providers, router providers, and window-manager
  bridges safe under Strict Mode, repeated mounting, unmounting, and SSR.
- Use React Testing Library and `user-event` for rendered behavior; test shared
  mediator behavior through the core package instead of duplicating its tests.

## Related guidance

Detailed React implementation, testing, integration, and review workflows are in
[`SKILLS.md`](./SKILLS.md). General helper organization, API compatibility,
documentation, and release rules remain inherited from `@pastweb/tools`.
