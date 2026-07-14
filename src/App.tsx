import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "@/routes";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function AppContent() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" closeButton />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider defaultTheme="system" storageKey="codepilot-ui-theme">
          <AppContent />
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
