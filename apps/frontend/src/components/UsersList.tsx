"use client";

import { useState, useEffect } from 'react';
import { UserFromSchema } from '@hic/shared-dto';
import { UsersArraySchema } from '@hic/shared-schemas';
import { UserCard } from './UserCard';

export function UsersList() {
  const [users, setUsers] = useState<UserFromSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Always use BFF - it's the correct architecture
        const apiUrl = `${process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:8080/bff'}/users`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Error loading users');
        }
        const data = await response.json();
        
        // Validate data with Zod
        try {
          const validatedUsers = UsersArraySchema.parse(data);
          setUsers(validatedUsers);
        } catch (validationError) {
          console.error('Data validation failed:', validationError);
          throw new Error('Invalid data received from server');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
