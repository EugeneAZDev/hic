import { Login, Register, AuthResponse, TokenResponse } from '@hic/shared-dto';
import { AuthResponseSchema, TokenResponseSchema } from '@hic/shared-schemas';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:8080/bff';

class AuthApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

class AuthApi {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    responseSchema?: any
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Auth api url:', url);
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Get CSRF token from meta tag or cookie if available
    const csrfToken = this.getCSRFToken();
    if (csrfToken) {
      defaultHeaders['X-CSRF-Token'] = csrfToken;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: defaultHeaders,
        credentials: 'include', // Include cookies for session management
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        let errorCode = response.status.toString();
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          errorCode = errorData.code || errorCode;
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        
        throw new AuthApiError(response.status, errorMessage, errorCode);
      }

      const data = await response.json();
      
      // Validate response with Zod schema if provided
      if (responseSchema) {
        try {
          return responseSchema.parse(data);
        } catch (validationError) {
          console.error('API response validation failed:', validationError);
          throw new AuthApiError(500, 'Invalid response from server');
        }
      }
      
      return data;
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error;
      }
      
      // Network or other errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new AuthApiError(0, 'Network error. Please check your connection.');
      }
      
      throw new AuthApiError(500, 'An unexpected error occurred');
    }
  }

  private getCSRFToken(): string | null {
    // Try to get CSRF token from meta tag
    const metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    if (metaTag) {
      return metaTag.content;
    }
    
    // Try to get from cookie
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrf-token' || name === 'XSRF-TOKEN') {
        return decodeURIComponent(value);
      }
    }
    
    return null;
  }

  async login(credentials: Login, rememberMe = false): Promise<AuthResponse> {
    const body = { ...credentials, rememberMe };
    
    return this.makeRequest<AuthResponse>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      AuthResponseSchema
    );
  }

  async register(userData: Register): Promise<AuthResponse> {
    console.log('auth-api: register called with:', { ...userData, password: '[HIDDEN]' });
    console.log('auth-api: API_BASE_URL:', API_BASE_URL);
    
    try {
      console.log('auth-api: about to call makeRequest...');
      const response = await this.makeRequest<AuthResponse>(
        '/auth/register',
        {
          method: 'POST',
          body: JSON.stringify(userData),
        },
        AuthResponseSchema
      );
      console.log('auth-api: register response received:', response);
      return response;
    } catch (error) {
      console.error('auth-api: register error:', error);
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    return this.makeRequest<TokenResponse>(
      '/refresh',
      {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      },
      TokenResponseSchema
    );
  }

  // Get stored refresh token
  private getStoredRefreshToken(): string | null {
    const keyPrefix = 'hic_';
    
    try {
      const token = localStorage.getItem(`${keyPrefix}rt`) || sessionStorage.getItem(`${keyPrefix}rt`);
      return token ? atob(token) : null;
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    // Clear any stored tokens
    this.clearStoredTokens();
    
    // Optionally call logout endpoint if it exists
    try {
      await this.makeRequest('/auth/logout', { 
        method: 'POST',
        body: JSON.stringify({}) // Send empty object to satisfy JSON content-type requirement
      });
    } catch (error) {
      // Logout endpoint might not exist, that's OK
      console.warn('Logout endpoint not available:', error);
    }
  }

  // Token management utilities with enhanced security
  storeTokens(authResponse: AuthResponse, rememberMe = false): void {
    // Clear any existing tokens first
    this.clearStoredTokens();
    
    const storage = rememberMe ? localStorage : sessionStorage;
    const keyPrefix = 'hic_';
    
    // Store with prefixed keys and basic obfuscation
    try {
      storage.setItem(`${keyPrefix}at`, btoa(authResponse.access_token));
      storage.setItem(`${keyPrefix}user`, btoa(JSON.stringify(authResponse.user)));
      
      // If there's a refresh token, store it securely
      if ('refresh_token' in authResponse) {
        storage.setItem(`${keyPrefix}rt`, btoa((authResponse as any).refresh_token));
      }
      
      // Store expiration time for automatic cleanup
      const expirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
      storage.setItem(`${keyPrefix}exp`, expirationTime.toString());
    } catch (error) {
      console.error('Failed to store authentication tokens:', error);
    }
  }

  getStoredToken(): string | null {
    const keyPrefix = 'hic_';
    
    try {
      // Check expiration first
      const expStr = localStorage.getItem(`${keyPrefix}exp`) || sessionStorage.getItem(`${keyPrefix}exp`);
      if (expStr) {
        const expTime = parseInt(expStr);
        if (Date.now() > expTime) {
          this.clearStoredTokens();
          return null;
        }
      }
      
      const token = localStorage.getItem(`${keyPrefix}at`) || sessionStorage.getItem(`${keyPrefix}at`);
      return token ? atob(token) : null;
    } catch (error) {
      console.error('Failed to retrieve stored token:', error);
      this.clearStoredTokens();
      return null;
    }
  }

  getStoredUser(): any | null {
    const keyPrefix = 'hic_';
    
    try {
      const userStr = localStorage.getItem(`${keyPrefix}user`) || sessionStorage.getItem(`${keyPrefix}user`);
      if (userStr) {
        const decoded = atob(userStr);
        return JSON.parse(decoded);
      }
    } catch (error) {
      console.error('Failed to retrieve stored user:', error);
      this.clearStoredTokens();
    }
    return null;
  }

  clearStoredTokens(): void {
    const keyPrefix = 'hic_';
    const keys = [`${keyPrefix}at`, `${keyPrefix}rt`, `${keyPrefix}user`, `${keyPrefix}exp`];
    
    keys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    // Also clear old format keys for backward compatibility
    const oldKeys = ['access_token', 'refresh_token', 'user'];
    oldKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  // Utility method to add auth header to requests
  getAuthHeaders(): Record<string, string> {
    const token = this.getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Export singleton instance
export const authApi = new AuthApi();
export { AuthApiError };
export type { AuthResponse, TokenResponse };