import { INestApplication, ValidationPipe, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ProfilesController } from '../src/profiles/profiles.controller';
import { ProfilesService } from '../src/profiles/profiles.service';
import { KeycloakAuthGuard } from '../src/auth/guards/keycloak-auth.guard';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';

class AllowManagerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = {
      id: 'manager-1',
      username: 'manager',
      email: 'manager@example.com',
      roles: ['manager'],
    };
    return true;
  }
}

describe('Profiles E2E', () => {
  let app: INestApplication;
  const createdAt = new Date();

  const profilesService = {
    findAll: jest.fn().mockResolvedValue([
      {
        id: 1,
        userId: 1,
        name: 'Maria Lopez',
        email: 'maria@example.com',
        skills: ['Scrum'],
        experienceYears: 6,
        certifications: ['PMP'],
        createdAt,
      },
    ]),
    findOne: jest.fn().mockImplementation((id: number) => {
      if (id === 99) {
        throw new NotFoundException('Profile not found');
      }
      return Promise.resolve({
        id,
        userId: 1,
        name: 'Maria Lopez',
        email: 'maria@example.com',
        skills: ['Scrum'],
        experienceYears: 6,
        certifications: ['PMP'],
        createdAt,
      });
    }),
    create: jest.fn().mockResolvedValue({
      id: 2,
      userId: 2,
      name: 'New Profile',
      email: 'new@example.com',
      skills: ['Leadership'],
      experienceYears: 3,
      certifications: [],
      createdAt,
    }),
    update: jest.fn().mockResolvedValue({
      id: 2,
      userId: 2,
      name: 'Updated Profile',
      email: 'updated@example.com',
      skills: ['Leadership'],
      experienceYears: 4,
      certifications: ['PMP'],
      createdAt,
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        { provide: ProfilesService, useValue: profilesService },
        KeycloakAuthGuard,
      ],
    })
      .overrideGuard(KeycloakAuthGuard)
      .useClass(AllowManagerGuard)
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

  it('lists profiles', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/profiles')
      .set('Authorization', 'Bearer test');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it('gets a profile', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/profiles/1')
      .set('Authorization', 'Bearer test');

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe('maria@example.com');
  });

  it('returns 404 when profile does not exist', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/profiles/99')
      .set('Authorization', 'Bearer test');

    expect(response.status).toBe(404);
  });

  it('creates a profile', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/profiles')
      .set('Authorization', 'Bearer test')
      .send({
        userId: 2,
        name: 'New Profile',
        email: 'new@example.com',
        skills: ['Leadership'],
        experienceYears: 3,
      });

    expect(response.status).toBe(201);
    expect(response.body.data.userId).toBe(2);
  });

  it('rejects invalid payloads', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/profiles')
      .set('Authorization', 'Bearer test')
      .send({
        userId: 'not-number',
        name: 'Invalid',
        email: 'invalid',
        skills: [],
        experienceYears: -1,
      });

    expect(response.status).toBe(400);
  });

  it('updates a profile', async () => {
    const response = await request(app.getHttpServer())
      .patch('/api/profiles/2')
      .set('Authorization', 'Bearer test')
      .send({
        name: 'Updated Profile',
        experienceYears: 4,
        certifications: ['PMP'],
      });

    expect(response.status).toBe(200);
    expect(response.body.data.certifications).toContain('PMP');
  });

  it('deletes a profile', async () => {
    const response = await request(app.getHttpServer())
      .delete('/api/profiles/2')
      .set('Authorization', 'Bearer test');

    expect(response.status).toBe(200);
    expect(response.body.data.deleted).toBe(true);
  });
});
