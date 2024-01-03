import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  id;

  @IsNotEmpty()
  @IsString()
  firstName;

  @IsNotEmpty()
  @IsString()
  lastName;

  @IsNotEmpty()
  @IsEmail()
  email;

  @IsNotEmpty()
  @IsString()
  password;

  @IsNotEmpty()
  @IsBoolean()
  status;

  @IsOptional()
  @IsDate()
  createdAt?;

  @IsOptional()
  @IsDate()
  updatedAt?;
}
