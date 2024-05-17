import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import * as fs from 'fs';
import * as path from 'path';

describe('User (e2e)', () => {
  let app: INestApplication;
  let testService: TestService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();


    app = moduleFixture.createNestApplication();
    await app.init();

    testService = app.get(TestService);
  });

  describe('POST /api/users', () => {
    const endpoint = '/api/users';
    const user = {
      full_name: 'skuy ngoding',
      email: 'skuyngoding@example.com',
      username: 'skuy123',
      password: 'password',
    }
    afterAll(async () => {
      await testService.truncateUsers();
    })
    it('should return validation error if body is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post(`${endpoint}`)
        .send({
          full_name: '',
          email: 'email',
          username: '',
          password: '',
        })

      const validationMessageExpectation = expect.arrayContaining([expect.any(String)]);
      expect(response.body.message).toBe('Validation Error');
      expect(response.body.errors).toEqual({
        full_name: validationMessageExpectation,
        email: validationMessageExpectation,
        username: validationMessageExpectation,
        password: validationMessageExpectation
      })
    })
    it('should create new user', async () => {
      const email = 'skuyngoding@example.com';
      const response = await request(app.getHttpServer())
        .post(`${endpoint}`)
        .send(user)

      const getUser = await testService.getUser({ field: 'email', value: email });
      expect(response.statusCode).toBe(201);
      expect(getUser).toEqual({
        id: expect.any(String),
        full_name: 'skuy ngoding',
        email,
        username: 'skuy123',
        password: expect.any(String),
        avatar_path: null,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        deleted_at: null
      })
    })
    it('should return error if email already exists', async () => {
      const response = await request(app.getHttpServer())
        .post(`${endpoint}`)
        .send(user)

      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toBe('User already exist');
    })

    it('should return error if avatarPath is invalid extension', async () => {
      await testService.deleteUser({
        field: 'email',
        value: 'skuyngoding@example.com'
      });

      const imagePath = path.join(__dirname, './resources/images/sample-image-invalid-extension.svg');
      const imageBuffer = fs.readFileSync(imagePath);
      const response = await request(app.getHttpServer())
        .post(`${endpoint}`)
        .field( 'full_name', user.full_name)
        .field( 'email', user.email)
        .field( 'username', user.username)
        .field( 'password', user.password)
        .attach('avatar_path', imageBuffer, 'sample-image-invalid-extension.svg')

      expect(response.statusCode).toBe(422);
      expect(response.body.errors.error).toBe('Unprocessable Entity');
      expect(response.body.errors.message).toBe('Validation failed (expected type is jpeg|jpg|png)');
    })

    it('should return error if avatarPath is invalid mimetype', async () => {
      const imagePath = path.join(__dirname, './resources/images/sample-image-invalid-mimetype.png');
      const imageBuffer = fs.readFileSync(imagePath);
      const response = await request(app.getHttpServer())
        .post(`${endpoint}`)
        .field( 'full_name', user.full_name)
        .field( 'email', user.email)
        .field( 'username', user.username)
        .field( 'password', user.password)
        .attach('avatar_path', imageBuffer, 'sample-image-invalid-mimetype.png')

      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBe('Invalid file type. Only image files are allowed.');
    })

    it('should return error if avatarPath is invalid size', async () => {
      const imagePath = path.join(__dirname, './resources/images/sample-image-invalid-max-size.png');
      const imageBuffer = fs.readFileSync(imagePath);
      const response = await request(app.getHttpServer())
        .post(`${endpoint}`)
        .field( 'full_name', user.full_name)
        .field( 'email', user.email)
        .field( 'username', user.username)
        .field( 'password', user.password)
        .attach('avatar_path', imageBuffer, 'sample-image-invalid-max-size.png')

      expect(response.statusCode).toBe(422);
      expect(response.body.errors.error).toBe('Unprocessable Entity');
      expect(response.body.errors.message).toBe('File size is too large. Max size is 2MB');
    })

    it('should success create user with valid avatar', async () => {
      const imagePath = path.join(__dirname, './resources/images/sample-image-valid.png');
      const imageBuffer = fs.readFileSync(imagePath);
      const response = await request(app.getHttpServer())
        .post(`${endpoint}`)
        .field( 'full_name', user.full_name)
        .field( 'email', user.email)
        .field( 'username', user.username)
        .field( 'password', user.password)
        .attach('avatar_path', imageBuffer, 'sample-image-valid.png')

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.data.avatar_path).not.toBe(null);
    })
  })
});

