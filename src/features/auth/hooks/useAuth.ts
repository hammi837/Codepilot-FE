import { useAuthStore } from "@/features/auth/store/authStore";
import type { LoginCredentials, RegisterCredentials } from "@/features/auth/types/auth";

/**
 * Convenience hook that exposes auth actions and state.
 * Components should use this hook rather than accessing the store directly.
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading, login, register, logout, initialize } = useAuthStore();

  const handleLogin = async (credentials: LoginCredentials) => {
    await login(credentials);
  };

  const handleRegister = async (credentials: Omit<RegisterCredentials, "confirmPassword">) => {
    return await register(credentials);
  };

  const handleLogout = () => {
    logout();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    initialize,
  };
}
