import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventHandlers } from './application/events';
import { CUSTOMER_REPOSITORY } from './application/ports/customer.repository.port';
import { NOTIFICATION_SERVICE } from './application/ports/notification.port';
import { QueryHandlers } from './application/queries/handlers';
import { CommandHandlers } from './application/use-cases';
import { DrizzleCustomerRepository } from './infrastructure/adapters/drizzle-customer.repository';
import { MongoCustomerRepository } from './infrastructure/adapters/mongo-customer.repository';
import { NodeMailerEmailAdapter } from './infrastructure/adapters/node-mailer-notification.adapter';
import { ResendEmailAdapter } from './infrastructure/adapters/resend-notification.adapter';
import { CustomerController } from './presentation/customer.controller';

@Module({
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    DrizzleCustomerRepository,
    MongoCustomerRepository,
    NodeMailerEmailAdapter,
    ResendEmailAdapter,
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
    {
      provide: NOTIFICATION_SERVICE,
      useFactory: (
        configService: ConfigService,
        nodemailer: NodeMailerEmailAdapter,
        resend: ResendEmailAdapter,
      ) => {
        return configService.get('EMAIL') === 'mailtrap' ? nodemailer : resend;
      },
      inject: [ConfigService, NodeMailerEmailAdapter, ResendEmailAdapter],
    },
  ],
  controllers: [CustomerController],
})
export class CustomerModule {}
