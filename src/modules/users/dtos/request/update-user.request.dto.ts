import { OmitType, PartialType } from '@nestjs/mapped-types';
import { UserDto } from '../user.dto';

export class UpdateUserRequestDto extends PartialType(
  OmitType(UserDto, ['id', 'email'] as const),
) {}
