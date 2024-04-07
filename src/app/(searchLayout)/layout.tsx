import { Header } from '@/components/Header';
import { validateRequest } from '@/lib/auth';
import { CookiesToast } from './LoginSuccessToast';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, cart } = await validateRequest();

  return (
    <>
      <Header user={user} cart={cart} showSearch />
      <main className="mx-auto flex min-h-screen w-full max-w-8xl flex-col items-center p-4 md:p-8">
        {children}
      </main>
      <CookiesToast name={user?.name} />
    </>
  );
}
