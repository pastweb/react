import type { ReactNode } from 'react';

/** Function form of slot content. Receives optional slot props. */
export type SlotFunction = (props?: Record<string, any>) => ReactNode;
/** A slot can be a React node, a function slot, or an array of either. */
export type SlotContent = ReactNode | SlotFunction | Array<ReactNode | SlotFunction>;

/** Cache shape reserved for slot collections keyed by component identity. */
export type SlotsCache = WeakMap<symbol, Record<string, SlotContent>>;

/** Props accepted by the `Slot` component returned from `useSlots`. */
export interface SlotProps {
  /** Named slot to render. Defaults to the default slot. */
  name?: string;
  /** Props injected into element or function slot content. */
  props?: Record<string, any>;
  /** Optional mapper used to transform each rendered slot child. */
  map?: (content: ReactNode | SlotFunction, index: number) => ReactNode | ReactNode[];
  /** Fallback content rendered when the requested slot is missing. */
  children?: ReactNode | ReactNode[];
};

/** Props accepted by the `Slots` boundary component. */
export interface SlotsProps {
  /** Child subtree treated as an opaque slot boundary by parent collectors. */
  children: ReactNode;
};

/** Props accepted by `Template`, the marker component for named slot content. */
export interface TemplateProps {
  /** Slot name. Omit to contribute to the default slot. */
  name?: string;
  /** Content to render for the slot, or a function slot. */
  children: ReactNode | SlotFunction;
};
