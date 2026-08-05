import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductModule } from './product/product.module';
import { MongoModule } from './shared/infrastructure/database/mongodb/mongo.module';
import { DrizzleModule } from './shared/infrastructure/database/postgres/drizzle.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    MongoModule,
    DrizzleModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
