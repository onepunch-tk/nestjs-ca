import { AggregateRoot } from '@app/shared/domain/aggregate-root';
import { CustomerId } from '../value-objects/customer-id.vo';
import { Email } from '../value-objects/email.vo';

type CustomerProps = {
  id: CustomerId;
  email: Email;
  firstName: string;
  lastName: string;
  isActive: boolean;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export class Customer extends AggregateRoot {
  private readonly _id: CustomerId;
  private _email: Email;
  private _firstName: string;
  private _lastName: string;
  private _isActive: boolean;
  private _phone: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: CustomerProps) {
    super();

    this._id = props.id;
    this._email = props.email;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._isActive = props.isActive;
    this._phone = props.phone;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id() {
    return this._id;
  }
  get email() {
    return this._email;
  }
  get firstName() {
    return this._firstName;
  }
  get lastName() {
    return this._lastName;
  }
  get isActive() {
    return this._isActive;
  }
  get phone() {
    return this._phone;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  get fullName() {
    return `${this._firstName} ${this._lastName}`;
  }

  static register(
    email: Email,
    firstName: string,
    lastName: string,
    phone: string | null,
  ): Customer {
    const id = new CustomerId();
    const now = new Date();

    return new Customer({
      id,
      email,
      firstName,
      lastName,
      phone,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: CustomerProps): Customer {
    return new Customer(props);
  }
}
