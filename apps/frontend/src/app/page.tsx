import { UserCard } from '../components/UserCard';
import { User } from '@shared/types';
const user: User = { id: '1', name: 'John Doe' };

export default function Home() {
  return (
    <main>
      <h1>Test Page</h1>
      <UserCard user={user} />
    </main>
  );
}