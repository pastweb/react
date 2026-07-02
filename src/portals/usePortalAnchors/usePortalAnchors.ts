import { useContext } from 'react';
import { PORTAL_ANCHORS_CONTEXT_KEY } from '@pastweb/tools';
import { getContext } from '../../GlobalContext';
import { PORTAL_ANCHORS_REACT_CONTEXT } from '../constants';

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
  const providerAnchors = useContext(PORTAL_ANCHORS_REACT_CONTEXT);
  const globalAnchors = getContext<T>(PORTAL_ANCHORS_CONTEXT_KEY);

  return (providerAnchors ?? globalAnchors) as T;
}
