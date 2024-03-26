import { GridItem } from '@/components/GridItem';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { searchProductsByTitle } from '@/lib/server/services/productService';

export const SearchPage = async ({ query }: { query: string }) => {
  const sessionId = getSessionCookie();

  const searchResults = await searchProductsByTitle(sessionId, query);

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="flex w-full flex-col items-center">
        <section className="flex w-full flex-col">
          <div className="flex w-full flex-col items-center">
            <h1 className="text-3xl font-bold">No results found</h1>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      <section className="flex w-full flex-col">
        <div className="grid w-full gap-4 xs:grid-cols-2 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
          {searchResults.map((product) => (
            <GridItem key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
