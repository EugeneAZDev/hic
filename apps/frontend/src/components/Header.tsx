'use client';

import { useState } from 'react';

interface HeaderProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export function Header({ isAuthenticated = false, onLogout }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <h1 className="text-2xl font-bold text-gray-800">Humor Image Collection</h1>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
            Gallery
          </a>
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
            About
          </a>
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
            Contact
          </a>
          {isAuthenticated && (
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Logout
            </button>
          )}
        </nav>

        <button
          className="md:hidden text-gray-600"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md">
              Home
            </a>
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md">
              Gallery
            </a>
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md">
              About
            </a>
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md">
              Contact
            </a>
            {isAuthenticated && (
              <button
                onClick={onLogout}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
