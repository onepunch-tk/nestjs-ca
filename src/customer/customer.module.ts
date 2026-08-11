import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CUSTOMER_REPOSITORY } from './application/ports/customer.repository.port';
import { CommandHandlers } from './application/use-cases';
import { DrizzleCustomerRepository } from './infrastructure/adapters/drizzle-customer.repository';
import { MongoCustomerRepository } from './infrastructure/adapters/mongo-customer.repository';
import { CustomerController } from './presentation/customer.controller';

@Module({
  providers: [
    ...CommandHandlers,
    DrizzleCustomerRepository,
    MongoCustomerRepository,
    {
      provide: CUSTOMER_REPOSITORY,
      useFactory: (
        configService: ConfigService,
        mongoRepo: MongoCustomerRepository,
        drizzleRepo: DrizzleCustomerRepository,
      ) => {
        return configService.get('DATABASE') === 'mongodb'
          ? mongoRepo
          : drizzleRepo;
      },
      inject: [
        ConfigService,
        MongoCustomerRepository,
        DrizzleCustomerRepository,
      ],
    },
  ],
  controllers: [CustomerController],
})
export class CustomerModule {}
