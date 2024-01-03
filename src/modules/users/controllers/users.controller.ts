import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserRequestDto } from '../dtos/request/create-user.request.dto';
import { UserResponseDto } from '../dtos/respose/user.response.dto';
import { ErrorResponseDto } from '../dtos/respose/error.response.dto';
import { UpdateUserRequestDto } from '../dtos/request/update-user.request.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  create(
    @Body() createUserDto: CreateUserRequestDto,
  ): Promise<UserResponseDto | ErrorResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<UserResponseDto[] | ErrorResponseDto> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ): Promise<UserResponseDto | ErrorResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserRequestDto,
  ): Promise<UserResponseDto | ErrorResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }
}
