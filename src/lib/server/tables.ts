import { InferInsertModel, relations } from 'drizzle-orm';
import {
  boolean,
  datetime,
  int,
  mysqlEnum,
  mysqlTableCreator,
  primaryKey,
  smallint,
  timestamp,
  tinyint,
  varchar,
} from 'drizzle-orm/mysql-core';

export type DatabaseUser = {
  id: string;
  name: string;
  cartId: string | null;
};

const mysqlTable = mysqlTableCreator((name) => `anshin_${name}`);

export const users = mysqlTable('users', {
  id: varchar('id', { length: 64 }).primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').onUpdateNow(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  hashedPassword: varchar('hashed_password', { length: 255 }).notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  cart: one(cart, {
    fields: [users.id],
    references: [cart.userId],
    relationName: 'user_cart',
  }),
  orders: many(orders, {
    relationName: 'user_orders',
  }),
  sessions: many(sessions, {
    relationName: 'user_session',
  }),
  addresses: many(address, {
    relationName: 'user_address',
  }),
  wishlist: one(wishlist, {
    fields: [users.id],
    references: [wishlist.userId],
    relationName: 'user_wishlist',
  }),
}));

export const wishlist = mysqlTable('wishlist', {
  id: varchar('id', { length: 64 }).primaryKey(),
  userId: varchar('user_id', { length: 64 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  public: boolean('public').notNull().default(false),
});
export type InsertWishlist = InferInsertModel<typeof wishlist>;

export const wishlistRelations = relations(wishlist, ({ one, many }) => ({
  user: one(users, {
    fields: [wishlist.userId],
    references: [users.id],
    relationName: 'user_wishlist',
  }),
  items: many(wishlistItems, {
    relationName: 'wishlist_items',
  }),
}));

export const wishlistItems = mysqlTable('wishlist_items', {
  wishlistId: varchar('wishlist_id', { length: 64 })
    .notNull()
    .references(() => wishlist.id),
  productId: varchar('product_id', { length: 36 })
    .notNull()
    .references(() => products.id),
});

export const wishlistItemsRelations = relations(
  wishlistItems,
  ({ one, many }) => ({
    wishlist: one(wishlist, {
      fields: [wishlistItems.wishlistId],
      references: [wishlist.id],
      relationName: 'wishlist_items',
    }),
    product: one(products, {
      fields: [wishlistItems.productId],
      references: [products.id],
      relationName: 'wishlist_products',
    }),
  })
);

export const address = mysqlTable('address', {
  id: varchar('id', { length: 64 }).primaryKey(),
  userId: varchar('user_id', { length: 64 })
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  streetAddress1: varchar('street_address_1', { length: 255 }).notNull(),
  streetAddress2: varchar('street_address_2', { length: 255 }),
  city: varchar('city', { length: 255 }),
  state: varchar('state', { length: 255 }),
  postalCode: varchar('postal_code', { length: 255 }).notNull(),
  country: varchar('country', { length: 255 }).notNull(),
  type: mysqlEnum('type', ['shipping', 'billing']).notNull(),
});

export type InsertAddress = InferInsertModel<typeof address>;

export const addressRelations = relations(address, ({ one, many }) => ({
  user: one(users, {
    fields: [address.userId],
    references: [users.id],
    relationName: 'user_address',
  }),
  orders: many(orders, {
    relationName: 'address_orders',
  }),
}));

export const sessions = mysqlTable('sessions', {
  id: varchar('id', { length: 64 }).primaryKey(),
  userId: varchar('user_id', { length: 64 }).references(() => users.id, {
    onDelete: 'cascade',
  }),
  refreshToken: varchar('refresh_token', { length: 255 }).notNull(),
  expiresAt: datetime('expires_at').notNull(),
});

export type InsertSession = InferInsertModel<typeof sessions>;

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
    relationName: 'user_session',
  }),
  cart: one(cart, {
    fields: [sessions.id],
    references: [cart.sessionId],
    relationName: 'cart_session',
  }),
}));

const statusEnum = mysqlEnum('status', ['pending', 'completed', 'cancelled']);
export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export const orders = mysqlTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').onUpdateNow(),
  userId: varchar('user_id', { length: 64 }).references(() => users.id),
  status: statusEnum.notNull().default('pending'),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
    relationName: 'user_orders',
  }),
  items: many(orderItems, {
    relationName: 'order_items',
  }),
  address: one(address, {
    fields: [orders.id],
    references: [address.id],
    relationName: 'address_orders',
  }),
}));

