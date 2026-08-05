import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './application';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository.port';
import { QueryHandlers } from './application/queries/handlers';
import { DrizzleProductRepository } from './infrastructure/adapters/drizzle-product.repository';
import { ProductController } from './presentation/product.controller';

@Module({
  imports: [CqrsModule],
  controllers: [ProductController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: DrizzleProductRepository,
    },
  ],
})
export class ProductModule {}
