import { ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { sign } from 'jsonwebtoken';
import { KeycloakAuthGuard } from '../src/auth/guards/keycloak-auth.guard';

const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCTvMgjpWEC4mmgm5l5vnoMFw/ucXFaXHJOWxg0TdB6XbqBlrX7
PWodl4b8sK9rW0+VJPV5YAgGAD1lvqLO6oKD8HwIlIVCsD/7EEBt4Wcq8coNzZxk
1yDhoXR+Q8n5LoaQj3s3AA0sFbEKgz5bc4Us4MknEY1yx1dYLdAd2wIDAQABAoGA
GRc6x4SWO/FE52dzv8IWn+T4tSObGZ9sld0H76r6w4RddV+9ti37khmPAPs5nJCW
7Fj4/uA2CnGc8K76yvbhNxdEio+VtkctOHqx2J+ePXhmfqhFN2b1fZ7C0C5G1H7o
9Azd3uZbUHGCCg39b4oL1Qkq4hQbUwUFoe7tQtECQQDIQujYzHf6veCYlf4aQDPz
Y7ZXeNheXQ9rsZIrWmxSg/qC3ROzj9WFvIOGcW1RAptdGJJFpkbcsZHMm+4JvnZx
AkEAwm2D7oFfAwYJV+f0n2EABTPnQQAwE4oP1KBiIWycokpAXc5xCk91E4L6GCtP
8G0XFjrJa1rmzL78u7RGLb3sXwJACIQJt1A6EwE5mT5HB7Hkg4v0C4R2HHJXlUv5
CttSgLiX3SdXyGIYrl0olbB6+BP66ccic2gCJGJoIY6x08SnuQJBAMxpVIBfJAx0
7R5sLNy2dYxTQmmKp7b82pp0zM7W+YiH2hfF1Yq1h/ibItmHbyJJVd0CqOuBLMeK
X+1gL3aPjp8CQGBVwDL1K6ANcfX2D+MfsIfkxlChO+QGme0Qi3BS3bmf3zw9fK9x
7/9Olm/hjFvTQXaZUb7CkaIqRm38mBiE2FY=
-----END RSA PRIVATE KEY-----`;

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCTvMgjpWEC4mmgm5l5vnoMFw/u
cXFaXHJOWxg0TdB6XbqBlrX7PWodl4b8sK9rW0+VJPV5YAgGAD1lvqLO6oKD8HwI
lIVCsD/7EEBt4Wcq8coNzZxk1yDhoXR+Q8n5LoaQj3s3AA0sFbEKgz5bc4Us4Mkn
EY1yx1dYLdAd2wIDAQAB
-----END PUBLIC KEY-----`;

const buildContext = (authorization?: string, roles?: string[]) => {
  const handler = () => undefined;
  if (roles) {
    Reflect.defineMetadata('roles', roles, handler);
  }
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: authorization ? { authorization } : {},
      }),
    }),
    getHandler: () => handler,
    getClass: () => undefined,
  } as ExecutionContext;
};

describe('KeycloakAuthGuard', () => {
  const reflector = new Reflector();
  let guard: KeycloakAuthGuard;

  beforeEach(() => {
    guard = new KeycloakAuthGuard(reflector);
    process.env.KEYCLOAK_PUBLIC_KEY = PUBLIC_KEY;
  });

  afterEach(() => {
    delete process.env.KEYCLOAK_PUBLIC_KEY;
  });

  it('throws when bearer token is missing', () => {
    const context = buildContext();
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('throws when key is not configured', () => {
    delete process.env.KEYCLOAK_PUBLIC_KEY;
    const context = buildContext('Bearer token');
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('throws when token is invalid', () => {
    const context = buildContext('Bearer invalid-token');
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('rejects when required roles are missing', () => {
    const token = sign(
      {
        sub: 'user-1',
        preferred_username: 'user1',
        email: 'user1@example.com',
        realm_access: { roles: ['user'] },
      },
      PRIVATE_KEY,
      { algorithm: 'RS256', expiresIn: '1h' },
    );
    const context = buildContext(`Bearer ${token}`, ['admin']);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('accepts valid tokens and assigns user details', () => {
    const token = sign(
      {
        sub: 'admin-1',
        preferred_username: 'admin',
        email: 'admin@example.com',
        realm_access: { roles: ['admin'] },
      },
      PRIVATE_KEY,
      { algorithm: 'RS256', expiresIn: '1h' },
    );
    const context = buildContext(`Bearer ${token}`, ['admin']);
    const result = guard.canActivate(context);
    expect(result).toBe(true);
    const request = context.switchToHttp().getRequest();
    expect(request.user.username).toBe('admin');
    expect(request.user.roles).toContain('admin');
  });
});
