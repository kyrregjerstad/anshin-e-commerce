'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { QuantitySelector } from './QuantitySelector';
import { RemoveFromCartButton } from './RemoveFromCartButton';
import { type CartItem as CartItemType } from '@/lib/server/cartService';
import { useOptimistic } from 'react';

type Props = {
  cartItems: CartItemType[];
  cartId: number;
};

export const CartItems = ({ cartItems, cartId }: Props) => {
  const [optimisticCart, dispatch] = useOptimistic(cartItems, cartReducer);

  return (
    <div>
      {optimisticCart.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          cartId={cartId}
          dispatch={dispatch}
        />
      ))}
    </div>
  );
};

export const CartItem = ({
  item,
  cartId,

  dispatch,
}: {
  item: CartItemType;
  cartId: number;
  dispatch: (action: CartAction) => void;
}) => {
  return (
    <Card className="flex max-w-sm items-center justify-between">
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p>{item.priceInCents}</p>
          <p>{item.discountInCents}</p>
          <QuantitySelector item={item} cartId={cartId} dispatch={dispatch} />
        </div>
      </CardContent>
      <CardFooter>
        <RemoveFromCartButton
          itemId={item.id}
          cartId={cartId}
          dispatch={dispatch}
        />
      </CardFooter>
    </Card>
  );
};

export type CartAction =
  | { type: 'UPDATE_QUANTITY'; itemId: string; quantity: number }
  | { type: 'REMOVE_ITEM'; itemId: string };

type OptimisticCart = CartItemType & {
  pending?: boolean;
};

const cartReducer = (state: OptimisticCart[], action: CartAction) => {
  switch (action.type) {
    case 'UPDATE_QUANTITY':
      return state.map((item) =>
        item.id === action.itemId
          ? { ...item, quantity: action.quantity }
          : item
      );
    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.itemId);
    default:
      return state;
  }
};
