import React from 'react';
import { createViewRouter } from '@pastweb/tools';
import { render, screen } from '@testing-library/react';
import { RouterProvider } from '../../src/router/RouterProvider';
import { RouterView } from '../../src/router/RouterView';
import { options } from './rotuer';
import { getLocation } from './getLocation';


describe('RouterView', () => {
  // it('RouterView should render the "HomeView"', () => {
  //   window.history.pushState({}, 'Test Page', '/');
  //   const router = createViewRouter(options);

  //   render(
  //     <RouterProvider router={router}>
  //       <RouterView />
  //     </RouterProvider>
  //   );

  //   // Verify that the router instance is correctly passed down and the correct path is shown
  //   expect(screen.getByTestId('route-home').textContent).toBe('/');
  // });
  
  // it('RouterView should render the "AboutView"', () => {
  //   window.history.pushState({}, 'Test Page', '/about');
  //   const router = createViewRouter(options);

  //   render(
  //     <RouterProvider router={router}>
  //       <RouterView />
  //     </RouterProvider>
  //   );

  //   // Verify that the router instance is correctly passed down and the correct path is shown
  //   expect(screen.getByTestId('route-depth-0').textContent).toBe('/about');
  // });

  // TODO: mock the location to let work the test
  // it('RouterView should render the "AboutView/1"', () => {
  //   const href = 'https://www.example.com/about/something';
  //   const location = getLocation(href);
  //   jest.spyOn(window, 'location', 'get').mockReturnValue(location as unknown as Location)
    
  //   console.log(window.location)
  //   const router = createViewRouter({ ...options, href });

  //   render(
  //     <RouterProvider router={router}>
  //       <RouterView />
  //     </RouterProvider>
  //   );
  //   console.log(document.body.innerHTML)
  //   // Verify that the router instance is correctly passed down and the correct path is shown
  //   // expect(screen.getByTestId('route-depth-1').textContent).toBe('/about/something');
  //   expect(true).toBe(true)
  // });
});
