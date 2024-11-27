import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RouterLink } from '../../src/router/RouterLink';
import { useRouterLink } from '../../src/router/useRouterLink';

// Mock the useRouterLink hook
jest.mock('../../src/router/useRouterLink');

describe('RouterLink', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Reset the mock before each test
    mockNavigate.mockClear();
    
    // Mock the useRouterLink to return a mocked navigate function
    (useRouterLink as jest.Mock).mockReturnValue({ navigate: mockNavigate });
  });

  it('should render the link with the correct path', () => {
    render(
      <RouterLink path="/test-path" className="test-class">
        Test Link
      </RouterLink>
    );

    const linkElement = screen.getByText('Test Link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/test-path');
    expect(linkElement).toHaveClass('test-class');
  });

  it('should call navigate when the link is clicked and preventNavigate is false', () => {
    render(
      <RouterLink path="/test-path">
        Test Link
      </RouterLink>
    );

    const linkElement = screen.getByText('Test Link');

    fireEvent.click(linkElement);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('should not call navigate when the link is clicked and preventNavigate is true', () => {
    render(
      <RouterLink path="/test-path" preventNavigate>
        Test Link
      </RouterLink>
    );

    const linkElement = screen.getByText('Test Link');

    fireEvent.click(linkElement);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should forward the ref to the anchor element', () => {
    const ref = React.createRef<HTMLAnchorElement>();

    render(
      <RouterLink path="/test-path" ref={ref}>
        Test Link
      </RouterLink>
    );

    const linkElement = screen.getByText('Test Link');
    expect(ref.current).toBe(linkElement);
  });
});
