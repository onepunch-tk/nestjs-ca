import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { Pool } from 'pg';
import { DRIZZLE, type DrizzleDB, DrizzleProvider } from './drizzle.provider';

@Global()
@Module({
  providers: [DrizzleProvider],
  exports: [DrizzleProvider],
})
export class DrizzleModule implements OnApplicationShutdown {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB & { $client: Pool },
  ) {}

  async onApplicationShutdown() {
    await this.db.$client.end();
  }
}
