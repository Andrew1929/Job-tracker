import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthConfig } from '../../../config/auth.config';
import { RedisService } from '../../redis/redis.service';
import { UsersService } from '../../users/users.service';
import { AuthService } from './auth.service';
import { RefreshTokenService, TokenService } from './token.service';

const USER_ID = 'user-1';

const authConfig: AuthConfig = {
  accessSecret: 'access-secret',
  refreshSecret: 'refresh-secret',
  accessExpiresIn: '15m',
  refreshExpiresIn: '30d',
  bcryptRounds: 4,
  useCookies: true,
};

const publicUser = {
  id: USER_ID,
  email: 'user@example.com',
  role: 'USER',
  isActive: true,
};

/**
 * A Map stands in for the Redis session store so revocation and rotation are
 * exercised for real rather than asserted through call spies.
 */
function createSessionStore() {
  const sessions = new Map<string, string>();

  const redisService = {
    buildKey: (prefix: string, ...parts: string[]) =>
      [prefix, ...parts].join(':'),
    getAuthRefreshKey: (userId: string, sessionId: string) =>
      `auth:refresh:${userId}:${sessionId}`,
    set: (key: string, value: string) => {
      sessions.set(key, value);
      return Promise.resolve();
    },
    get: (key: string) => Promise.resolve(sessions.get(key) ?? null),
    del: (...keys: string[]) => {
      keys.forEach((key) => sessions.delete(key));
      return Promise.resolve();
    },
  } as unknown as RedisService;

  return { sessions, redisService };
}

describe('AuthService refresh lifecycle', () => {
  let authService: AuthService;
  let tokenService: TokenService;
  let sessions: Map<string, string>;

  beforeEach(() => {
    // Only the clock is faked: `jsonwebtoken` resolves its async callbacks
    // through the microtask queue, which must keep running for real.
    jest.useFakeTimers({
      doNotFake: ['nextTick', 'setImmediate', 'queueMicrotask'],
    });
    jest.setSystemTime(new Date('2026-08-02T10:00:00.000Z'));

    const configService = { get: () => authConfig } as unknown as ConfigService;
    tokenService = new TokenService(new JwtService({}), configService);

    const store = createSessionStore();
    sessions = store.sessions;

    const refreshTokenService = new RefreshTokenService(
      store.redisService,
      tokenService,
    );

    const usersService = {
      findAuthUserById: jest
        .fn()
        .mockResolvedValue({ ...publicUser, refreshTokenVersion: 0 }),
      findById: jest.fn().mockResolvedValue(publicUser),
    } as unknown as UsersService;

    authService = new AuthService(
      usersService,
      tokenService,
      refreshTokenService,
      configService,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  /** Mirrors login without going through password hashing. */
  async function startSession() {
    const sessionId = 'session-1';
    const tokens = await tokenService.generateTokenPair({
      userId: USER_ID,
      email: publicUser.email,
      role: publicUser.role,
      sessionId,
      tokenVersion: 0,
    });

    sessions.set(`auth:refresh:${USER_ID}:${sessionId}`, tokens.refreshToken);
    return tokens;
  }

  it('issues a verifiable access token on refresh', async () => {
    const { refreshToken } = await startSession();

    const result = await authService.refresh(refreshToken);

    await expect(
      tokenService.verifyAccessToken(result.accessToken),
    ).resolves.toMatchObject({ sub: USER_ID, type: 'access' });
  });

  it('rotates the refresh token and retires the presented one', async () => {
    const { refreshToken } = await startSession();

    // Advance past the one-second resolution of the JWT `iat` claim, otherwise
    // the rotated token is byte-identical and rotation cannot be observed.
    jest.advanceTimersByTime(1000);
    const result = await authService.refresh(refreshToken);

    expect(result.refreshToken).not.toBe(refreshToken);
    await expect(authService.refresh(refreshToken)).rejects.toThrow(
      /invalid or expired/i,
    );
  });

  it('accepts the rotated refresh token for the next refresh', async () => {
    const { refreshToken } = await startSession();

    jest.advanceTimersByTime(1000);
    const first = await authService.refresh(refreshToken);
    jest.advanceTimersByTime(1000);

    await expect(authService.refresh(first.refreshToken)).resolves.toBeTruthy();
  });

  it('rejects a refresh whose Redis session is gone', async () => {
    const { refreshToken } = await startSession();
    sessions.clear();

    await expect(authService.refresh(refreshToken)).rejects.toThrow(
      /invalid or expired/i,
    );
  });

  it('stops refreshing after logout', async () => {
    const { refreshToken } = await startSession();

    await authService.logout(refreshToken);

    expect(sessions.size).toBe(0);
    await expect(authService.refresh(refreshToken)).rejects.toThrow(
      /invalid or expired/i,
    );
  });

  it('never creates a session from an unverifiable refresh token', async () => {
    await expect(authService.refresh('not-a-token')).rejects.toThrow();
    expect(sessions.size).toBe(0);
  });

  it('never creates a session from an access token presented as a refresh token', async () => {
    const { accessToken } = await startSession();
    sessions.clear();

    await expect(authService.refresh(accessToken)).rejects.toThrow();
    expect(sessions.size).toBe(0);
  });
});
