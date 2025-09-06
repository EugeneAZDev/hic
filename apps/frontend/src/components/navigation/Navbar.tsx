'use client';

import { useAuth } from '../../contexts/AuthContext';
import { AuthenticatedOnly, UnauthenticatedOnly } from '../auth/ProtectedRoute';

export function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <i className="fas fa-laugh-squint text-2xl text-indigo-600"></i>
            <span className="text-xl font-bold text-gray-800">Humor Image Collection</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <a href="/" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Home
            </a>
            <AuthenticatedOnly>
              <a href="/gallery" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Gallery
              </a>
              <a href="/upload" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Upload
              </a>
            </AuthenticatedOnly>
            <a href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">
              About
            </a>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <UnauthenticatedOnly>
              <a 
                href="/auth" 
                className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
              >
                Sign In
              </a>
            </UnauthenticatedOnly>

            <AuthenticatedOnly>
              <div className="flex items-center space-x-3">
                <a
                  href="/profile"
                  className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center"
                >
                  <i className="fas fa-user mr-2"></i>
                  Profile
                </a>
                <span className="text-gray-700">
                  Welcome, <span className="font-medium">{user?.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Logout
                </button>
              </div>
            </AuthenticatedOnly>

            {/* Mobile menu button */}
            <button className="md:hidden text-gray-600 hover:text-indigo-600 transition-colors">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}