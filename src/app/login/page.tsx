import { validateRequest } from '@/lib/auth';
import { login } from '@/lib/server/auth/authService';
import { redirect } from 'next/navigation';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  const { user } = await validateRequest();

  if (user) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <LoginForm loginFn={login} />
    </div>
  );
}
