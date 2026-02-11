import { INestApplication, ValidationPipe, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';
import { KeycloakAuthGuard } from '../src/auth/guards/keycloak-auth.guard';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';

class AllowAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = {
      id: 'admin-1',
      username: 'admin',
      email: 'admin@example.com',
      roles: ['admin'],
    };
    return true;
  }
}

describe('Users E2E', () => {
  let app: INestApplication;
  const createdAt = new Date();

  const usersService = {
    findAll: jest.fn().mockResolvedValue([
      { id: 1, email: 'admin@example.com', name: 'Admin', roles: ['admin'], createdAt },
    ]),
    findOne: jest.fn().mockImplementation((id: number) => {
      if (id === 99) {
        throw new NotFoundException('User not found');
      }
      return Promise.resolve({ id, email: 'user@example.com', name: 'User', roles: ['user'], createdAt });
    }),
    create: jest.fn().mockResolvedValue({
      id: 2,
      email: 'new@example.com',
      name: 'New User',
      roles: ['user'],
      createdAt,
    }),
    update: jest.fn().mockResolvedValue({
      id: 2,
      email: 'updated@example.com',
      name: 'Updated User',
      roles: ['manager'],
      createdAt,
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        KeycloakAuthGuard,
      ],
    })
      .overrideGuard(KeycloakAuthGuard)
      .useClass(AllowAdminGuard)
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

  it('lists users', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', 'Bearer test');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it('gets a single user', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users/1')
      .set('Authorization', 'Bearer test');

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe('user@example.com');
  });

  it('returns 404 when user does not exist', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users/99')
      .set('Authorization', 'Bearer test');

    expect(response.status).toBe(404);
  });

  it('creates a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/users')
      .set('Authorization', 'Bearer test')
      .send({ email: 'new@example.com', name: 'New User', roles: ['user'] });

    expect(response.status).toBe(201);
    expect(response.body.data.email).toBe('new@example.com');
  });

  it('rejects invalid payloads', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/users')
      .set('Authorization', 'Bearer test')
      .send({ email: 'invalid', name: 12 });

    expect(response.status).toBe(400);
  });

  it('updates a user', async () => {
    const response = await request(app.getHttpServer())
      .patch('/api/users/2')
      .set('Authorization', 'Bearer test')
      .send({ email: 'updated@example.com', roles: ['manager'] });

    expect(response.status).toBe(200);
    expect(response.body.data.roles).toContain('manager');
  });

  it('deletes a user', async () => {
    const response = await request(app.getHttpServer())
      .delete('/api/users/2')
      .set('Authorization', 'Bearer test');

    expect(response.status).toBe(200);
    expect(response.body.data.deleted).toBe(true);
  });
});
