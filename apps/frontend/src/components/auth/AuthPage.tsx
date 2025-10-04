'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { FloatingElement } from './FloatingElement';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col font-geist-sans">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fas fa-laugh-squint text-3xl text-indigo-600"></i>
            <h1 className="text-2xl font-bold text-gray-800">Humor Image Collection</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 transition-colors">Home</Link>
            <Link href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Gallery</Link>
            <Link href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">About</Link>
            <Link href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</Link>
          </nav>
          <button className="md:hidden text-gray-600 hover:text-indigo-600 transition-colors">
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Hero Text */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Laugh Out Loud with Our{' '}
              <span className="text-indigo-600">Humor Image Collection</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join our community to discover, share, and enjoy the funniest images from around the web. 
              Your daily dose of laughter guaranteed!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300">
                Explore Gallery
              </button>
              <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-6 rounded-lg transition duration-300">
                How It Works
              </button>
            </div>
          </div>

          {/* Auth Container */}
          <div className="lg:w-1/2 max-w-md w-full">
            <div className="bg-white rounded-xl shadow-xl p-8 transition-all duration-300">
              {isLogin ? (
                <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
              ) : (
                <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Decorative Elements */}
      <div className="hidden lg:block">
        <FloatingElement 
          className="top-20 left-10 w-16 h-16 bg-purple-200"
          delay={0}
        />
        <FloatingElement 
          className="top-1/3 right-20 w-24 h-24 bg-indigo-200"
          delay={1}
        />
        <FloatingElement 
          className="bottom-20 left-1/4 w-20 h-20 bg-pink-200"
          delay={2}
        />
        <FloatingElement 
          className="bottom-1/3 right-10 w-16 h-16 bg-blue-200"
          delay={3}
        />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <i className="fas fa-laugh-squint text-2xl text-indigo-600"></i>
              <span className="text-lg font-semibold text-gray-800">Humor Image Collection</span>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <i className="fab fa-twitter"></i>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <i className="fab fa-instagram"></i>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <i className="fab fa-facebook"></i>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <i className="fab fa-pinterest"></i>
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>© 2025 Humor Image Collection. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}