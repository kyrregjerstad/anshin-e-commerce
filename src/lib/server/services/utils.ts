import { Cart, CartItem, ValidateSessionResult } from './types';

export function transformCartItems(items: CartItem[] | null): Cart[] {
  if (!items) {
    return [] as Cart[];
  }
  return items.map((item) => ({
    ...item.product,
    quantity: item.quantity,
  }));
}

export function getEmptySessionDetails(): ValidateSessionResult {
  return {
    user: null,
    session: null,
    cart: [],
    cartId: null,
  };
}
