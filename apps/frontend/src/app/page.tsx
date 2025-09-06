'use client';

import React from 'react';
import { UsersList } from '../components/UsersList';
import { Navbar } from '../components/navigation/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { AuthenticatedOnly, UnauthenticatedOnly } from '../components/auth/ProtectedRoute';

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 font-geist-sans">
      <Navbar />
      
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-12">
            Welcome to{' '}
            <span className="text-indigo-600">Humor Image Collection</span>
          </h1>
          
          <UnauthenticatedOnly>
            <p className="text-xl text-gray-600 mb-12">
              Discover, share, and enjoy the funniest images from around the web.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <a
                href="/auth"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300"
              >
                Get Started
              </a>
              <a
                href="/about"
                className="inline-block border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-8 rounded-lg transition duration-300"
              >
                Learn More
              </a>
            </div>
          </UnauthenticatedOnly>

          <AuthenticatedOnly>
            <p className="text-xl text-gray-600 mb-12">
              Welcome back, <span className="font-semibold text-indigo-600">{user?.name}</span>! 
              Ready to explore some humor?
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <a
                href="/gallery"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300"
              >
                Browse Gallery
              </a>
              <a
                href="/upload"
                className="inline-block border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-8 rounded-lg transition duration-300"
              >
                Upload Image
              </a>
            </div>
          </AuthenticatedOnly>
        </div>

        {/* Users List - for development/testing */}
        <AuthenticatedOnly>
          <div className="bg-white rounded-xl shadow-lg p-8 mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Community Members</h2>
            <UsersList />
          </div>
        </AuthenticatedOnly>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <i className="fas fa-laugh-squint text-2xl text-indigo-600"></i>
              <span className="text-lg font-semibold text-gray-800">Humor Image Collection</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>
          <div className="mt-12 pt-12 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>© 2025 Humor Image Collection. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}