export const orderItems = mysqlTable('order_items', {
  orderId: varchar('order_id', { length: 36 })
    .notNull()
    .references(() => orders.id),
  productId: varchar('product_id', { length: 36 })
    .notNull()
    .references(() => products.id),
  quantity: smallint('quantity', { unsigned: true }).notNull(),
  priceInCents: int('price_in_cents', { unsigned: true }).notNull(),
  discountInCents: int('discount_in_cents', { unsigned: true }).notNull(),
});

export type InsertOrderItem = InferInsertModel<typeof orderItems>;

export const orderToItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
    relationName: 'order_items',
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
    relationName: 'order_products',
  }),
}));

export const cart = mysqlTable('cart', {
  id: varchar('id', { length: 64 }).primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').onUpdateNow(),
  sessionId: varchar('session_id', { length: 64 }).references(
    () => sessions.id,
    { onDelete: 'set null' }
  ),
  userId: varchar('user_id', { length: 64 }).references(() => users.id, {
    onDelete: 'cascade',
  }),
});

export type InsertCart = InferInsertModel<typeof cart>;

export const cartRelations = relations(cart, ({ one, many }) => ({
  session: one(sessions, {
    fields: [cart.sessionId],
    references: [sessions.id],
    relationName: 'cart_session',
  }),
  user: one(users, {
    fields: [cart.userId],
    references: [users.id],
    relationName: 'user_cart',
  }),
  items: many(cartItems, {
    relationName: 'cart_items',
  }),
}));

export const cartItems = mysqlTable(
  'cart_items',
  {
    cartId: varchar('cart_id', { length: 64 })
      .notNull()
      .references(() => cart.id, {
        onDelete: 'cascade',
      }),
    productId: varchar('product_id', { length: 36 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    quantity: smallint('quantity', { unsigned: true }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.cartId, table.productId] }),
  })
);

export type InsertCartItems = InferInsertModel<typeof cartItems>;

export const cartToItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItems.cartId],
    references: [cart.id],
    relationName: 'cart_items',
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
    relationName: 'cart_products',
  }),
}));

export const products = mysqlTable('products', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }).notNull(),
  priceInCents: int('price_in_cents', { unsigned: true }).notNull(),
  discountInCents: int('discount_in_cents', { unsigned: true }).notNull(),
});

export type InsertProduct = InferInsertModel<typeof products>;

export const productsRelations = relations(products, ({ many }) => ({
  images: many(images, {
    relationName: 'images_product',
  }),
  tags: many(tags, {
    relationName: 'tags_product',
  }),
  reviews: many(reviews, {
    relationName: 'reviews_product',
  }),
  wishlist: many(wishlistItems, {
    relationName: 'wishlist_products',
  }),
}));

export const images = mysqlTable('images', {
  id: varchar('id', { length: 36 }).primaryKey(),
  url: varchar('url', { length: 255 }).notNull(),
  alt: varchar('alt', { length: 255 }).notNull(),
  itemId: varchar('item_id', { length: 36 }).references(() => products.id, {
    onDelete: 'cascade',
  }),
});

export type Image = InferInsertModel<typeof images>;

export const imagesRelations = relations(images, ({ one }) => ({
  product: one(products, {
    fields: [images.itemId],
    references: [products.id],
    relationName: 'images_product',
  }),
}));

export const tags = mysqlTable('tags', {
  tagName: varchar('tag_name', { length: 255 }).primaryKey(),
  itemId: varchar('item_id', { length: 36 }).references(() => products.id),
});

export type Tag = InferInsertModel<typeof tags>;

export const tagsRelations = relations(tags, ({ one }) => ({
  product: one(products, {
    fields: [tags.itemId],
    references: [products.id],
    relationName: 'tags_product',
  }),
}));

export const reviews = mysqlTable('reviews', {
  id: varchar('id', { length: 36 }).primaryKey(),
  username: varchar('username', { length: 255 }).notNull(),
  rating: tinyint('rating', { unsigned: true }).notNull(),
  description: varchar('description', { length: 1000 }).notNull(),
  itemId: varchar('item_id', { length: 36 })
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
});

export type InsertReview = InferInsertModel<typeof reviews>;

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.itemId],
    references: [products.id],
    relationName: 'reviews_product',
  }),
}));
