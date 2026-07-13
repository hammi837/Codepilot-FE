import { create } from "zustand";
import { authApi } from "@/features/auth/api/authApi";
import { getStoredToken, setStoredToken, removeStoredToken } from "@/services/api";
import type { User, LoginCredentials, RegisterCredentials } from "@/features/auth/types/auth";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: Omit<RegisterCredentials, "confirmPassword">) => Promise<User>;
  logout: () => void;
  initialize: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: getStoredToken(),
  isAuthenticated: false,
  isLoading: true,

  /**
   * Authenticate the user — stores the token, then fetches the full profile.
   */
  login: async (credentials: LoginCredentials) => {
    const tokenResponse = await authApi.login(credentials);
    setStoredToken(tokenResponse.access_token);
    const user = await authApi.getCurrentUser();
    set({
      token: tokenResponse.access_token,
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  /**
   * Register a new user — returns user (caller handles redirect/toast).
   */
  register: async (credentials) => {
    const user = await authApi.register(credentials);
    return user;
  },

  /**
   * Clear all auth state and redirect to login.
   */
  logout: () => {
    removeStoredToken();
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  /**
   * Called on app mount — restores session from localStorage token.
   */
  initialize: async () => {
    const token = getStoredToken();
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }
    try {
      const user = await authApi.getCurrentUser();
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch {
      removeStoredToken();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user: User) => set({ user }),
}));
