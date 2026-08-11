import { Customer } from '@app/customer/domain/entities/customer.entity';

export class CustomerResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  phone: string | null;
  createdAt: string;
  updatedAt: string;

  static fromDomain(customer: Customer): CustomerResponseDto {
    const dto = new CustomerResponseDto();

    dto.id = customer.id.getValue();
    dto.email = customer.email.getValue();
    dto.firstName = customer.firstName;
    dto.lastName = customer.lastName;
    dto.fullName = customer.fullName;
    dto.isActive = customer.isActive;
    dto.phone = customer.phone;
    dto.createdAt = customer.createdAt.toISOString();
    dto.updatedAt = customer.updatedAt.toISOString();

    return dto;
  }
}
