import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ComponentErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ComponentErrorBoundaryState {
  hasError: boolean;
}

export class ComponentErrorBoundary extends Component<ComponentErrorBoundaryProps, ComponentErrorBoundaryState> {
  public override state: ComponentErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(_: Error): ComponentErrorBoundaryState {
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Module Federation Loading Error:", error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
