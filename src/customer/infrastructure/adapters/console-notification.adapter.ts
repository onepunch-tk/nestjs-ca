import {
  CUSTOMER_REPOSITORY,
  type CustomerRepository,
} from '@app/customer/application/ports/customer.repository.port';
import {
  Notification,
  NotificationPort,
} from '@app/customer/application/ports/notification.port';
import { CustomerId } from '@app/customer/domain/value-objects/customer-id.vo';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ConsoleNotificationAdapter implements NotificationPort {
  private readonly logger = new Logger(ConsoleNotificationAdapter.name);

  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async sendNotification(notification: Notification): Promise<void> {
    const customer = await this.customerRepository.findById(
      new CustomerId(notification.recipientId),
    );

    const recipient = customer?.email.getValue() ?? notification.recipientId;

    this.logger.log(
      `[${notification.subject}] To: ${recipient} | ${notification.message}`,
    );
  }
}
