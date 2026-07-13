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

// Dashboard Pages
import Dashboard from "@/pages/Dashboard";
import Repositories from "@/pages/Repositories";
import RepositoryDetails from "@/pages/RepositoryDetails";
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
          { path: "dashboard", element: <Dashboard /> },
          { path: "repositories", element: <Repositories /> },
          { path: "repositories/:id", element: <RepositoryDetails /> },
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
