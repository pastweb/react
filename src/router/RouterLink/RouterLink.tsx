import { forwardRef } from 'react';
import { useRouterLink } from '../useRouterLink';
import type { ReactNode, MouseEvent } from 'react';

export interface RouterLinkProps {
  path: string;
  params?: Record<string, string | number | boolean | null | undefined>;
  searchParams?: URLSearchParams;
  hash?: string;
  className?: string;
  preventNavigate?: boolean;
  children: ReactNode;
}

/**
 * Renders a router-aware anchor.
 *
 * The `href` comes from `router.getRouterLink`, so route params, query params,
 * hash, and active-route matching all use the same tools router logic as
 * `useRouterLink`.
 *
 * @param props - Router link options plus anchor presentation props.
 * @param ref - Forwarded anchor ref.
 * @returns An anchor element.
 *
 * @example
 * ```tsx
 * <RouterLink path="/users/:id" params={{ id: 123 }}>
 *   User profile
 * </RouterLink>
 * ```
 */
export const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => {
  const { className, preventNavigate, children } = props;
  const { pathname, navigate } = useRouterLink(props);

  function onClick(e: MouseEvent) {
    e.preventDefault();

    if (!preventNavigate) navigate();
  }

  return (
    <a ref={ref} href={pathname} className={className} onClick={onClick}>
      { children }
    </a>
  );
});
