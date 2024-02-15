import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
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
    if (updateUserDto._id || updateUserDto.email) {
      return Promise.reject({
        statusCode: 400,
        message: 'You cannot update the _id or email',
      });
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<UserResponseDto | ErrorResponseDto> {
    return this.usersService.remove(id);
  }

  @Patch('disable/:id')
  disable(
    @Param('id') id: string,
  ): Promise<UserResponseDto | ErrorResponseDto> {
    return this.usersService.update(id, { status: false });
  }
}
