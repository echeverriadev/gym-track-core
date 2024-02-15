import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from '../user.dto';

export class UpdateUserRequestDto extends PartialType(UserDto) {}
