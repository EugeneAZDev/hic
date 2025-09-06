'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { PublicUser, AuthResponse } from '@hic/shared-dto';
import { authApi, AuthApiError } from '../lib/auth-api';


// Auth State Types
interface AuthState {
  user: PublicUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth Actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: PublicUser }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Auth Context Type
interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshAuth: () => Promise<void>;
}

// Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start as loading to check for existing session
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on mount
  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    const storedUser = authApi.getStoredUser();
    const storedToken = authApi.getStoredToken();
    
    if (storedUser && storedToken) {
      // Validate token by making a test request or checking expiration
      try {
        // For now, just trust the stored user if token exists
        // In production, you might want to validate the token with the server
        dispatch({ type: 'AUTH_SUCCESS', payload: storedUser });
      } catch (error) {
        // Token is invalid, clear storage
        authApi.clearStoredTokens();
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    } else {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authApi.login({ email, password }, rememberMe);
      
      // Store tokens
      authApi.storeTokens(response, rememberMe);
      
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error) {
      const errorMessage = error instanceof AuthApiError 
        ? error.message 
        : 'Login failed. Please try again.';
      
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error; // Re-throw so component can handle it
    }
  };

  const register = async (name: string, email: string, password: string) => {
    console.log('Starting registration for:', email);
    dispatch({ type: 'AUTH_START' });
    
    try {
      console.log('Calling authApi.register...');
      const response = await authApi.register({ name, email, password });
      console.log('Registration response received:', response);
      
      // Store tokens (defaulting to session storage for registration)
      console.log('Storing tokens...');
      authApi.storeTokens(response, false);
      
      console.log('Dispatching AUTH_SUCCESS...');
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      console.log('Registration completed successfully');
    } catch (error) {
      console.error('Registration error details:', error);
      const errorMessage = error instanceof AuthApiError 
        ? error.message 
        : 'Registration failed. Please try again.';
      
      console.log('Dispatching AUTH_ERROR:', errorMessage);
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error; // Re-throw so component can handle it
    }
  };

  const logout = async () => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      await authApi.logout();
    } catch (error) {
      // Logout should succeed even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const refreshAuth = async () => {
    // Get refresh token using the private method
    const refreshToken = (authApi as any).getStoredRefreshToken();
    
    if (refreshToken) {
      try {
        const response = await authApi.refreshToken(refreshToken);
        
        // Update stored tokens
        const rememberMe = !!localStorage.getItem('hic_at');
        const storage = rememberMe ? localStorage : sessionStorage;
        const keyPrefix = 'hic_';
        
        storage.setItem(`${keyPrefix}at`, btoa(response.access_token));
        
        if (response.refresh_token) {
          storage.setItem(`${keyPrefix}rt`, btoa(response.refresh_token));
        }
        
        // Keep existing user data
        // (Refresh typically doesn't return user data)
      } catch (error) {
        // Refresh failed, logout user
        await logout();
        throw error;
      }
    } else {
      throw new Error('No refresh token available');
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// HOC for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      // Redirect to auth page or show login form
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
      return null;
    }
    
    return <Component {...props} />;
  };
}