import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { KeycloakStrategy } from './strategies/keycloak.strategy';
import { KeycloakAuthGuard } from './guards/keycloak-auth.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'keycloak-jwt' }),
    KeycloakConnectModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        authServerUrl: configService.get<string>('KEYCLOAK_URL') || 'http://localhost:8081',
        realm: configService.get<string>('KEYCLOAK_REALM') || 'perfilamiento',
        clientId: configService.get<string>('KEYCLOAK_CLIENT_ID') || 'perfilamiento-api',
        secret: configService.get<string>('KEYCLOAK_CLIENT_SECRET') || 'change_me',
      }),
    }),
  ],
  providers: [KeycloakStrategy, KeycloakAuthGuard],
  exports: [KeycloakAuthGuard],
})
export class AuthModule {}
