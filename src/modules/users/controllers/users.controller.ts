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
import { UpdateUserRequestDto } from '../dtos/request/update-user.request.dto';
import { ErrorResponseDto } from 'src/dtos/error.response.dto';
import * as bcrypt from 'bcrypt';
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async create(
    @Body() createUserDto: CreateUserRequestDto,
  ): Promise<UserResponseDto | ErrorResponseDto> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<UserResponseDto[] | ErrorResponseDto> {
    return this.usersService.find({});
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ): Promise<UserResponseDto | ErrorResponseDto> {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserRequestDto,
  ): Promise<UserResponseDto | ErrorResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }
}
