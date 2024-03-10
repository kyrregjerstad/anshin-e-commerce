import Image from 'next/image';

export const HeroSection = () => {
  return (
    <section className="grid max-h-[70dvh] w-full max-w-8xl grid-cols-2 grid-rows-6 gap-2 sm:aspect-[20/11] sm:grid-cols-8 sm:grid-rows-2 sm:gap-2 md:gap-4 xl:gap-8">
      <div className="relative col-span-2 row-span-2 overflow-hidden rounded-3xl border bg-gradient-to-tr from-tea-100 to-tea-50 drop-shadow-flat sm:col-span-4 sm:row-span-1">
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
      </div>
      <div className="col-span-1 row-span-3 overflow-hidden rounded-3xl border bg-gradient-to-tr from-ember-500 to-ember-400 drop-shadow-flat sm:col-span-2 sm:row-span-1">
        <Image
          src="https://static.noroff.dev/api/online-shop/3-headphones-beats.jpg"
          width={300}
          height={300}
          alt="test"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="col-span-1 row-span-2 overflow-hidden rounded-3xl border bg-gradient-to-tr from-tea-300 to-tea-200 drop-shadow-flat sm:col-span-2 sm:row-span-1">
        <Image
          src="https://static.noroff.dev/api/online-shop/1-perfume-white.jpg"
          width={300}
          height={300}
          alt="test"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="col-span-1 row-span-3 overflow-hidden rounded-3xl border bg-gradient-to-tr from-tea-50 to-tea-100 drop-shadow-flat sm:col-span-3 sm:row-span-1">
        <Image
          src="https://static.noroff.dev/api/online-shop/12-toy-car.jpg"
          width={300}
          height={300}
          alt="test"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="col-span-1 row-span-2 overflow-hidden rounded-3xl border bg-gradient-to-tr from-tea-100 to-tea-50 drop-shadow-flat sm:col-span-5 sm:row-span-1">
        <Image
          src="https://static.noroff.dev/api/online-shop/11-shampoo.jpg"
          width={300}
          height={300}
          alt="test"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
};
