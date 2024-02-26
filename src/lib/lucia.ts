import { Lucia } from 'lucia';
import { ExtendedDrizzleMySQLAdapter } from './adapter';
import { db } from './server/db';
import { DatabaseUser, sessions, users } from './server/tables';

export const adapter = new ExtendedDrizzleMySQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },

  getUserAttributes: (user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    cartId: user.cartId,
  }),
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUser;
  }
}
