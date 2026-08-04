import {
  ProductFilters,
  ProductRepository,
} from '@app/product/application/ports/product.repository.port';
import { Product } from '@app/product/domain/entities/product.entity';
import { ProductId } from '@app/product/domain/value-objects/product-id.vo';
import {
  DRIZZLE,
  type DrizzleDB,
} from '@app/shared/infrastructure/database/postgres/drizzle.provider';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DrizzleProductRepository implements ProductRepository {
  constructor(@Inject(DRIZZLE) readonly _db: DrizzleDB) {}

  async save(_product: Product): Promise<void> {}
  findById(_id: ProductId): Promise<Product | null> {
    throw new Error('Method not implemented.');
  }
  findAll(_filters: ProductFilters): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
}
