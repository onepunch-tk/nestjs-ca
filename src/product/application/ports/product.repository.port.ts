import { Product } from '@app/product/domain/entities/product.entity';
import { ProductId } from '@app/product/domain/value-objects/product-id.vo';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductFilters {
  isActive?: boolean;
  maxPrice?: number;
  minPrice?: number;
}

export interface ProductRepository {
  save(product: Product): Promise<void>;
  findById(id: ProductId): Promise<Product | null>;
  findAll(filters: ProductFilters): Promise<Product[]>;
}
