import { AuthGuard } from '../auth.guard';
import { JwtService } from '@nestjs/jwt';

jest.mock('@nestjs/jwt', () => {
  return {
    JwtService: jest.fn().mockImplementation(() => {
      return { verifyAsync: jest.fn() };
    }),
  };
});

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService();
    authGuard = new AuthGuard(jwtService);
  });

  it('should return true when the token is valid', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer token_valido',
          },
        }),
      }),
    };

    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({});

    const result = await authGuard.canActivate(context as any);

    expect(result).toBe(true);
  });
});
