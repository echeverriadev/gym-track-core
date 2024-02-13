import { OmitType } from '@nestjs/mapped-types';
import { UserDto } from '../user.dto';

export class CreateUserRequestDto extends OmitType(UserDto, [
  '_id',
  'status',
] as const) {}
