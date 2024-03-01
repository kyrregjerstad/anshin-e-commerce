export type Cart = {
  id: string;
  title: string;
  priceInCents: number;
  discountInCents: number;
  quantity: number;
};

export type ValidateSessionResult = {
  user: {
    id: string;
    name: string;
  } | null;
  session: {
    id: string;
    expiresAt: Date;
  } | null;
  cart: Array<Cart>;
  cartId: string | null;
};

export type CartItem = {
  quantity: number;
  product: {
    id: string;
    title: string;
    priceInCents: number;
    discountInCents: number;
  };
};

interface BaseSession {
  id: string;
  expiresAt: Date;
  cart: DatabaseCart | null;
}

export interface SessionWithoutUser extends BaseSession {
  user: null;
}

export interface SessionWithUser extends BaseSession {
  user: DatabaseUser;
}

type DatabaseUser = {
  id: string;
  name: string;
  cart: DatabaseCart | null;
};

type DatabaseCart = {
  id: string;
  items: CartItem[] | null;
};

export type DatabaseSession = SessionWithoutUser | SessionWithUser;
