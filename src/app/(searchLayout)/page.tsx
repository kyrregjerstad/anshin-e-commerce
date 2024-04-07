import { ProductCard } from '@/components/ProductCard';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { getAllProducts } from '@/lib/server/services/productService';
import { HeroSection } from '../../components/HeroSection';
import { SearchPage } from './SearchPage';

type Props = {
  searchParams?: {
    q?: string;
  };
};

export default async function Home({ searchParams }: Props) {
  const sessionId = getSessionCookie();

  const searchQuery = searchParams?.q;

  if (searchQuery) {
    return <SearchPage query={searchQuery} />;
  }

  const allProducts = await getAllProducts(sessionId);

  return (
    <div className="flex w-full flex-col items-center">
      <HeroSection />
      <h3 className="self-start pb-4 pt-14 text-xl">All Products</h3>
      <section className="flex w-full flex-col">
        <div className="grid w-full gap-4 xs:grid-cols-2 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
