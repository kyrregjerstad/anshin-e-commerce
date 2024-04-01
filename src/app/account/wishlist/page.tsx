'use server';
import { ProductCard } from '@/components/GridItem';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { db } from '@/lib/server/db';
import { sessions } from '@/lib/server/tables';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

const WishlistPage = async () => {
  const sessionId = getSessionCookie();

  if (!sessionId) {
    return redirect('/login?callback=/account/wishlist');
  }

  const res = await getUserWishlist(sessionId);

  if (!res || !res.wishlist || res.wishlist.length === 0) {
    return (
      <div>
        <h1>Wishlist</h1>
        <p>There are no items in your wishlist.</p>
      </div>
    );
  }

  const { wishlist } = res;

  return (
    <section className="flex w-full flex-col">
      <div className="grid w-full gap-4 xs:grid-cols-2 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default WishlistPage;

async function getUserWishlist(sessionId: string) {
  const res = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    columns: {},
    with: {
      user: {
        columns: {
          id: true,
        },
        with: {
          cart: {
            with: {
              items: {
                columns: {
                  productId: true,
                },
              },
            },
          },
          wishlist: {
            columns: {
              id: true,
              public: true,
            },
            with: {
              items: {
                columns: {},
                with: {
                  product: {
                    columns: {
                      id: true,
                      title: true,
                      priceInCents: true,
                      discountInCents: true,
                    },
                    with: {
                      images: {
                        columns: {
                          url: true,
                        },
                      },
                      reviews: {
                        columns: {
                          rating: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!res || !res.user || !res.user.id || !res.user.wishlist) {
    return null;
  }

  const transform = {
    id: res.user.id,
    wishlist: res.user.wishlist.items.map((item) => ({
      id: item.product.id,
      title: item.product.title,
      price: item.product.priceInCents / 100,
      discountPrice: item.product.discountInCents / 100,
      onSale: item.product.discountInCents < item.product.priceInCents,
      imageUrl: item.product.images[0].url,
      inCart: !!res.user?.cart.items.some(
        (cartItem) => cartItem.productId === item.product.id
      ),
      averageRating:
        item.product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        item.product.reviews.length,
    })),
  };

  return transform;
}
