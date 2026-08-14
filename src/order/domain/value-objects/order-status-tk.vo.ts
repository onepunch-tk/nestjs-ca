export type OrderStatusValue =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export class OrderStatusTk<S extends OrderStatusValue = OrderStatusValue> {
  private constructor(private readonly value: S) {}

  static pending(): OrderStatusTk<'pending'> {
    return new OrderStatusTk('pending');
  }

  static confirmed(): OrderStatusTk<'confirmed'> {
    return new OrderStatusTk('confirmed');
  }

  static shipped(): OrderStatusTk<'shipped'> {
    return new OrderStatusTk('shipped');
  }

  static delivered(): OrderStatusTk<'delivered'> {
    return new OrderStatusTk('delivered');
  }
  static cancelled(): OrderStatusTk<'cancelled'> {
    return new OrderStatusTk('cancelled');
  }

  confirm(this: OrderStatusTk<'pending'>): OrderStatusTk<'confirmed'> {
    return new OrderStatusTk('confirmed');
  }

  ship(this: OrderStatusTk<'confirmed'>): OrderStatusTk<'shipped'> {
    return new OrderStatusTk('shipped');
  }
  deliver(this: OrderStatusTk<'shipped'>): OrderStatusTk<'delivered'> {
    return new OrderStatusTk('delivered');
  }
  cancel(
    this: OrderStatusTk<'pending' | 'confirmed'>,
  ): OrderStatusTk<'cancelled'> {
    return new OrderStatusTk('cancelled');
  }

  canConfirm(): this is OrderStatusTk<'pending'> {
    return this.is('pending');
  }

  canShip(): this is OrderStatusTk<'confirmed'> {
    return this.is('confirmed');
  }

  canDeliver(): this is OrderStatusTk<'shipped'> {
    return this.is('shipped');
  }

  canCancel(): this is OrderStatusTk<'pending' | 'confirmed'> {
    return this.is('pending') || this.is('confirmed');
  }

  is<K extends OrderStatusValue>(candidate: K): this is OrderStatusTk<K> {
    return (this.value as OrderStatusValue) === candidate;
  }
}
