import { validateRequest } from '@/lib/auth';
import { getCartById } from '@/lib/server/cartService';
import { CartItems } from './CartItems';

const CartPage = async () => {
  const { user } = await validateRequest();

  if (!user || !user?.cartId) {
    return null;
  }
  const { cartId } = user;

  const cartItems = await getCartById(cartId);

  return <CartItems cartItems={cartItems} cartId={cartId} />;
};

export default CartPage;
