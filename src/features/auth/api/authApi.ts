import { api } from "@/services/api";
import type { LoginCredentials, RegisterCredentials, TokenResponse, User } from "@/features/auth/types/auth";

export const authApi = {
  /**
   * POST /api/v1/auth/login
   * Authenticates user and returns JWT access token.
   */
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>("/auth/login", credentials);
    return response.data;
  },

  /**
   * POST /api/v1/auth/register
   * Creates a new user account.
   */
  register: async (credentials: Omit<RegisterCredentials, "confirmPassword">): Promise<User> => {
    const response = await api.post<User>("/auth/register", credentials);
    return response.data;
  },

  /**
   * GET /api/v1/users/me
   * Returns the currently authenticated user using the Bearer token.
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>("/users/me");
    return response.data;
  },
};
