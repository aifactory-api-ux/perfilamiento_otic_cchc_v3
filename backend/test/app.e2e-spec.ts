import { INestApplication, ValidationPipe, CanActivate, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';
import { ProfilesController } from '../src/profiles/profiles.controller';
import { ProfilesService } from '../src/profiles/profiles.service';
import { KeycloakAuthGuard } from '../src/auth/guards/keycloak-auth.guard';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';

class AllowAllGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = {
      id: 'test-user',
      username: 'tester',
      email: 'tester@example.com',
      roles: ['admin', 'manager'],
    };
    return true;
  }
}

describe('App E2E', () => {
  let app: INestApplication;
  const users = [
    { id: 1, email: 'admin@example.com', name: 'Admin', roles: ['admin'], createdAt: new Date() },
  ];
  const profiles = [
    {
      id: 10,
      userId: 1,
      name: 'Admin',
      email: 'admin@example.com',
      skills: ['Leadership'],
      experienceYears: 5,
      certifications: ['PMP'],
      createdAt: new Date(),
    },
  ];

  const usersService = {
    findAll: jest.fn().mockResolvedValue(users),
  };
  const profilesService = {
    findAll: jest.fn().mockResolvedValue(profiles),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController, ProfilesController],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: ProfilesService, useValue: profilesService },
        KeycloakAuthGuard,
      ],
    })
      .overrideGuard(KeycloakAuthGuard)
      .useClass(AllowAllGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns users with standard response envelope', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', 'Bearer test');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data[0].email).toBe('admin@example.com');
  });

  it('returns profiles with standard response envelope', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/profiles')
      .set('Authorization', 'Bearer test');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data[0].skills).toContain('Leadership');
  });

  it('rejects invalid payloads with validation errors', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/users')
      .set('Authorization', 'Bearer test')
      .send({ email: 'not-an-email', name: 123 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it('returns 404 for unknown routes', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/does-not-exist')
      .set('Authorization', 'Bearer test');

    expect(response.status).toBe(404);
  });
});
