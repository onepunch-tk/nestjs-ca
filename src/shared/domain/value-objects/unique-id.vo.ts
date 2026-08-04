import { randomUUID } from 'node:crypto';

export class UniqueId {
  private readonly value: string;

  constructor(id?: string) {
    this.value = id ?? randomUUID();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UniqueId): boolean {
    return this.getValue() === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
