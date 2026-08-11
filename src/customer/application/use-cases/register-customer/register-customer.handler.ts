import { Customer } from '@app/customer/domain/entities/customer.entity';
import { Email } from '@app/customer/domain/value-objects/email.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '@app/shared/domain/exceptions/application.exception';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepository,
} from '../../ports/customer.repository.port';
import { RegisterCustomerCommand } from './register-customer.command';

@CommandHandler(RegisterCustomerCommand)
export class RegisterCustomerHandler
  implements ICommandHandler<RegisterCustomerCommand, void>
{
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(command: RegisterCustomerCommand): Promise<void> {
    const email = Email.create(command.email);

    const existingByEmail = await this.customerRepository.findByEmail(email);

    if (existingByEmail) {
      throw new ApplicationException(
        `Customer with email ${email.getValue()} already exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const customer = Customer.register(
      email,
      command.firstName,
      command.lastName,
      command.phone,
    );

    await this.customerRepository.save(customer);
  }
}
