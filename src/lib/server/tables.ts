import { relations } from 'drizzle-orm';
import {
  bigint,
  decimal,
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

export const sessions = mysqlTable('sessions', {
  id: varchar('id', { length: 64 }).primaryKey(),
  userId: varchar('user_id', { length: 64 }).references(() => users.id),
  expiresAt: timestamp('expires_at').notNull(),
});

const statusEnum = mysqlEnum('status', ['pending', 'completed', 'cancelled']);

export const orders = mysqlTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').onUpdateNow(),
  userId: varchar('user_id', { length: 64 }).references(() => users.id),
  status: statusEnum,
});

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
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const usersToOrders = mysqlTable(
  'users_to_orders',
  {
    userId: varchar('user_id', { length: 64 }).references(() => users.id),
    orderId: varchar('order_id', { length: 36 }).references(() => orders.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.orderId] }),
  })
);

export const usersToOrdersRelations = relations(usersToOrders, ({ one }) => ({
  user: one(users, {
    fields: [usersToOrders.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [usersToOrders.orderId],
    references: [orders.id],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  cart: one(cart, {
    fields: [users.id],
    references: [cart.userId],
  }),
  orders: one(usersToOrders, {
    fields: [users.id],
    references: [usersToOrders.userId],
  }),
}));

export const cart = mysqlTable('cart', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').onUpdateNow(),
  userId: varchar('user_id', { length: 64 }).references(() => users.id),
});

export const cartItems = mysqlTable('cart_items', {
  cartId: bigint('cart_id', { unsigned: true, mode: 'number' })
    .notNull()
    .unique()
    .references(() => cart.id),
  productId: varchar('product_id', { length: 36 }).references(
    () => products.id
  ),
  quantity: smallint('quantity', { unsigned: true }).notNull(),
});

export const cartToItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItems.cartId],
    references: [cart.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const products = mysqlTable('products', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  discountedPrice: decimal('discountedPrice', {
    precision: 10,
    scale: 2,
  }).notNull(),
});

export const images = mysqlTable('images', {
  url: varchar('url', { length: 255 }).primaryKey(),
  alt: varchar('alt', { length: 255 }).notNull(),
  itemId: varchar('item_id', { length: 36 }).references(() => products.id),
});

export const imagesRelations = relations(images, ({ one }) => ({
  product: one(products, {
    fields: [images.itemId],
    references: [products.id],
  }),
}));

export const tags = mysqlTable('tags', {
  tagName: varchar('tag_name', { length: 255 }).primaryKey(),
  itemId: varchar('item_id', { length: 36 }).references(() => products.id),
});

export const tagsRelations = relations(tags, ({ one }) => ({
  product: one(products, {
    fields: [tags.itemId],
    references: [products.id],
  }),
}));

export const reviews = mysqlTable('reviews', {
  id: varchar('id', { length: 36 }).primaryKey(),
  username: varchar('username', { length: 255 }).notNull(),
  rating: tinyint('rating', { unsigned: true }),
  description: varchar('description', { length: 1000 }).notNull(),
  itemId: varchar('item_id', { length: 36 }).references(() => products.id),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.itemId],
    references: [products.id],
  }),
}));
