import { login } from '@/lib/server/services/authService';
import { LoginForm } from '../../components/forms/LoginForm';

export default async function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-6">
      <LoginForm loginFn={login} />
    </div>
  );
}
