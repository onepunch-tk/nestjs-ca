import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository.port';
import { QueryHandlers } from './application/queries/handlers';
import { CommandHandlers } from './application/use-cases';
import { DrizzleProductRepository } from './infrastructure/adapters/drizzle-product.repository';
import { MongoProductRepository } from './infrastructure/adapters/mongo-product.repository';
import { ProductController } from './presentation/product.controller';

@Module({
  imports: [CqrsModule],
  controllers: [ProductController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    DrizzleProductRepository,
    MongoProductRepository,
    {
      provide: PRODUCT_REPOSITORY,
      useFactory: (
        configService: ConfigService,
        mongoRepo: MongoProductRepository,
        drizzleRepo: DrizzleProductRepository,
      ) => {
        //usefactory안에서는 law class를 반환하기때문에 provider에 배선을 해줘야함.
        return configService.get('DATABASE') === 'mongodb'
          ? mongoRepo
          : drizzleRepo;
      },
      inject: [ConfigService, MongoProductRepository, DrizzleProductRepository],
    },
  ],
})
export class ProductModule {}
