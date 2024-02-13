import { OmitType } from '@nestjs/mapped-types';
import { UserDto } from '../user.dto';

export class UserResponseDto extends OmitType(UserDto, ['password'] as const) {}
