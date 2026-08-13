import {
  CUSTOMER_REPOSITORY,
  type CustomerRepository,
} from '@app/customer/application/ports/customer.repository.port';
import {
  Notification,
  NotificationPort,
} from '@app/customer/application/ports/notification.port';
import { CustomerId } from '@app/customer/domain/value-objects/customer-id.vo';
import { ApplicationException } from '@app/shared/domain/exceptions/application.exception';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class ResendEmailAdapter implements NotificationPort {
  private readonly resend: Resend;
  private readonly from: string;
  private readonly logger = new Logger(ResendEmailAdapter.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {
    this.resend = new Resend(
      this.configService.getOrThrow<string>('RESEND_API_KEY'),
    );
    this.from = this.configService.getOrThrow<string>('SMTP_FROM');
  }

  async sendNotification(notification: Notification): Promise<void> {
    const customer = await this.customerRepository.findById(
      new CustomerId(notification.recipientId),
    );

    if (!customer) {
      throw new ApplicationException(
        `User not found by ${notification.recipientId}`,
      );
    }

    await this.resend.emails.send({
      from: this.from,
      to: customer.email.getValue(),
      subject: notification.subject,
      html: notification.message,
    });

    this.logger.log(`Email sent to ${customer.email.getValue()}`);
  }
}
