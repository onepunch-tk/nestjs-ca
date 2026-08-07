import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetProductQuery } from '../application/queries/get-product.query';
import { ListProductsQuery } from '../application/queries/list-products.query';
import { CreateProductCommand } from '../application/use-cases/create-product/create-product.command';
import { DeleteProductCommand } from '../application/use-cases/delete-product/delete-product.command';
import { Product } from '../domain/entities/product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { ListProductsQueryDto } from './dtos/list-products-query.dto';
import { ProductResponseDto } from './dtos/product-response.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateProductDto): Promise<void> {
    await this.commandBus.execute<CreateProductCommand, void>(
      new CreateProductCommand(
        dto.name,
        dto.description,
        dto.sku,
        dto.price,
        dto.currency || 'USD',
        dto.stock,
      ),
    );
  }

  @Get()
  async findAll(
    @Query() query: ListProductsQueryDto,
  ): Promise<ProductResponseDto[]> {
    const products = await this.queryBus.execute<ListProductsQuery, Product[]>(
      new ListProductsQuery(query.isActive, query.minPrice, query.maxPrice),
    );

    return products.map(ProductResponseDto.fromDomain);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ProductResponseDto> {
    const product = await this.queryBus.execute<GetProductQuery, Product>(
      new GetProductQuery(id),
    );

    return ProductResponseDto.fromDomain(product);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.commandBus.execute<DeleteProductCommand, void>(
      new DeleteProductCommand(id),
    );
  }
}
