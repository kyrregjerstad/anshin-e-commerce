import { DrizzleMySQLAdapter } from '@lucia-auth/adapter-drizzle';

import { MySQLSessionTable, MySQLUserTable } from '@lucia-auth/adapter-drizzle';
import { eq } from 'drizzle-orm';
import { PlanetScaleDatabase } from 'drizzle-orm/planetscale-serverless';
import type { DatabaseSession, DatabaseUser } from 'lucia';
import * as schema from './server/tables';
import { sessions } from './server/tables';

interface ExtendedDatabaseUser extends DatabaseUser {
  cartId?: number;
}

export class ExtendedDrizzleMySQLAdapter extends DrizzleMySQLAdapter {
  private _db: PlanetScaleDatabase<typeof schema>;
  constructor(
    db: PlanetScaleDatabase<typeof schema>,
    sessionTable: MySQLSessionTable,
    userTable: MySQLUserTable
  ) {
    super(db, sessionTable, userTable);
    this._db = db; // the DrizzleMySQLAdapter method db is private, so we need to store it in a new property
  }

  async getSessionAndUser(
    sessionId: string
  ): Promise<[DatabaseSession | null, ExtendedDatabaseUser | null]> {
    const userWithSession = await this._db.query.users.findFirst({
      with: {
        cart: {
          columns: {
            id: true,
          },
        },
        sessions: {
          where: eq(sessions.id, sessionId),
        },
      },
    });

    if (!userWithSession || userWithSession.sessions.length === 0) {
      return [null, null];
    }

    const session: DatabaseSession = {
      attributes: {},
      id: userWithSession.sessions[0].id,
      userId: userWithSession.id,
      expiresAt: userWithSession.sessions[0].expiresAt,
    };

    const extendedUser: ExtendedDatabaseUser = {
      id: userWithSession.id,
      attributes: {
        id: userWithSession.id,
        email: userWithSession.email,
        name: userWithSession.name,
        cartId: userWithSession.cart?.id,
      },
    };

    return [session, extendedUser];
  }
}
