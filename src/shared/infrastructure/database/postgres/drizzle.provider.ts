import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const DRIZZLE = Symbol('DRIZZLE');

export type DrizzleDB = NodePgDatabase<{}>;

export const DrizzleProvider = {
  provide: DRIZZLE,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<DrizzleDB> => {
    const pool = new Pool({
      connectionString: configService.getOrThrow<string>(
        'POSTGRES_DATABASE_URL',
      ),
    });

    const db = drizzle(pool, {});
    await db.execute(`SELECT 1`);

    return db;
  },
};
