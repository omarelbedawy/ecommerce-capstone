process.env.JWT_SECRET = 'test_secret';
process.env.REFRESH_TOKEN_SECRET = 'test_refresh_secret';
process.env.JWT_EXPIRES_IN = '15m';
process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';

const {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require('../../src/services/tokenService');

const fakeUser = { id: 1, role: 'CUSTOMER' };

describe('tokenService', () => {
  it('signs and verifies an access token', () => {
    const token = signAccessToken(fakeUser);
    const decoded = verifyAccessToken(token);

    expect(decoded.id).toBe(fakeUser.id);
    expect(decoded.role).toBe(fakeUser.role);
  });

  it('signs and verifies a refresh token', () => {
    const token = signRefreshToken(fakeUser);
    const decoded = verifyRefreshToken(token);

    expect(decoded.id).toBe(fakeUser.id);
  });

  it('throws when the token is garbage', () => {
    expect(() => verifyAccessToken('not.a.real.token')).toThrow();
  });

  it('access and refresh tokens use different secrets', () => {
    const accessToken = signAccessToken(fakeUser);
    expect(() => verifyRefreshToken(accessToken)).toThrow();
  });
});
