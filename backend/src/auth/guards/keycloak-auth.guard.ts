import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verify, JwtPayload } from 'jsonwebtoken';

type KeycloakToken = JwtPayload & {
  preferred_username?: string;
  email?: string;
  realm_access?: { roles?: string[] };
};

@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const envKey = process.env.KEYCLOAK_PUBLIC_KEY;
    const publicKey = envKey ? envKey.replace(/\\n/g, '\n') : undefined;
    if (!publicKey) {
      throw new UnauthorizedException('Keycloak public key not configured');
    }

    let payload: KeycloakToken;
    try {
      payload = verify(token, publicKey, {
        algorithms: ['RS256'],
      }) as KeycloakToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.user = {
      id: payload.sub,
      username: payload.preferred_username,
      email: payload.email,
      roles: payload.realm_access?.roles ?? [],
    };

    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    if (requiredRoles.length > 0) {
      const userRoles = new Set(request.user.roles);
      const hasRole = requiredRoles.some((role) => userRoles.has(role));
      if (!hasRole) {
        throw new ForbiddenException('Insufficient role permissions');
      }
    }

    return true;
  }
}
