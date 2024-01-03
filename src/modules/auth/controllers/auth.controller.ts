import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginRequestDto } from '../dtos/request/login.request.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() { email, password }: LoginRequestDto,
  ): Promise<{ token: string }> {
    const user = await this.authService.validateUser(email, password);
    const token = await this.authService.generateToken(user);
    return { token };
  }
}
