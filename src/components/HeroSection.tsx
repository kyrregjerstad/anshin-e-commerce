import Image from 'next/image';
import Link from 'next/link';

export const HeroSection = () => {
  return (
    <section className="grid max-h-[70dvh] w-full max-w-8xl grid-cols-2 grid-rows-6 gap-2 sm:aspect-[20/11] sm:grid-cols-8 sm:grid-rows-2 sm:gap-2 md:gap-4 xl:gap-8">
      <Link
        className="relative col-span-2 row-span-2 overflow-hidden rounded-3xl border bg-gradient-to-tr from-tea-100 to-tea-50 drop-shadow-flat sm:col-span-4 sm:row-span-1"
        href="/product/f7bdd538-3914-409d-bd71-8ef962a9a9dd"
      >
        <div className="absolute top-0 p-4">
          <h1 className="text-xl font-bold sm:text-3xl">Featured Products</h1>
          <h2 className="text-md sm:text-lg">Discover our top picks</h2>
        </div>
        <Image
          src="https://static.noroff.dev/api/online-shop/7-shoes-white.jpg"
          width={300}
          height={300}
          alt="test"
          className="h-full w-full object-cover object-right"
        />
      </Link>
      <Link
        className="col-span-1 row-span-3 overflow-hidden rounded-3xl border bg-gradient-to-tr from-ember-500 to-ember-400 drop-shadow-flat sm:col-span-2 sm:row-span-1"
        href="/product/159fdd2f-2b12-46de-9654-d9139525ba87"
      >
        <Image
          src="https://static.noroff.dev/api/online-shop/3-headphones-beats.jpg"
          width={300}
          height={300}
          alt="test"
          className="h-full w-full object-cover"
        />
      </Link>
      <Link
        className="col-span-1 row-span-2 overflow-hidden rounded-3xl border bg-gradient-to-tr from-tea-300 to-tea-200 drop-shadow-flat sm:col-span-2 sm:row-span-1"
        href="/product/109566af-c5c2-4f87-86cb-76f36fb8d378"
      >
        <Image
          src="https://static.noroff.dev/api/online-shop/1-perfume-white.jpg"
          width={300}
          height={300}
          alt="test"
          className="h-full w-full object-cover"
        />
      </Link>
      <Link
        className="col-span-1 row-span-3 overflow-hidden rounded-3xl border bg-gradient-to-tr from-tea-50 to-tea-100 drop-shadow-flat sm:col-span-3 sm:row-span-1"
        href="/product/10d6cc02-b282-46bb-b35c-dbc4bb5d91d9"
      >
        <Image
          src="https://static.noroff.dev/api/online-shop/12-toy-car.jpg"
          width={300}
          height={300}
          alt="test"
          className="h-full w-full object-cover"
        />
      </Link>
      <Link
        className="col-span-1 row-span-2 overflow-hidden rounded-3xl border bg-gradient-to-tr from-tea-100 to-tea-50 drop-shadow-flat sm:col-span-5 sm:row-span-1"
        href="/product/c0d245f1-58fa-4b15-aa0c-a704772a122b"
      >
        <Image
          src="https://static.noroff.dev/api/online-shop/11-shampoo.jpg"
          width={300}
          height={300}
          alt="test"
          className="h-full w-full object-cover"
        />
      </Link>
    </section>
  );
};
