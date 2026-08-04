import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const DRIZZLE = Symbol('DRIZZLE');

export type DrizzleDB = NodePgDatabase<{}>;
export type DrizzleClient = {
  db: DrizzleDB;
  close(): Promise<void>;
};

export const DrizzleProvider = {
  provide: DRIZZLE,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): DrizzleClient => {
    const pool = new Pool({
      connectionString: configService.getOrThrow<string>(
        'POSTGRES_DATABASE_URL',
      ),
    });

    return {
      db: drizzle(pool, {}),
      close: () => pool.end(),
    };
  },
};
