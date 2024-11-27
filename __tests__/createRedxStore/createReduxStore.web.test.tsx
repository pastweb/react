import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { createReduxStore } from '../../src/createReduxStore';
import { ReduxProvider } from '../../src/createReduxStore/ReduxProvider';
import { configureStore, Reducer } from '@reduxjs/toolkit';

// Mock a simple reducer
const testReducer: Reducer<any> = (state = {}, action) => {
  switch (action.type) {
    case 'TEST_ACTION':
      return { ...state, test: true };
    default:
      return state;
  }
};

// // Mock store creation
// jest.mock('@pastweb/tools', () => ({
//   createAsyncStore: jest.fn().mockImplementation((options) => ({
//     ...options,
//     store: configureStore(options.settings),
//     setStoreReady: jest.fn(),
//     isReady: Promise.resolve(true),
//   })),
//   noop: () => {},
// }));

describe('ReduxProvider', () => {
  // it('should display fallback UI while the store is initializing', async () => {
  //   // Mock store initialization to delay readiness
  //   const mockIsReady = new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 100));
  //   const mockStore = createReduxStore({
  //     settings: {
  //       reducer: {},
  //     },
  //     onInit: jest.fn(),
  //   });
  //   mockStore.isReady = mockIsReady;

  //   const { container } = render(
  //     <ReduxProvider reduxStore={mockStore} fallback={<div>Loading...</div>}>
  //       <div>Child Component</div>
  //     </ReduxProvider>
  //   );

  //   expect(screen.getByText('Loading...')).toBeInTheDocument();

  //   await waitFor(() => {
  //     expect(screen.queryByText('Loading...')).toBeNull();
  //   });

  //   expect(screen.getByText('Child Component')).toBeInTheDocument();
  // });

  it('should provide the Redux store to children components', async () => {
    const store = createReduxStore({
      settings: {
        reducer: { test: testReducer },
      },
    });

    // Adding a reducer and dispatching an action to test the state
    store.addReducer('testReducer', testReducer);

    // A component to test Redux store connection
    const TestComponent = () => {
      const dispatch = store.useDispatch();
      const testValue = store.useSelector((state) => state.test);

      React.useEffect(() => {
        dispatch({ type: 'TEST_ACTION' });
      }, [dispatch]);

      return <div>{testValue ? 'Action Dispatched' : 'No Action'}</div>;
    };

    // Render the ReduxProvider with TestComponent as a child
    render(
      <ReduxProvider reduxStore={store}>
        <TestComponent />
      </ReduxProvider>
    );

    // Wait for the state to update
    await waitFor(() => {
      expect(screen.getByText('Action Dispatched')).toBeInTheDocument();
    });
  });
});
