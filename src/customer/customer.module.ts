import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CUSTOMER_REPOSITORY } from './application/ports/customer.repository.port';
import { DrizzleCustomerRepository } from './infrastructure/adapters/drizzle-customer.repository';
import { MongoCustomerRepository } from './infrastructure/adapters/mongo-customer.repository';

@Module({
  providers: [
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
  controllers: [],
})
export class CustomerModule {}
