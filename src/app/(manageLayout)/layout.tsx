import { Header } from '@/components/Header';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-screen w-full max-w-8xl flex-col items-center p-4 md:p-8">
        {children}
      </main>
    </>
  );
}
