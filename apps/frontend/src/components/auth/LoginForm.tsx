'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginSchema } from '@hic/shared-schemas';
import { Login } from '@hic/shared-dto';
import { ZodError } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { AuthApiError } from '../../lib/auth-api';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { login, isLoading: authLoading, error: authError, clearError } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<Login>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateField = (field: keyof Login, value: string) => {
    try {
      const fieldSchema = LoginSchema.shape[field];
      fieldSchema.parse(value);
      setErrors(prev => ({ ...prev, [field]: '' }));
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0]?.message || 'Invalid value' }));
      }
    }
  };

  const handleInputChange = (field: keyof Login) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: keyof Login) => (e: React.FocusEvent<HTMLInputElement>) => {
    validateField(field, e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous auth errors
    clearError();
    
    try {
      // Validate entire form
      const validatedData = LoginSchema.parse(formData);
      setErrors({});
      setIsLoading(true);

      await login(validatedData.email, validatedData.password, rememberMe);
      
      // Redirect to dashboard or previous page on successful login
      router.push('/');
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else if (error instanceof AuthApiError) {
        // Auth errors are handled by the context
        console.error('Login error:', error);
      } else {
        console.error('Unexpected login error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    // TODO: Implement social login
    console.log(`Social login with ${provider}`);
    alert(`${provider} login not implemented yet`);
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome Back!</h3>
      
      {/* Display auth errors */}
      {authError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {authError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="login-email"
            value={formData.email}
            onChange={handleInputChange('email')}
            onBlur={handleBlur('email')}
            className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your@email.com"
            disabled={isLoading}
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="login-password"
            value={formData.password}
            onChange={handleInputChange('password')}
            onBlur={handleBlur('password')}
            className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
            disabled={isLoading}
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <button
            type="button"
            className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading || authLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
        >
          {(isLoading || authLoading) ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
            disabled={isLoading}
          >
            Sign up
          </button>
        </p>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <i className="fab fa-google text-red-500 mr-2"></i>
            Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin('facebook')}
            disabled={isLoading}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <i className="fab fa-facebook text-blue-600 mr-2"></i>
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}