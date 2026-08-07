import { Product } from '@app/product/domain/entities/product.entity';
import { Sku } from '@app/product/domain/value-objects/sku.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '@app/shared/domain/exceptions/application.exception';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../ports/product.repository.port';
import { CreateProductCommand } from './create-product.command';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand, void>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<void> {
    const existingBySku = await this.productRepository.findBySku(
      Sku.create(command.sku),
    );

    if (existingBySku) {
      throw new ApplicationException(
        `product with SKU ${command.sku} already exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const existingByName = await this.productRepository.findByName(
      command.name,
    );

    if (existingByName) {
      throw new ApplicationException(
        `product with name ${command.name} already exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const product = Product.create(
      command.name,
      command.description,
      command.sku,
      command.price,
      command.currency,
      command.stock,
    );

    await this.productRepository.save(product);
  }
}
