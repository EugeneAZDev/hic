'use client';

import { AuthPage } from '../../components/auth/AuthPage';
import { useEffect } from 'react';

export default function Auth() {
  useEffect(() => {
    console.log('=== AUTH PAGE DEBUG (BROWSER) ===');
    console.log('NEXT_PUBLIC_BFF_URL:', process.env.NEXT_PUBLIC_BFF_URL);
    console.log('NEXT_PUBLIC_AUTH_SERVICE_URL:', process.env.NEXT_PUBLIC_AUTH_SERVICE_URL);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('All env vars:', process.env);
    console.log('=== END AUTH PAGE DEBUG ===');
  }, []);
  
  return <AuthPage />;
}