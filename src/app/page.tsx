import { GridItem } from '@/components/GridItem';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { getAllProducts } from '@/lib/server/productService';
import { HeroSection } from './HeroSection';

export default async function Home() {
  const sessionId = getSessionCookie();
  const allProducts = await getAllProducts(sessionId);

  return (
    <>
      <div className="flex w-full flex-col items-center">
        <HeroSection />
        <h3 className="self-start pb-4 pt-14 text-xl sm:pt-28">All Products</h3>
        <section className="flex w-full flex-col">
          <div className="grid w-full gap-4 xs:grid-cols-2 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
            {allProducts.map((product) => (
              <GridItem key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
