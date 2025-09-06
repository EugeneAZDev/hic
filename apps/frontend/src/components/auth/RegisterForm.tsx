'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterSchema } from '@hic/shared-schemas';
import { Register } from '@hic/shared-dto';
import { ZodError } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { AuthApiError } from '../../lib/auth-api';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register: registerUser, isLoading: authLoading, error: authError, clearError } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<Register & { confirmPassword: string }>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const validateField = (field: keyof Register, value: string) => {
    try {
      if (field === 'name' || field === 'email' || field === 'password') {
        const fieldSchema = RegisterSchema.shape[field];
        fieldSchema.parse(value);
      }
      setErrors(prev => ({ ...prev, [field]: '' }));
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0]?.message || 'Invalid value' }));
      }
    }
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (confirmPassword !== formData.password) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Validate field if it's not confirmPassword
    if (field !== 'confirmPassword') {
      validateField(field as keyof Register, value);
    }
    
    // If password field changed, also validate confirmPassword
    if (field === 'password' && formData.confirmPassword) {
      validateConfirmPassword(formData.confirmPassword);
    }
  };

  const handleBlur = (field: keyof typeof formData) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (field === 'confirmPassword') {
      validateConfirmPassword(value);
    } else if (field !== 'confirmPassword') {
      validateField(field as keyof Register, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous auth errors
    clearError();
    
    // Validate all fields first
    const fieldErrors: Record<string, string> = {};
    
    // Validate name
    try {
      RegisterSchema.shape.name.parse(formData.name);
    } catch (error) {
      if (error instanceof ZodError) {
        fieldErrors.name = error.errors[0]?.message || 'Invalid name';
      }
    }
    
    // Validate email
    try {
      RegisterSchema.shape.email.parse(formData.email);
    } catch (error) {
      if (error instanceof ZodError) {
        fieldErrors.email = error.errors[0]?.message || 'Invalid email';
      }
    }
    
    // Validate password
    try {
      RegisterSchema.shape.password.parse(formData.password);
    } catch (error) {
      if (error instanceof ZodError) {
        fieldErrors.password = error.errors[0]?.message || 'Invalid password';
      }
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      fieldErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate terms
    if (!acceptTerms) {
      fieldErrors.terms = 'You must accept the terms and conditions';
    }
    
    // If there are validation errors, show them and stop
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    
    try {
      // All validation passed, proceed with registration
      const { confirmPassword, ...registerData } = formData;
      setErrors({});
      setIsLoading(true);

      await registerUser(registerData.name, registerData.email, registerData.password);
      
      // Only redirect on successful registration
      router.push('/');
    } catch (error) {
      if (error instanceof ZodError) {
        const zodFieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            zodFieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(zodFieldErrors);
      } else if (error instanceof AuthApiError) {
        // Auth errors are handled by the context
        console.error('Registration error:', error);
      } else {
        console.error('Unexpected registration error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h3>
      
      {/* Display auth errors */}
      {authError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {authError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="register-name"
            value={formData.name}
            onChange={handleInputChange('name')}
            onBlur={handleBlur('name')}
            className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
            disabled={isLoading}
            autoComplete="name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="register-email"
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
          <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="register-password"
            value={formData.password}
            onChange={handleInputChange('password')}
            onBlur={handleBlur('password')}
            className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
            disabled={isLoading}
            autoComplete="new-password"
          />
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 8 characters and contain uppercase, lowercase, number, and special character
          </p>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="register-confirm-password"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
            disabled={isLoading}
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => {
              setAcceptTerms(e.target.checked);
              if (e.target.checked) {
                setErrors(prev => ({ ...prev, terms: '' }));
              }
            }}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
            disabled={isLoading}
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500 transition-colors">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500 transition-colors">
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-600">{errors.terms}</p>
        )}

        <button
          type="submit"
          disabled={isLoading || authLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
        >
          {(isLoading || authLoading) ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Account...
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
            disabled={isLoading}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}