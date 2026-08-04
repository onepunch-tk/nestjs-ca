import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import {
  DRIZZLE,
  type DrizzleClient,
  DrizzleProvider,
} from './drizzle.provider';

@Global()
@Module({
  providers: [DrizzleProvider],
  exports: [DrizzleProvider],
})
export class DrizzleModule implements OnApplicationShutdown {
  constructor(@Inject(DRIZZLE) private readonly client: DrizzleClient) {}

  async onApplicationShutdown() {
    await this.client.close();
  }
}
