import {
  ProductFilters,
  ProductRepository,
} from '@app/product/application/ports/product.repository.port';
import { Product } from '@app/product/domain/entities/product.entity';
import { ProductId } from '@app/product/domain/value-objects/product-id.vo';
import { Sku } from '@app/product/domain/value-objects/sku.vo';
import { Money } from '@app/shared/domain/value-objects/money.vo';
import { MONGO_DB } from '@app/shared/infrastructure/database/mongodb/mongo.provider';
import { Inject } from '@nestjs/common';
import { Collection, Db } from 'mongodb';

interface ProductDocument {
  _id: string;
  name: string;
  description: string;
  sku: string;
  priceAmount: number;
  priceCurrency: string;
  stock: number;
  isActive: boolean;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

export class MongoProductRepository implements ProductRepository {
  private readonly collection: Collection<ProductDocument>;

  constructor(@Inject(MONGO_DB) private readonly db: Db) {
    this.collection = this.db.collection<ProductDocument>('products');
  }

  async save(product: Product): Promise<void> {
    const doc = MongoProductRepository.toPersistence(product);
    await this.collection.updateOne(
      { _id: doc._id },
      { $set: doc },
      { upsert: true },
    );
  }

  async findById(id: ProductId): Promise<Product | null> {
    const doc = await this.collection.findOne({ _id: id.getValue() });
    return doc !== null ? MongoProductRepository.toDomain(doc) : doc;
  }

  async findBySku(sku: Sku): Promise<Product | null> {
    const doc = await this.collection.findOne({ sku: sku.getValue() });
    return doc !== null ? MongoProductRepository.toDomain(doc) : doc;
  }

  async findByName(name: string): Promise<Product | null> {
    const doc = await this.collection.findOne({ name });
    return doc !== null ? MongoProductRepository.toDomain(doc) : doc;
  }

  async findAll(filters: ProductFilters): Promise<Product[]> {
    const priceFilters = {
      ...(filters.minPrice !== undefined && {
        $gte: Math.round(filters.minPrice * 100),
      }),
      ...(filters.maxPrice !== undefined && {
        $lte: Math.round(filters.maxPrice * 100),
      }),
    };

    const docs = await this.collection
      .find({
        ...(filters.isActive !== undefined && { isActive: filters.isActive }),
        ...(Object.keys(priceFilters).length > 0 && {
          priceAmount: priceFilters,
        }),
      })
      .toArray();

    return docs.map((doc) => MongoProductRepository.toDomain(doc));
  }
  async deleteById(id: ProductId): Promise<void> {
    await this.collection.deleteOne({ _id: id.getValue() });
  }

  private static toPersistence(product: Product): ProductDocument {
    return {
      _id: product.id.getValue(),
      name: product.name,
      description: product.description,
      sku: product.sku.getValue(),
      priceAmount: product.price.toCents(),
      priceCurrency: product.price.getCurrency(),
      stock: product.stock,
      isActive: product.isActive,
      lowStockThreshold: product.lowStockThreshold,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private static toDomain(document: ProductDocument): Product {
    return Product.reconstitute({
      id: new ProductId(document._id),
      name: document.name,
      description: document.description,
      price: Money.create(document.priceAmount / 100, document.priceCurrency),
      sku: Sku.create(document.sku),
      stock: document.stock,
      isActive: document.isActive,
      lowStockThreshold: document.lowStockThreshold ?? 5,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }
}
