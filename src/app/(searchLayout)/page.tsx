import { Suspense } from 'react';
import { HeroSection } from '../../components/HeroSection';
import { ProductsGrid, ProductsGridSkeleton } from './ProductsGrid';

export default async function Home() {
  return (
    <div className="flex w-full flex-col items-center">
      <HeroSection />
      <h3 className="self-start pb-4 pt-14 text-xl">All Products</h3>
      <section className="flex w-full flex-col">
        <Suspense fallback={<ProductsGridSkeleton />}>
          <ProductsGrid />
        </Suspense>
      </section>
    </div>
  );
}
