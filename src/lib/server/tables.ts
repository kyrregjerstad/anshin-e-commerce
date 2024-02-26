import { InferInsertModel, relations } from 'drizzle-orm';
import {
  bigint,
  datetime,
  decimal,
  int,
  mysqlEnum,
  mysqlTableCreator,
  primaryKey,
  serial,
  smallint,
  timestamp,
  tinyint,
  varchar,
} from 'drizzle-orm/mysql-core';

const mysqlTable = mysqlTableCreator((name) => `anshin_${name}`);

export const users = mysqlTable('users', {
  id: varchar('id', { length: 64 }).primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').onUpdateNow(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  hashedPassword: varchar('hashed_password', { length: 255 }).notNull(),
});

export const guestUsers = mysqlTable('guest_users', {
  id: varchar('id', { length: 64 }).primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').onUpdateNow(),
});

export const guestUsersRelations = relations(guestUsers, ({ one }) => ({
  session: one(sessions, {
    fields: [guestUsers.id],
    references: [sessions.guestUserId],
    relationName: 'guest_user_session',
  }),
}));

export type DatabaseUser = {
  id: string;
  name: string;
  email: string;
  cartId: number | null;
};

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
}));

export const sessions = mysqlTable('sessions', {
  id: varchar('id', { length: 64 }).primaryKey(),
  userId: varchar('user_id', { length: 64 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  guestUserId: varchar('guest_user_id', { length: 64 }).references(
    () => guestUsers.id,
    { onDelete: 'cascade' }
  ),
  expiresAt: datetime('expires_at').notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
    relationName: 'user_session',
  }),
  guestUser: one(guestUsers, {
    fields: [sessions.guestUserId],
    references: [guestUsers.id],
    relationName: 'guest_user_session',
  }),
}));

const statusEnum = mysqlEnum('status', ['pending', 'completed', 'cancelled']);

export const orders = mysqlTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').onUpdateNow(),
  userId: varchar('user_id', { length: 64 }).references(() => users.id),
  status: statusEnum,
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
}));

export const orderItems = mysqlTable('order_items', {
  orderId: varchar('order_id', { length: 36 }).references(() => orders.id),
  productId: varchar('product_id', { length: 36 }).references(
    () => products.id
  ),
  quantity: smallint('quantity', { unsigned: true }).notNull(),
});

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
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').onUpdateNow(),
  userId: varchar('user_id', { length: 64 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export type InsertCart = InferInsertModel<typeof cart>;

export const cartRelations = relations(cart, ({ one, many }) => ({
  user: one(users, {
    fields: [cart.userId],
    references: [users.id],
    relationName: 'user_cart',
  }),
  items: many(cartItems, {
    relationName: 'cart_items',
  }),
}));

export const cartItems = mysqlTable('cart_items', {
  cartId: bigint('cart_id', { unsigned: true, mode: 'number' })
    .notNull()
    .references(() => cart.id, { onDelete: 'cascade' }),
  productId: varchar('product_id', { length: 36 })
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  quantity: smallint('quantity', { unsigned: true }).notNull(),
});

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
