import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";

// Public Pages
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";

// Auth Pages
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";

// Dashboard Pages
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { GithubPage } from "@/features/github/pages/GithubPage";
import { RepositoryDetailsPage } from "@/features/github/pages/RepositoryDetailsPage";
import Search from "@/pages/Search";
import Chat from "@/pages/Chat";
import Settings from "@/pages/Settings";

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
    ],
  },
  // Protected routes — wrapped in ProtectedRoute
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "repositories", element: <GithubPage /> },
          { path: "repositories/:id", element: <RepositoryDetailsPage /> },
          { path: "search", element: <Search /> },
          { path: "chat", element: <Chat /> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },
  // 404
  { path: "*", element: <NotFound /> },
]);
