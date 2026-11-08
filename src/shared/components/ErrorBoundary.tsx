import { Component } from "react";
import type { ReactNode } from "react";

export interface ErrorBoundaryProps {
  // Draws the error state. reset() clears the error and re-renders the
  // children, so the page can try the work again.
  fallback: (error: unknown, reset: () => void) => ReactNode;
  // Called by reset() before the children are shown again, e.g. to drop a
  // cached failed load so the next render refetches
  onReset?: () => void;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: unknown;
}

// Catches an error thrown while rendering its children (including one re-thrown
// by use() from a failed load) and shows the fallback instead, so one broken
// part doesn't blank the whole page. A class component, because only a class
// can be an error boundary in React.
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown): void {
    console.error(error);
  }

  reset = (): void => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback(this.state.error, this.reset);
    }
    return this.props.children;
  }
}
