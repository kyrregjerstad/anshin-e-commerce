import { GridItem } from '@/components/GridItem';
import { validateRequest } from '@/lib/auth';
import { getAllProducts } from '@/lib/server/productService';
import { HeroSection } from './HeroSection';

export default async function Home() {
  const { user, cart, cartId, session } = await validateRequest();

  const allProducts = await getAllProducts();

  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
        <div className="flex w-full max-w-10xl flex-col items-center">
          <HeroSection />
          <h3 className="self-start pb-4 pt-14 text-xl sm:pt-28">
            All Products
          </h3>
          <section className="flex w-full flex-col">
            <div className="grid w-full gap-4 xs:grid-cols-2 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
              {allProducts.map((product) => (
                <GridItem
                  key={product.id}
                  product={product}
                  cartItems={cart}
                  sessionData={{
                    sessionId: session.id,
                    userId: user?.id ?? null,
                    cartId: cartId,
                  }}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
