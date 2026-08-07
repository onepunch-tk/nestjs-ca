import { Product } from '@app/product/domain/entities/product.entity';
import { ProductId } from '@app/product/domain/value-objects/product-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '@app/shared/domain/exceptions/application.exception';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../ports/product.repository.port';
import { GetProductQuery } from '../get-product.query';

@QueryHandler(GetProductQuery)
export class GetProductHandler
  implements IQueryHandler<GetProductQuery, Product>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetProductQuery): Promise<Product> {
    const product = await this.productRepository.findById(
      new ProductId(query.id),
    );

    if (!product) {
      throw new ApplicationException(
        `Product with ID ${query.id} was not found.`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    return product;
  }
}
