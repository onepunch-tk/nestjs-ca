import {
  DRIZZLE,
  type DrizzleDB,
} from '@app/shared/infrastructure/database/postgres/drizzle.provider';
import { customers } from '@app/shared/infrastructure/database/postgres/schema';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CustomerRepositoryPort } from '../../application/ports/customer.repository.port';
import { Customer } from '../../domain/entites/customer.entity';
import { CustomerId } from '../../domain/value-objects/cumster-id.vo';
import { Email } from '../../domain/value-objects/email.vo';

@Injectable()
export class DrizzleCustomerRepository implements CustomerRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async save(customer: Customer): Promise<void> {
    const row = DrizzleCustomerRepository.toPersistence(customer);

    await this.db
      .insert(customers)
      .values(row)
      .onConflictDoUpdate({
        target: customers.id,
        set: {
          email: row.email,
          firstName: row.firstName,
          lastName: row.lastName,
          phone: row.phone,
          isActive: row.isActive,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      });
  }

  async findById(id: CustomerId): Promise<Customer | null> {
    const rows = await this.db
      .select()
      .from(customers)
      .where(eq(customers.id, id.getValue()));

    if (rows.length === 0) return null;

    return DrizzleCustomerRepository.toDomain(rows[0]);
  }

  async findByEmail(email: Email): Promise<Customer | null> {
    const rows = await this.db
      .select()
      .from(customers)
      .where(eq(customers.email, email.getValue()));

    if (rows.length === 0) return null;

    return DrizzleCustomerRepository.toDomain(rows[0]);
  }

  async findAll(): Promise<Customer[]> {
    const rows = await this.db.select().from(customers);

    return rows.map((row) => DrizzleCustomerRepository.toDomain(row));
  }

  async deleteById(id: CustomerId): Promise<void> {
    await this.db.delete(customers).where(eq(customers.id, id.getValue()));
  }

  private static toPersistence(
    customer: Customer,
  ): typeof customers.$inferSelect {
    return {
      id: customer.id.getValue(),
      email: customer.email.getValue(),
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      isActive: customer.isActive,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  private static toDomain(row: typeof customers.$inferSelect): Customer {
    return Customer.reconstitute({
      id: new CustomerId(row.id),
      email: Email.create(row.email),
      firstName: row.firstName,
      lastName: row.lastName,
      phone: row.phone,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
