'use client';

import { useEffect } from 'react';

interface CSRFTokenProps {
  token?: string;
}

export function CSRFToken({ token }: CSRFTokenProps) {
  useEffect(() => {
    if (token) {
      // Set CSRF token in meta tag for API client to use
      let metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
      
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.name = 'csrf-token';
        document.head.appendChild(metaTag);
      }
      
      metaTag.content = token;
    }
  }, [token]);

  // Also render as meta tag for SSR
  if (token) {
    return <meta name="csrf-token" content={token} />;
  }

  return null;
}

// Hook to get CSRF token from various sources
export function useCSRFToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // Try to get from meta tag
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