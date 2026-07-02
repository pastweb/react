import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ROUTE_DEPTH_CONTEXT_KEY,
  ROUTER_CONTEXT_KEY,
  type Location,
  type Route,
  type RouterLinkOptions,
  type SelectedRoute,
  type ViewRouter,
} from '@pastweb/tools';
import { reactive } from '@pastweb/tools/reactivity';
import { GlobalContext } from '../../src/GlobalContext';
import {
  installRouter,
  RouterLink,
  RouterProvider,
  RouterView,
  useLocation,
  useNavigate,
  usePaths,
  useRoute,
  useRouteDepth,
  useRouter,
  useRouterLink,
  useSearchParams,
} from '../../src/router';

afterEach(() => {
  cleanup();
});

function createLocation(pathname: string, search = '', hash = ''): Location {
  const url = new URL(`https://example.test${pathname}${search}${hash}`);

  return {
    hash: url.hash,
    host: url.host,
    hostname: url.hostname,
    href: url.href,
    origin: url.origin,
    pathname: url.pathname,
    port: Number(url.port || 0),
    protocol: url.protocol,
    searchParams: url.searchParams,
    userAgent: 'vitest',
  };
}

function createSelectedRoute(path: string, views: SelectedRoute['views'] = {}): SelectedRoute {
  return {
    parent: false,
    regexp: /.*/,
    path,
    params: {},
    searchParams: new URLSearchParams(),
    setSearchParams: vi.fn(),
    hash: '',
    setHash: vi.fn(),
    views,
    meta: {},
    child: false,
  };
}

function createRouterFixture() {
  const state = reactive({
    location: createLocation('/'),
    currentRoute: createSelectedRoute('/'),
    paths: [
      { path: '/', section: 'public' },
      { path: '/admin', section: 'admin' },
    ] as Array<Route & { section?: string }>,
  });
  const navigate = vi.fn(async () => undefined);
  const setBase = vi.fn();
  const setSearchParams = vi.fn((searchParams: URLSearchParams) => {
    state.location = createLocation(state.location.pathname, `?${searchParams.toString()}`);
  });

  const router = {
    get location() { return state.location; },
    get currentRoute() { return state.currentRoute; },
    get paths() { return state.paths; },
    get isResolving() { return false; },
    get base() { return '/'; },
    ready: Promise.resolve(),
    navigate,
    push: navigate,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn(),
    setBase,
    addRoute: vi.fn(async (route: Route) => {
      state.paths = [...state.paths, route];
    }),
    getRoute: vi.fn(),
    setSearchParams,
    setHash: vi.fn(),
    getRouterLink: vi.fn((options: RouterLinkOptions) => {
      const params = options.params ?? {};
      const pathname = Object.entries(params).reduce(
        (acc, [key, value]) => acc.replace(`:${key}`, String(value)),
        options.path,
      );
      const search = options.searchParams ? `?${options.searchParams.toString()}` : '';
      const hash = options.hash ? `#${options.hash}` : '';
      const href = `${pathname}${search}${hash}`;

      return {
        pathname: href,
        isActive: state.location.pathname.startsWith(pathname),
        isExactActive: state.location.pathname === pathname,
        navigate: (to?: string) => navigate(to ?? href),
      };
    }),
    setRequest: vi.fn(),
    request: {},
    setDocument: vi.fn(),
    documentSettings: {},
    initialSetup: vi.fn(),
    preloader: undefined,
  } as unknown as ViewRouter;

  return { router, state, navigate, setBase, setSearchParams };
}

