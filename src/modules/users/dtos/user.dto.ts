import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { GENDERS } from '../utils/constants';
import { Type } from 'class-transformer';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  _id;

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
  @IsDate()
  @Type(() => Date)
  birthDay: Date;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Min(50)
  @Max(270)
  height;

  @IsNotEmpty()
  @IsIn(GENDERS)
  gender: (typeof GENDERS)[number];

  @IsNotEmpty()
  @IsString()
  password;

  @IsNotEmpty()
  @IsBoolean()
  status;

  @IsOptional()
  @Type(() => Date)
  createdAt?;

  @IsOptional()
  @Type(() => Date)
  updatedAt?;
}
