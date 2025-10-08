import { queryConfig } from "../../lib/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import CircularProgress from "@mui/material/CircularProgress";
 
export const AppProvider = ({ children }) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );
 
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <CircularProgress size={60} />
        </div>
      }
    >
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <div>
            
            <p>Something went wrong: {error.message}</p>
            <button onClick={resetErrorBoundary}>Retry</button>
          </div>
        )}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
     </React.Suspense>
  );
};
