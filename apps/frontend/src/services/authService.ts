import { LoginSchema, RegisterSchema, AuthResponseSchema } from '@hic/shared-schemas';
import { z } from 'zod';

const API_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL;

// Types generated from Zod schemas
export type LoginData = z.infer<typeof LoginSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  // Helper method to validate and transform auth response
  private validateAuthResponse(validatedResponse: any): AuthResponse {
    if (!validatedResponse.access_token || !validatedResponse.user) {
      throw new Error('Invalid response format: missing required fields');
    }

    // PublicUserSchema fields are optional due to .passthrough(), so we need to check them
    if (!validatedResponse.user.id || !validatedResponse.user.name || !validatedResponse.user.email) {
      throw new Error('Invalid response format: user missing required fields');
    }

    return validatedResponse as AuthResponse;
  }

  // Store token in localStorage
  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  // Get token from localStorage
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // Store user data in localStorage
  private setUser(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  // Get user data from localStorage
  private getUser(): any | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(this.userKey);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  // Clear auth data
  private clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }

  // Get auth headers for API requests
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Get current user
  getCurrentUser(): any | null {
    return this.getUser();
  }

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      // Validate input data
      const validatedData = LoginSchema.parse(data);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed: ${response.status}`);
      }

      const responseData = await response.json();
      
      // Validate response data
      const validatedResponse = AuthResponseSchema.parse(responseData);

      // Ensure required fields are present
      if (!validatedResponse.access_token || !validatedResponse.user) {
        throw new Error('Invalid response format: missing required fields');
      }

      // Store auth data
      this.setToken(validatedResponse.access_token);
      this.setUser(validatedResponse.user);

      return {
        access_token: validatedResponse.access_token,
        user: validatedResponse.user
      };
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  // Register user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Validate input data
      const validatedData = RegisterSchema.parse(data);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Registration failed: ${response.status}`);
      }

      const responseData = await response.json();
      
      // Validate response data
      const validatedResponse = AuthResponseSchema.parse(responseData);

      // Ensure required fields are present
      if (!validatedResponse.access_token || !validatedResponse.user) {
        throw new Error('Invalid response format: missing required fields');
      }

      // Store auth data
      this.setToken(validatedResponse.access_token);
      this.setUser(validatedResponse.user);

      return {
        access_token: validatedResponse.access_token,
        user: validatedResponse.user
      };
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  // Logout user
  logout(): void {
    this.clearAuth();
  }

  // Refresh token (if needed)
  async refreshToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: token }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.access_token);
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Password reset failed: ${response.status}`);
    }
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Password reset failed: ${response.status}`);
    }
  }
}

export const authService = new AuthService();
