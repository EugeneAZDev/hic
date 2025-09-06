import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Humor Image Collection',
  description: 'Sign in or create an account to access Humor Image Collection',
  robots: 'noindex, nofollow', // Prevent indexing of auth pages
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 font-geist-sans">
      {children}
    </div>
  );
}