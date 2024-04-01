import { Card, CardHeader } from '@/components/ui/card';
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
    <section className="flex w-full max-w-4xl flex-col gap-8 pt-8">
      {wishlist.map((product) => (
        <Card key={product.id} className="flex flex-col gap-4">
          <CardHeader>
            <h2 className="text-xl font-semibold">{product.title}</h2>
          </CardHeader>
          <div className="flex gap-4">
            <p className="text-lg font-semibold">
              ${(product.priceInCents / 100).toFixed(2)}
            </p>
            {product.discountInCents > 0 && (
              <p className="text-lg font-semibold text-red-500">
                ${(product.discountInCents / 100).toFixed(2)}
              </p>
            )}
          </div>
        </Card>
      ))}
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

  return {
    id: res.user.id,
    wishlist: res.user.wishlist.items.map((item) => ({
      ...item.product,
    })),
  };
}
