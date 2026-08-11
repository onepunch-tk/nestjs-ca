import { CustomerRepositoryPort } from '@app/customer/application/ports/customer.repository.port';
import { Customer } from '@app/customer/domain/entities/customer.entity';
import { CustomerId } from '@app/customer/domain/value-objects/customer-id.vo';
import { Email } from '@app/customer/domain/value-objects/email.vo';
import { MONGO_DB } from '@app/shared/infrastructure/database/mongodb/mongo.provider';
import { Inject, Injectable } from '@nestjs/common';
import { Collection, Db } from 'mongodb';

interface CustomerDocument {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  isActivce: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class MongoCustomerRepository implements CustomerRepositoryPort {
  private readonly collection: Collection<CustomerDocument>;

  constructor(@Inject(MONGO_DB) private readonly db: Db) {
    this.collection = this.db.collection<CustomerDocument>('customers');
  }

  async save(customer: Customer): Promise<void> {
    const doc = MongoCustomerRepository.toPersistence(customer);

    await this.collection.updateOne(
      { _id: doc._id },
      { $set: doc },
      { upsert: true },
    );
  }

  async findById(id: CustomerId): Promise<Customer | null> {
    const doc = await this.collection.findOne({ _id: id.getValue() });

    return doc !== null ? MongoCustomerRepository.toDomain(doc) : null;
  }

  async findByEmail(email: Email): Promise<Customer | null> {
    const doc = await this.collection.findOne({ email: email.getValue() });

    return doc !== null ? MongoCustomerRepository.toDomain(doc) : null;
  }

  async findAll(): Promise<Customer[]> {
    const docs = await this.collection.find().toArray();

    return docs.map((doc) => MongoCustomerRepository.toDomain(doc));
  }

  async deleteById(id: CustomerId): Promise<void> {
    await this.collection.deleteOne({ _id: id.getValue() });
  }

  private static toPersistence(customer: Customer): CustomerDocument {
    return {
      _id: customer.id.getValue(),
      email: customer.email.getValue(),
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      isActivce: customer.isActive,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  private static toDomain(doc: CustomerDocument): Customer {
    return Customer.reconstitute({
      id: new CustomerId(doc._id),
      email: Email.create(doc.email),
      firstName: doc.firstName,
      lastName: doc.lastName,
      isActive: doc.isActivce,
      phone: doc.phone,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
