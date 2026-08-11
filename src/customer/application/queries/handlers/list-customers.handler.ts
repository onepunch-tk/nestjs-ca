import {
  CUSTOMER_REPOSITORY,
  type CustomerRepository,
} from '@app/customer/application/ports/customer.repository.port';
import { Customer } from '@app/customer/domain/entities/customer.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCustomersQuery } from '../list-customers.query';

@QueryHandler(ListCustomersQuery)
export class ListCustomersHandler
  implements IQueryHandler<ListCustomersQuery, Customer[]>
{
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }
}
