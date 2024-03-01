import { getAllProducts } from '@/lib/server/productService';
import { GridItem } from '@/components/GridItem';
import { validateRequest } from '@/lib/auth';

export default async function Home() {
  const { user, cart, cartId, session } = await validateRequest();
  const allProducts = await getAllProducts();

  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
        <div className="flex w-full max-w-10xl flex-col items-center gap-12">
          <section className="grid w-full grid-cols-2 grid-rows-8 gap-2 sm:aspect-[5/2] sm:grid-cols-8 sm:grid-rows-2 sm:gap-2 md:gap-4 xl:gap-8">
            <div className="col-span-2 row-span-2 rounded-3xl border bg-gradient-to-tr from-tea-100 to-tea-50 drop-shadow-flat sm:col-span-6 sm:row-span-1"></div>
            <div className="col-span-1 row-span-4 rounded-3xl border bg-gradient-to-tr from-ember-500 to-ember-400 drop-shadow-flat sm:col-span-1 sm:row-span-1 "></div>
            <div className="col-span-1 row-span-2 aspect-square rounded-3xl border bg-gradient-to-tr from-tea-300 to-tea-200 drop-shadow-flat sm:col-span-1 sm:row-span-1 sm:aspect-auto"></div>
            <div className="col-span-1 row-span-4 rounded-3xl border bg-gradient-to-tr from-tea-50 to-tea-100 drop-shadow-flat sm:col-span-3 sm:row-span-1"></div>
            <div className="col-span-1 row-span-2 rounded-3xl border bg-gradient-to-tr from-tea-100 to-tea-50 drop-shadow-flat sm:col-span-5 sm:row-span-1"></div>
          </section>
          <div className="py-20"></div>
          <section className="flex w-full flex-col">
            <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 xl:grid-cols-5 xl:gap-8 2xl:grid-cols-5 2xl:gap-12">
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
