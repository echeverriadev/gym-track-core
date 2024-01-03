import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entities/user.entity';
import { CreateUserRequestDto } from '../dtos/request/create-user.request.dto';
import { UserResponseDto } from '../dtos/respose/user.response.dto';
import { ErrorResponseDto } from '../dtos/respose/error.response.dto';
import { UpdateUserRequestDto } from '../dtos/request/update-user.request.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(
    user: CreateUserRequestDto,
  ): Promise<UserResponseDto | ErrorResponseDto> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    return this.userModel
      .create(user)
      .then((user) => {
        return this.#responseWithClientOrException(user);
      })
      .catch((err) => ({
        statusCode: 500,
        message: 'Error creating user',
        error: err,
      }));
  }

  findAll(): Promise<UserResponseDto[] | ErrorResponseDto> {
    return this.userModel
      .find()
      .then((users) => {
        if (!users) {
          return;
        }
        return users.map((user) => this.#mapEntityToDto(user));
      })
      .catch((err) => ({
        statusCode: 500,
        message: 'Error finding users',
        error: err,
      }));
  }

  findOne(id: string): Promise<UserResponseDto | ErrorResponseDto> {
    return this.userModel
      .findById(id)
      .then((user) => {
        return this.#responseWithClientOrException(user);
      })
      .catch((err) => ({
        statusCode: 500,
        message: 'Error finding user',
        error: err,
      }));
  }

  update(
    id: string,
    updateUser: UpdateUserRequestDto,
  ): Promise<UserResponseDto | ErrorResponseDto> {
    return this.userModel
      .findByIdAndUpdate(id, updateUser, { new: true })
      .then((user) => {
        return this.#responseWithClientOrException(user);
      })
      .catch((err) => ({
        statusCode: 500,
        message: 'Error updating user',
        error: err,
      }));
  }

  #responseWithClientOrException(user: void | User): UserResponseDto {
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return this.#mapEntityToDto(user);
  }

  #mapEntityToDto(user): UserResponseDto {
    const response = new UserResponseDto();
    response._id = user._id.toHexString();
    response.firstName = user.firstName;
    response.lastName = user.lastName;
    response.email = user.email;
    response.status = user.status;
    response.createdAt = user.createdAt;
    response.updatedAt = user.updatedAt;
    return response;
  }
}
