import { Product } from '@app/product/domain/entities/product.entity';
import { ProductId } from '@app/product/domain/value-objects/product-id.vo';
import { Sku } from '@app/product/domain/value-objects/sku.vo';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductFilters {
  isActive?: boolean;
  maxPrice?: number;
  minPrice?: number;
}

export interface ProductRepository {
  save(product: Product): Promise<void>;
  findById(id: ProductId): Promise<Product | null>;
  findBySku(sku: Sku): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
  findAll(filters: ProductFilters): Promise<Product[]>;
  deleteById(id: ProductId): Promise<void>;
}
