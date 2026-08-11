import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterCustomerCommand } from '../application/use-cases/register-customer/register-customer.command';
import { RegisterCustomerDto } from './dtos/register-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async test() {
    this.commandBus;
    this.queryBus;
  }

  @Post()
  async register(@Body() dto: RegisterCustomerDto): Promise<void> {
    return this.commandBus.execute<RegisterCustomerCommand, void>(
      new RegisterCustomerCommand(
        dto.email,
        dto.firstName,
        dto.lastName,
        dto.phone,
      ),
    );
  }
}
