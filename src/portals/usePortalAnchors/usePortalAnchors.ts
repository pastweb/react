import { PORTAL_ANCHORS_CONTEXT_KEY } from '@pastweb/tools';
import { getContext } from '../../GlobalContext';

/**
 * Reads the portal anchor ids installed by {@link installPortals}.
 *
 * @typeParam T - Expected anchor id shape.
 *
 * @returns The current portal anchor ids cast to `T`.
 *
 * @example
 * ```tsx
 * const anchors = usePortalAnchors<{ modal: string }>();
 *
 * return <div id={anchors.modal} />;
 * ```
 */
export function usePortalAnchors<T>(): T {
  return getContext<T>(PORTAL_ANCHORS_CONTEXT_KEY);
}
