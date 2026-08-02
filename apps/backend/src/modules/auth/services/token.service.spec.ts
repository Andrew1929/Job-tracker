import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthConfig } from '../../../config/auth.config';
import { TokenService } from './token.service';

function createTokenService(accessExpiresIn: string): TokenService {
  const authConfig: AuthConfig = {
    accessSecret: 'access-secret',
    refreshSecret: 'refresh-secret',
    accessExpiresIn,
    refreshExpiresIn: '30d',
    bcryptRounds: 4,
    useCookies: true,
  };

  return new TokenService(new JwtService({}), {
    get: () => authConfig,
  } as unknown as ConfigService);
}

describe('TokenService access token max age', () => {
  it('derives the cookie max age from JWT_ACCESS_EXPIRES_IN', () => {
    expect(createTokenService('15m').getAccessTokenMaxAgeMs()).toBe(900_000);
  });

  it.each([
    ['30s', 30_000],
    ['1h', 3_600_000],
    ['900', 900_000],
  ])('follows the configured value %s', (configured, expected) => {
    expect(createTokenService(configured).getAccessTokenMaxAgeMs()).toBe(
      expected,
    );
  });

  it('keeps the cookie and the signed token on the same clock', async () => {
    const service = createTokenService('1h');
    const { accessToken } = await service.generateTokenPair({
      userId: 'user-1',
      email: 'user@example.com',
      role: 'USER',
      sessionId: 'session-1',
      tokenVersion: 0,
    });

    const payload = await service.verifyAccessToken(accessToken);
    const tokenLifetimeMs =
      ((payload as unknown as { exp: number; iat: number }).exp -
        (payload as unknown as { exp: number; iat: number }).iat) *
      1000;

    expect(service.getAccessTokenMaxAgeMs()).toBe(tokenLifetimeMs);
  });
});
