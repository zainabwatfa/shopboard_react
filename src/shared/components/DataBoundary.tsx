import { Suspense } from "react";
import type { ReactNode } from "react";
import { getLoadErrorMessage } from "../../lib/messages.ts";
import { ErrorBoundary } from "./ErrorBoundary.tsx";
import { StatusMessage } from "./StatusMessage.tsx";

export interface DataBoundaryProps {
  // Id for the loading and error status lines (e.g. "product-status")
  statusId: string;
  // The line shown while the data loads, e.g. "Loading products…"
  loadingMessage: string;
  // Drops the cached load so "Try again" refetches
  onRetry: () => void;
  // Turns the error into the line to show; defaults to getLoadErrorMessage
  formatError?: (error: unknown) => string;
  children: ReactNode;
}

// Wraps a part of a page that reads data with use(): Suspense shows the loading
// line while it loads, and the Error Boundary shows the same error card with
// "Try again" if it fails. The header, nav and footer sit outside this, so they
// stay on screen whatever happens here.
export function DataBoundary({
  statusId,
  loadingMessage,
  onRetry,
  formatError = getLoadErrorMessage,
  children,
}: DataBoundaryProps) {
  return (
    <ErrorBoundary
      onReset={onRetry}
      fallback={(error, reset) => (
        <StatusMessage
          id={statusId}
          tone="error"
          message={formatError(error)}
          action={{ label: "Try again", onClick: reset }}
        />
      )}
    >
      <Suspense
        fallback={
          <StatusMessage id={statusId} tone="normal" message={loadingMessage} />
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
