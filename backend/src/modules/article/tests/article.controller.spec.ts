import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';
import { TestService } from '../../../helpers/test.service';
import { AuthService } from '../../auth/auth.service';
import { UserEntity } from '../../user/user.entity';
import { UserService } from '../../user/user.service';
import { ArticleEntity } from '../article.entity';
import { ArticleService } from '../article.service';
import { CreateOneArticleDto } from '../dto/create-one-article.dto';
import { FindManyArticleDto } from '../dto/find-many-article.dto';
import { FindOneArticleDto } from '../dto/find-one-article.dto';
import { UpdateOneArticleDto } from '../dto/update-one-article.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let articleService: ArticleService;
  let userService: UserService;
  let createdArticle: ArticleEntity;
  let createdArticle2: ArticleEntity;
  let createdUser: UserEntity;
  let createdUserToken: string;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    articleService = app.get(ArticleService);
    authService = app.get(AuthService);
    userService = app.get(UserService);
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    const testService = app.get(TestService);
    await testService.afterAll();
    await app.close();
  });

  it('shoud prepare user', async () => {
    const newUser = { username: 'new-user', password: 'valid-password' };
    const user = await userService.create(newUser);
    createdUser = user;
    expect(user).toBeInstanceOf(UserEntity);
    const res = await authService.signIn(newUser);
    createdUserToken = res.token;
  });

  describe('POST /article/', () => {
    it('should create a new article (authorized)', async () => {
      const dto: CreateOneArticleDto = {
        title: 'Test Article',
        description: 'This is a test content',
      };

      const res = await request(app.getHttpServer())
        .post('/article')
        .send(dto)
        .set('Authorization', 'Bearer ' + createdUserToken)
        .expect(HttpStatus.CREATED);

      expect(res.body.title).toBe(dto.title);
      expect(res.body.description).toBe(dto.description);

      createdArticle = res.body;
    });

    it('should create a new article 2 (authorized)', async () => {
      const dto: CreateOneArticleDto = {
        title: 'Test Article 2',
        description: 'This is a test content',
      };

      const res = await request(app.getHttpServer())
        .post('/article')
        .send(dto)
        .set('Authorization', 'Bearer ' + createdUserToken)
        .expect(HttpStatus.CREATED);

      expect(res.body.title).toBe(dto.title);
      expect(res.body.description).toBe(dto.description);

      createdArticle2 = res.body;
    });

    it('should not create a new article (empty authorized)', async () => {
      const dto: CreateOneArticleDto = {
        title: 'Test Article',
        description: 'This is a test content',
      };

      const res = await request(app.getHttpServer())
        .post('/article')
        .send(dto)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 400 for invalid title (empty)', async () => {
      const invalidDto: Partial<CreateOneArticleDto> = {
        description: 'This is a test content',
      };

      await request(app.getHttpServer())
        .post('/article')
        .send(invalidDto)
        .set('Authorization', 'Bearer ' + createdUserToken)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for missing description', async () => {
      const invalidDto: Partial<CreateOneArticleDto> = {
        title: 'Test Article',
      };

      await request(app.getHttpServer())
        .post('/article')
        .send(invalidDto)
        .set('Authorization', 'Bearer ' + createdUserToken)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('findOneArticle (GET /)', () => {
    it('should retrieve an article by id', async () => {
      const query: FindOneArticleDto = { id: createdArticle.id };

      const res = await request(app.getHttpServer())
        .get('/article')
        .query(query)
        .expect(HttpStatus.OK);
      expect(res.body).toEqual(createdArticle);
    });

    it('should return 404 for non-existent article', async () => {
      const query: FindOneArticleDto = { id: randomUUID() };

      await request(app.getHttpServer())
        .get('/article')
        .query(query)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 400 for invalid article id(uuid)', async () => {
      const query: FindOneArticleDto = { id: '123' };

      await request(app.getHttpServer())
        .get('/article')
        .query(query)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('findManyArticles (GET /many)', () => {
    it('should retrieve multiple articles with default pagination', async () => {
      const query: FindManyArticleDto = {};
      const array = [createdArticle, createdArticle2];

      const res = await request(app.getHttpServer())
        .get('/article/many')
        .query(query)
        .expect(HttpStatus.OK);
      expect(res.body).toEqual(array);
    });

    it('should retrieve articles with pagination(2 records) (limit=5, page=1)', async () => {
      const query: FindManyArticleDto = { limit: 5, page: 1 };
      const mockArticles = [createdArticle, createdArticle2];

      const res = await request(app.getHttpServer())
        .get('/article/many')
        .query(query)
        .expect(HttpStatus.OK);
      expect(res.body).toEqual(mockArticles);
    });

    it('should retrieve articles with pagination(0 records) (limit=5, page=2)', async () => {
      const query: FindManyArticleDto = { limit: 5, page: 2 };
      const array = [];

      const res = await request(app.getHttpServer())
        .get('/article/many')
        .query(query)
        .expect(HttpStatus.OK);
      expect(res.body).toEqual(array);
    });

    it('should return error 400 (limit=5, page=0)', async () => {
      const query: FindManyArticleDto = { limit: 5, page: 0 };
      await request(app.getHttpServer())
        .get('/article/many')
        .query(query)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should retrieve articles by title (partial match)', async () => {
      const query: FindManyArticleDto = { title: createdArticle.title };

      const res = await request(app.getHttpServer())
        .get('/article/many')
        .query(query)
        .expect(HttpStatus.OK);
      expect(res.body).toEqual([createdArticle]);
    });

    it('should retrieve articles by author ID', async () => {
      const query: FindManyArticleDto = {
        ids: [createdArticle.id, createdArticle2.id],
      };

      const res = await request(app.getHttpServer())
        .get('/article/many')
        .query(query)
        .expect(HttpStatus.OK);
      expect(res.body).toEqual([createdArticle, createdArticle2]);
    });
  });

  describe('patchArticle (PATCH /:id)', () => {
    it('should update an article (authorized)', async () => {
      const id = createdArticle.id;
      const dto: UpdateOneArticleDto = { title: 'Updated Title' };

      

      const res = await request(app.getHttpServer())
        .patch(`/article/${id}`)
        .send(dto)
        .set('Authorization', 'Bearer ' + createdUserToken)
        .expect(HttpStatus.OK);
      expect(!!res.body).toEqual(true);
    });
  });
});
