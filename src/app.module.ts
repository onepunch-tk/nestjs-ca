import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { CustomerModule } from './customer/customer.module';
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
    CustomerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
