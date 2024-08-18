import { forwardRef, ReactNode, MouseEvent } from 'react';
import { useRouterLink } from '../useRouterLink';

export const RouterLink = forwardRef((props: {
  path: string;
  params?: Record<string, string | number | boolean | null | undefined>;
  searchParams?: URLSearchParams;
  hash?: string;
  className?: string;
  preventNaviate?: boolean;
  children: ReactNode;
}, ref: any) => {
  const { path, className, preventNaviate, children } = props;
  const { navigate } = useRouterLink(props);

  function onClick(e: MouseEvent) {
    e.preventDefault();

    if (!preventNaviate) navigate();
  }

  return (
    <a ref={ref} href={path} className={className} onClick={onClick}>
      { children }
    </a>
  );
});
