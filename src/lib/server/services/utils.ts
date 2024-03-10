import { Cart, CartItem } from './types';

export function transformCartItems(items: CartItem[] | null): Cart[] {
  if (!items) {
    return [] as Cart[];
  }
  return items.map((item) => ({
    ...item.product,
    quantity: item.quantity,
  }));
}

export function getEmptySessionDetails() {
  return {
    user: null,
    cart: [],
    cartId: null,
  };
}