describe('router', () => {
  it('installs the router and initial route depth into GlobalContext', () => {
    const { router, setBase } = createRouterFixture();

    function Probe() {
      return (
        <>
          <span>{useRouter() === router ? 'router' : 'missing'}</span>
          <span>{useRouteDepth()}</span>
        </>
      );
    }

    render(
      <GlobalContext use={installRouter({ router, base: '/app' })}>
        <Probe />
      </GlobalContext>
    );

    expect(setBase).toHaveBeenCalledWith('/app');
    expect(screen.getByText('router')).toBeInTheDocument();
    expect(screen.getByText('-1')).toBeInTheDocument();
  });

  it('updates location, route, and paths from the reactive router state', async () => {
    const { router, state } = createRouterFixture();

    function Probe() {
      const location = useLocation();
      const route = useRoute();
      const adminPaths = usePaths({ section: 'admin' });

      return (
        <>
          <span>{location.pathname}</span>
          <span>{route.path}</span>
          <span>{adminPaths.map(path => path.path).join(',')}</span>
        </>
      );
    }

    render(
      <GlobalContext update={{
        [ROUTER_CONTEXT_KEY]: router,
        [ROUTE_DEPTH_CONTEXT_KEY]: -1,
      }}>
        <Probe />
      </GlobalContext>
    );

    state.location = createLocation('/settings');
    state.currentRoute = createSelectedRoute('/settings');
    state.paths = [...state.paths, { path: '/settings', section: 'admin' }];

    await waitFor(() => {
      expect(screen.getAllByText('/settings')).toHaveLength(2);
      expect(screen.getByText('/admin,/settings')).toBeInTheDocument();
    });
  });

  it('provides router values through RouterProvider without explicit GlobalContext', () => {
    const { router, setBase } = createRouterFixture();

    function Probe() {
      return (
        <>
          <span>{useRouter() === router ? 'router-provider' : 'missing'}</span>
          <span>{useRouteDepth()}</span>
        </>
      );
    }

    render(
      <RouterProvider router={router} base="/provider">
        <Probe />
      </RouterProvider>
    );

    expect(setBase).toHaveBeenCalledWith('/provider');
    expect(screen.getByText('router-provider')).toBeInTheDocument();
    expect(screen.getByText('-1')).toBeInTheDocument();
  });

  it('renders RouterLink with the generated pathname and navigates on click', () => {
    const { router, navigate } = createRouterFixture();

    render(
      <GlobalContext update={{
        [ROUTER_CONTEXT_KEY]: router,
      }}>
        <RouterLink
          path="/users/:id"
          params={{ id: 7 }}
          searchParams={new URLSearchParams({ tab: 'info' })}
          hash="profile"
        >
          User
        </RouterLink>
      </GlobalContext>
    );

    const link = screen.getByRole('link', { name: 'User' });

    expect(link).toHaveAttribute('href', '/users/7?tab=info#profile');

    fireEvent.click(link);

    expect(navigate).toHaveBeenCalledWith('/users/7?tab=info#profile');
  });

  it('exposes useRouterLink, useNavigate, and useSearchParams helpers', async () => {
    const { router, navigate, setSearchParams } = createRouterFixture();

    function Probe() {
      const link = useRouterLink({ path: '/dashboard' });
      const go = useNavigate();
      const { params, setSearchParams: setParams } = useSearchParams();

      return (
        <>
          <button onClick={() => go('/dashboard')}>Navigate</button>
          <button onClick={() => setParams(new URLSearchParams({ page: '2' }))}>Search</button>
          <span>{link.pathname}</span>
          <span>{params.get('page') ?? 'none'}</span>
        </>
      );
    }

    render(
      <GlobalContext update={{
        [ROUTER_CONTEXT_KEY]: router,
      }}>
        <Probe />
      </GlobalContext>
    );

    expect(screen.getByText('/dashboard')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Navigate' }));
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(navigate).toHaveBeenCalledWith('/dashboard');
    expect(setSearchParams).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('renders the selected RouterView component at the current depth', () => {
    function HomeView({ title }: { title: string }) {
      return <h1>{title}</h1>;
    }

    const { router, state } = createRouterFixture();
    state.currentRoute = createSelectedRoute('/', {
      default: HomeView,
    });

    render(
      <GlobalContext update={{
        [ROUTER_CONTEXT_KEY]: router,
        [ROUTE_DEPTH_CONTEXT_KEY]: -1,
      }}>
        <RouterView title="Home" />
      </GlobalContext>
    );

    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
  });
});
