'use client';

import { useState, useEffect } from 'react';
import { PublicUserSchema } from '@hic/shared-schemas';

type User = typeof PublicUserSchema._type;

export function UserStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking user authentication status
    // In a real app, this would check localStorage, cookies, or make an API call
    const checkAuthStatus = async () => {
      try {
        // Check if user is logged in (e.g., from localStorage)
        const token = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-800 text-lg font-medium mb-2">
          User Registered
        </div>
        <div className="text-green-700">
          Email: {user.email}
        </div>
        <div className="text-green-600 text-sm mt-1">
          Name: {user.name}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="text-red-800 text-lg font-medium">
        Not Registered
      </div>
      <div className="text-red-600 text-sm mt-2">
        Please log in or register to access your account
      </div>
    </div>
  );
}
