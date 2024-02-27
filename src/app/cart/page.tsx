import { validateRequest } from '@/lib/auth';
import { getCartById } from '@/lib/server/cartService';
import { CartItems } from './CartItems';

const CartPage = async () => {
  const { user, cart, session } = await validateRequest();

  if (!session) {
    return null;
  }

  const cartId = session?.cartId;

  return <CartItems cartItems={cart} cartId={cartId} />;
};

export default CartPage;
