import { Header } from '@/components/Header';
import { CookiesToast } from './LoginSuccessToast';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header showSearch />
      <main className="mx-auto flex min-h-screen w-full max-w-8xl flex-col items-center p-4 md:p-8">
        {children}
      </main>
      <CookiesToast />
    </>
  );
}
