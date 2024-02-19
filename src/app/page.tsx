import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-50 flex w-full items-center justify-center px-1">
        <nav className="max-w-10xl bg-tea-100 flex h-16 w-full items-center rounded-b-3xl border border-opacity-10 p-4 drop-shadow-sm">
          <ul className="flex gap-4">
            <li>Anshin</li>
          </ul>
        </nav>
      </header>
      <main className="flex min-h-screen flex-col items-center p-2 sm:p-8">
        <section className="max-w-10xl grid w-full grid-cols-2 grid-rows-8 gap-2 sm:aspect-[5/2] sm:grid-cols-8 sm:grid-rows-2 sm:gap-2 md:gap-4 xl:gap-8">
          <div className="drop-shadow-flat from-tea-100 to-tea-50 col-span-2 row-span-2 rounded-3xl border border-opacity-10 bg-gradient-to-tr sm:col-span-6 sm:row-span-1"></div>
          <div className="drop-shadow-flat from-ember-500 to-ember-400 col-span-1 row-span-4 rounded-3xl border border-opacity-10 bg-gradient-to-tr sm:col-span-1 sm:row-span-1 "></div>
          <div className="drop-shadow-flat from-tea-300 to-tea-200 col-span-1 row-span-2 aspect-square rounded-3xl border border-opacity-10 bg-gradient-to-tr sm:col-span-1 sm:row-span-1 sm:aspect-auto"></div>
          <div className="drop-shadow-flat from-tea-50 to-tea-100 col-span-1 row-span-4 rounded-3xl border border-opacity-10 bg-gradient-to-tr sm:col-span-3 sm:row-span-1"></div>
          <div className="drop-shadow-flat from-tea-100 to-tea-50 col-span-1 row-span-2 rounded-3xl border border-opacity-10 bg-gradient-to-tr sm:col-span-5 sm:row-span-1"></div>
        </section>
        <section className="flex w-full flex-col py-12">
          <div className="grid w-full grid-cols-6 gap-4">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="aspect-square">
                  <CardHeader>
                    <CardTitle>Test</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AspectRatio ratio={16 / 9} className="bg-muted">
                      <Image
                        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                        alt="Photo by Drew Beamer"
                        fill
                        className="rounded-md object-cover"
                      />
                    </AspectRatio>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button>View</Button>
                  </CardFooter>
                </Card>
                // <div
                //   key={i}
                //   className="drop-shadow-flat aspect-square w-full max-w-full rounded-3xl border border-opacity-10 bg-[#E8F1D5]"
                // ></div>
              ))}
          </div>
        </section>
      </main>
    </>
  );
}
