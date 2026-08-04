import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { Db } from 'mongodb';
import { MONGO_DB, MongoProvider } from './mongo.provider';

@Global()
@Module({
  providers: [MongoProvider],
  exports: [MongoProvider],
})
export class MongoModule implements OnApplicationShutdown {
  constructor(@Inject(MONGO_DB) private readonly db: Db) {}

  async onApplicationShutdown() {
    await this.db.client.close();
  }
}
