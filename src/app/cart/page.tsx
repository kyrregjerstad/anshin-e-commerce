import { validateRequest } from '@/lib/auth';
import { CartItems } from './CartItems';

const CartPage = async () => {
  const { user, cart, session, cartId } = await validateRequest();

  if (!cartId) {
    return null;
  }

  if (!session) {
    return null;
  }

  return <CartItems cartItems={cart} cartId={cartId} />;
};

export default CartPage;
