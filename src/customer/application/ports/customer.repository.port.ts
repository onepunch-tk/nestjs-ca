import { Customer } from '@app/customer/domain/entites/customer.entity';
import { CustomerId } from '@app/customer/domain/value-objects/cumster-id.vo';
import { Email } from '@app/customer/domain/value-objects/email.vo';

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');

export interface CustomerRepositoryPort {
  save(customer: Customer): Promise<void>;
  findById(id: CustomerId): Promise<Customer | null>;
  findByEmail(email: Email): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  deleteById(id: CustomerId): Promise<void>;
}
