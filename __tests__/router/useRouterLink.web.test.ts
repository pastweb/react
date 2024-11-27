import { act } from 'react';
import { renderHook } from '@testing-library/react';
import { useRouterLink } from '../../src/router/useRouterLink';
import { useRouter } from '../../src/router/useRouter';

// Mock the useRouter hook
jest.mock('../../src/router/useRouter');

describe('useRouterLink', () => {
  const mockGetRouterLink = jest.fn();
  const mockOnRouteChange = jest.fn();

  beforeEach(() => {
    const mockRouter = {
      getRouterLink: mockGetRouterLink,
      onRouteChange: mockOnRouteChange,
    };

    // Mock the implementation of useRouter
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with the correct link object', () => {
    const mockLink = {
      pathname: '/test-path',
      isActive: false,
      isExactActive: false,
      navigate: jest.fn(),
    };
    
    // Mock the initial getRouterLink response
    mockGetRouterLink.mockReturnValue(mockLink);

    const { result } = renderHook(() =>
      useRouterLink({
        path: '/test-path',
        params: { id: 123 },
        searchParams: new URLSearchParams('query=test'),
        hash: 'section',
      })
    );

    expect(result.current).toEqual(mockLink);
    expect(mockGetRouterLink).toHaveBeenCalledTimes(1);
    expect(mockGetRouterLink).toHaveBeenCalledWith({
      path: '/test-path',
      params: { id: 123 },
      searchParams: new URLSearchParams('query=test'),
      hash: 'section',
    });
  });

  it('should update the link object on route change', () => {
    const initialLink = {
      pathname: '/initial-path',
      isActive: true,
      isExactActive: true,
      navigate: jest.fn(),
    };

    const updatedLink = {
      pathname: '/updated-path',
      isActive: false,
      isExactActive: false,
      navigate: jest.fn(),
    };

    mockGetRouterLink.mockReturnValueOnce(initialLink).mockReturnValueOnce(updatedLink);
    
    const mockRemoveListener = jest.fn();
    mockOnRouteChange.mockReturnValue({ removeListener: mockRemoveListener });

    const { result } = renderHook(() =>
      useRouterLink({
        path: '/initial-path',
        params: { id: 456 },
        searchParams: new URLSearchParams('filter=new'),
        hash: 'info',
      })
    );

    expect(result.current).toEqual(initialLink);
    
    act(() => {
      // Simulate a route change
      mockOnRouteChange.mock.calls[0][0]();
    });

    expect(result.current).toEqual(updatedLink);
    expect(mockGetRouterLink).toHaveBeenCalledTimes(2);
  });

  it('should remove the route change listener on unmount', () => {
    const mockLink = {
      pathname: '/test-path',
      isActive: false,
      isExactActive: false,
      navigate: jest.fn(),
    };

    mockGetRouterLink.mockReturnValue(mockLink);
    
    const mockRemoveListener = jest.fn();
    mockOnRouteChange.mockReturnValue({ removeListener: mockRemoveListener });

    const { unmount } = renderHook(() =>
      useRouterLink({
        path: '/test-path',
        params: { id: 789 },
        searchParams: new URLSearchParams('sort=asc'),
        hash: 'details',
      })
    );

    // Unmount the hook to trigger the cleanup
    unmount();

    expect(mockRemoveListener).toHaveBeenCalledTimes(1);
  });
});
