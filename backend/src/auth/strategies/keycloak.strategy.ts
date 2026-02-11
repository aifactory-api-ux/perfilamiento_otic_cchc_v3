import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak-jwt') {
  constructor() {
    const envKey = process.env.KEYCLOAK_PUBLIC_KEY;
    const publicKey = envKey ? envKey.replace(/\\n/g, '\n') : undefined;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    });
  }

  validate(payload: any) {
    if (!payload?.sub) {
      throw new UnauthorizedException('Token payload missing subject');
    }

    return {
      id: payload.sub,
      username: payload.preferred_username,
      email: payload.email,
      roles: payload.realm_access?.roles ?? [],
    };
  }
}
