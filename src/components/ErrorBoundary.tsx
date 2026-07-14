import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global Error Boundary — catches uncaught React render errors
 * and displays a user-friendly fallback instead of a white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[ErrorBoundary] Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
          <AlertTriangle className="mb-6 h-16 w-16 text-destructive" />
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="mb-6 max-w-md text-muted-foreground">
            An unexpected error occurred. This has been logged automatically.
          </p>
          {this.state.error && (
            <pre className="mb-6 max-w-xl overflow-auto rounded-lg border border-border bg-muted p-4 text-left text-xs text-destructive">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
