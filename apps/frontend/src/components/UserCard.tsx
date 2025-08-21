import { User } from '@shared/types';

type Props = {
  user: User;
};

export function UserCard({ user }: { user: User }) {
  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', margin: '1rem 0' }}>
      <h3>{user.name}</h3>
      <p>ID: {user.id}</p>
    </div>
  );
}