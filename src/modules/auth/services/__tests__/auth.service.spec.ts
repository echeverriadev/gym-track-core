import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: any;
  let jwtService: JwtService;

  beforeEach(async () => {
    userModel = {
      findOne: jest.fn(),
    };

    jwtService = new JwtService({
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
      decode: jest.fn(),
      mergeJwtOptions: jest.fn(),
      overrideSecretFromOptions: jest.fn(),
      getSecretKey: jest.fn(),
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken('User'), useValue: userModel },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should return a user if the validation is successful', async () => {
    const user = { email: 'test@test.com', password: 'test' };
    userModel.findOne.mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await authService.validateUser(user.email, user.password);

    expect(result).toEqual(user);
  });

  it('should return an error response if the validation fails', async () => {
    const user = { email: 'test@test.com', password: 'test' };
    userModel.findOne.mockResolvedValue(null);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    const result = await authService.validateUser(user.email, user.password);

    expect(result).toEqual({
      statusCode: 404,
      message: 'User not found',
    });
  });

  it('should generate a token', async () => {
    const user = {
      _id: '1',
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      gender: 'male',
      height: 170,
    };
    const token = 'token';
    jwtService.signAsync.mockResolvedValue(token);

    const result = await authService.generateToken(user);

    expect(result).toBe(token);
  });
});
