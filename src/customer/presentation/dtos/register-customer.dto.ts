import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class RegisterCustomerDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(200)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  lastName: string;

  @IsPhoneNumber()
  phone: string;
}
