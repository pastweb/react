import React from 'react';
import { render, screen } from '@testing-library/react';
import { RouterProvider } from '../../src/router/RouterProvider';
import { useRouter } from '../../src/router/useRouter';
import { router } from './rotuer';

// A simple test component that uses the useRouter hook to get the router instance
const TestComponent = () => {
  const routerInstance = useRouter();
  return <div data-testid="router-path">{routerInstance.currentRoute.path}</div>;
};

describe('RouterProvider with custom router', () => {
  beforeEach(() => {
    // Set the window location to the desired route before each test
    window.history.pushState({}, 'Test Page', '/');
  });

  it('should pass the custom router to the useRouter hook', () => {
    render(
      <RouterProvider router={router}>
        <TestComponent />
      </RouterProvider>
    );

    // Verify that the router instance is correctly passed down and the correct path is shown
    expect(screen.getByTestId('router-path').textContent).toBe('/');
  });
});
