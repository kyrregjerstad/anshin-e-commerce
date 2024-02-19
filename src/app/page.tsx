import { CartIcon } from '@/components/CartIcon';
import { GridItem } from '@/components/GridItem';

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-50 flex w-full items-center justify-center px-1">
        <nav className="bg-tea-100 flex w-full max-w-[calc(1920px_+_8rem)] items-center rounded-b-3xl border p-4 drop-shadow-sm">
          <ul className="flex w-full items-center justify-between gap-4">
            <li>Anshin</li>
            <li>
              <CartIcon />
            </li>
          </ul>
        </nav>
      </header>
      <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
        <div className="max-w-10xl flex w-full flex-col items-center gap-12">
          <section className="grid w-full grid-cols-2 grid-rows-8 gap-2 sm:aspect-[5/2] sm:grid-cols-8 sm:grid-rows-2 sm:gap-2 md:gap-4 xl:gap-8">
            <div className="drop-shadow-flat from-tea-100 to-tea-50 col-span-2 row-span-2 rounded-3xl border bg-gradient-to-tr sm:col-span-6 sm:row-span-1"></div>
            <div className="drop-shadow-flat from-ember-500 to-ember-400 col-span-1 row-span-4 rounded-3xl border bg-gradient-to-tr sm:col-span-1 sm:row-span-1 "></div>
            <div className="drop-shadow-flat from-tea-300 to-tea-200 col-span-1 row-span-2 aspect-square rounded-3xl border bg-gradient-to-tr sm:col-span-1 sm:row-span-1 sm:aspect-auto"></div>
            <div className="drop-shadow-flat from-tea-50 to-tea-100 col-span-1 row-span-4 rounded-3xl border bg-gradient-to-tr sm:col-span-3 sm:row-span-1"></div>
            <div className="drop-shadow-flat from-tea-100 to-tea-50 col-span-1 row-span-2 rounded-3xl border bg-gradient-to-tr sm:col-span-5 sm:row-span-1"></div>
          </section>
          <div className="py-20"></div>
          <section className="flex w-full flex-col">
            <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 xl:grid-cols-5 xl:gap-8 2xl:grid-cols-5 2xl:gap-12">
              {Array(100)
                .fill(0)
                .map((_, i) => (
                  <GridItem key={i} />
                ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
