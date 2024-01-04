import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/modules/users/dtos/user.dto';
import { ErrorResponseDto } from 'src/dtos/error.response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDto | ErrorResponseDto> {
    const user = await this.userModel.findOne({ email });
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!user || !isMatchPassword) {
      return {
        statusCode: 404,
        message: 'User not found',
      };
    }

    return user;
  }

  async generateToken(user: any): Promise<string> {
    const payload = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      height: user.height,
    };
    return await this.jwtService.signAsync(payload);
  }
}
