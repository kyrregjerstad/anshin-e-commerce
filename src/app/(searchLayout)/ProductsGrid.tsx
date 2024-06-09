import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { getAllProducts } from '@/lib/server/services/productService';

export const ProductsGrid = async () => {
  const sessionId = getSessionCookie();

  const allProducts = await getAllProducts(sessionId);

  return (
    <div className="grid w-full gap-4 xs:grid-cols-2 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
      {allProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export const ProductsGridSkeleton = () => {
  return (
    <div className="grid w-full gap-4 xs:grid-cols-2 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
      {[...Array(20).keys()].map((i) => (
        <Skeleton key={i} className="aspect-square w-full rounded-2xl" />
      ))}
    </div>
  );
};
