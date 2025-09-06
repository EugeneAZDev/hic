'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navbar } from '../../components/navigation/Navbar';
import { AuthenticatedOnly } from '../../components/auth/ProtectedRoute';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 font-geist-sans">
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
        <AuthenticatedOnly>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-indigo-600">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Profile
                </h1>
                <p className="text-gray-600">
                  Manage your account information
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-800">{user?.name}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-800">{user?.email}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User ID
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                      <p className="text-xs text-gray-600 font-mono">{user?.id}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 pt-6">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300">
                    Edit Profile
                  </button>
                  <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition duration-300">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AuthenticatedOnly>
      </main>
    </div>
  );
}