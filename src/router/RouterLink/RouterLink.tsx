import { forwardRef, ReactNode, MouseEvent } from 'react';
import { useRouterLink } from '../useRouterLink';

/**
 * The `RouterLink` component renders a navigational link that integrates with the application's routing system.
 * It allows for navigation within the application without triggering a full page reload.
 *
 * @param props - The props for the `RouterLink` component.
 * @param props.path - The target path for the link.
 * @param props.params - (Optional) An object containing route parameters.
 * @param props.searchParams - (Optional) A `URLSearchParams` object representing query parameters.
 * @param props.hash - (Optional) A string representing the fragment identifier for the link.
 * @param props.className - (Optional) A string of classes to apply to the anchor element.
 * @param props.preventNavigate - (Optional) A boolean to prevent navigation when the link is clicked. Defaults to `false`.
 * @param props.children - The content to be displayed inside the link.
 * @param ref - A React ref that is forwarded to the anchor (`<a>`) element.
 *
 * @returns A React element that renders an anchor (`<a>`) tag with the specified path and properties.
 *
 * @example
 * // Example usage:
 * <RouterLink path="/dashboard" className="nav-link">
 *   Go to Dashboard
 * </RouterLink>
 */
export const RouterLink = forwardRef((props: {
  path: string;
  params?: Record<string, string | number | boolean | null | undefined>;
  searchParams?: URLSearchParams;
  hash?: string;
  className?: string;
  preventNavigate?: boolean;
  children: ReactNode;
}, ref: any) => {
  const { path, className, preventNavigate, children } = props;
  const { navigate } = useRouterLink(props);

  function onClick(e: MouseEvent) {
    e.preventDefault();

    if (!preventNavigate) navigate();
  }

  return (
    <a ref={ref} href={path} className={className} onClick={onClick}>
      { children }
    </a>
  );
});
