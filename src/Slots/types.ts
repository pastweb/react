import type { FunctionComponent, ReactNode } from 'react';

/** Collected slot content. Always an array, including when the slot has one node. */
export type SlotContent = ReactNode[];

/** Collected slot content keyed by slot name. Missing slots are `undefined`. */
export interface SlotsMap {
  default?: SlotContent;
  [name: string]: SlotContent | undefined;
}

/** Cache shape reserved for slot collections keyed by component identity. */
export type SlotsCache = WeakMap<symbol, SlotsMap>;

/** Props accepted by the `Slot` component returned from `useSlots`. */
export interface SlotProps {
  /** Named slot to render. Defaults to the default slot. */
  name?: string;
  /** Props injected into element slot content. */
  props?: Record<string, any>;
  /** Optional mapper for projected slot content. Fallback children are not mapped. */
  map?: (content: ReactNode, index: number) => ReactNode | ReactNode[];
  /** Fallback content rendered as-is when the requested slot is missing. */
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
  /**
   * Content to project into the slot.
   *
   * Accepts a single node, an array of nodes, or a collected `slots` entry
   * forwarded from another `useSlots` host.
   */
  children?: ReactNode;
};

/** Result of `useSlots`, including collected content for forwarding. */
export interface UseSlotsResult {
  /** Boundary component for nested slot-aware components. */
  Slots: FunctionComponent<SlotsProps>;
  /** Renderer for default or named slot content. */
  Slot: FunctionComponent<SlotProps>;
  /** Collected slot content, including `default`, for forwarding into `Template`. */
  slots: SlotsMap;
}
