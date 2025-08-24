"use client";

import { useState, useEffect } from 'react';
import { User } from '@shared/types';
import { UserCard } from './UserCard';

export function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // In production, frontend should use /api path through nginx
        // In development, use direct backend URL
        const isProduction = process.env.NODE_ENV === 'production';
        
        let backendUrl;
        if (isProduction) {
          // Use relative path for production (nginx will proxy to backend)
          backendUrl = '/api';
        } else {
          // Use direct backend URL for development
          backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:7001';
        }
        
        const response = await fetch(`${backendUrl}/users`);
        if (!response.ok) {
          throw new Error('Error loading users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Users List</h2>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
