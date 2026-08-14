import { AggregateRoot } from '@app/shared/domain/aggregate-root';
import { DomainException } from '@app/shared/domain/exceptions/domain.exception';
import { Money } from '@app/shared/domain/value-objects/money.vo';
import { OrderId } from '../value-objects/order-id.vo';
import { OrderStatus } from '../value-objects/order-status.vo';
import { ShippingAddress } from '../value-objects/shipping-adress.vo';
import { OrderItem } from './order-item.entity';

interface OrderProps {
  id: OrderId;
  customerId: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Order extends AggregateRoot {
  private readonly _id: OrderId;
  private readonly _customerId: string;
  private readonly _status: OrderStatus;
  private readonly _items: OrderItem[];
  private readonly _shippingAddress: ShippingAddress;
  private readonly _trackingNumber: string | null;
  private readonly _notes: string | null;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: OrderProps) {
    super();

    this._id = props.id;
    this._customerId = props.customerId;
    this._status = props.status;
    this._items = props.items;
    this._shippingAddress = props.shippingAddress;
    this._trackingNumber = props.trackingNumber;
    this._notes = props.notes;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static place(
    customerId: string,
    items: OrderItem[],
    shippingAddress: ShippingAddress,
  ) {
    if (items.length === 0) {
      throw new DomainException(`An order must contain sy least one itme`);
    }

    const now = new Date();
    const id = new OrderId();

    const order = new Order({
      id,
      customerId,
      status: OrderStatus.pending(),
      items,
      shippingAddress,
      trackingNumber: null,
      notes: null,
      createdAt: now,
      updatedAt: now,
    });

    return order;
  }

  static reconstitute(props: OrderProps): Order {
    return new Order(props);
  }

  getTotal(): Money {
    return this.getSubtotal();
  }

  getSubtotal() {
    if (this._items.length === 0) {
      return Money.zero();
    }

    return this.items.reduce(
      (sum, item) => sum.add(item.getSubtotal()),
      Money.zero(this._items[0].unitPrice.getCurrency()),
    );
  }

  get id() {
    return this._id;
  }
  get customerId() {
    return this._customerId;
  }
  get status() {
    return this._status;
  }
  get items() {
    return this._items;
  }
  get shippingAddress() {
    return this._shippingAddress;
  }
  get trackingNumber() {
    return this._trackingNumber;
  }
  get notes() {
    return this._notes;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }
}
