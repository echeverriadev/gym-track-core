import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entities/user.entity';
import { UserResponseDto } from '../dtos/respose/user.response.dto';
import { AbstractCrudService } from 'src/services/abstract-crud.service';

@Injectable()
export class UsersService extends AbstractCrudService<User> {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super(userModel);
  }

  protected mapEntityToDto(record: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto._id = record.id;
    dto.firstName = record.firstName;
    dto.lastName = record.lastName;
    dto.birthDay = record.birthDay;
    dto.height = record.height;
    dto.gender = record.gender;
    dto.email = record.email;
    dto.status = record.status;
    return dto;
  }
}
