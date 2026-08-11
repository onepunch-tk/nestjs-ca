import { Customer } from '@app/customer/domain/entities/customer.entity';
import { CustomerId } from '@app/customer/domain/value-objects/customer-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '@app/shared/domain/exceptions/application.exception';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepository,
} from '../../ports/customer.repository.port';
import { GetCustomerQuery } from '../get-customer.query';

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler
  implements IQueryHandler<GetCustomerQuery, Customer>
{
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(query: GetCustomerQuery): Promise<Customer> {
    const customer = await this.customerRepository.findById(
      new CustomerId(query.id),
    );

    if (!customer) {
      throw new ApplicationException(
        `Customer with ID ${query.id} was not found.`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    return customer;
  }
}
