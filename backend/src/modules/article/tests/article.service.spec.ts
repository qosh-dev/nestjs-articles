import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { AppModule } from '../../../app.module';
import { TestService } from '../../../helpers/test.service';
import { UserEntity } from '../../user/user.entity';
import { UserService } from '../../user/user.service';
import { ArticleEntity } from '../article.entity';
import { ArticleService } from '../article.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let articleService: ArticleService;
  let userService: UserService;
  let createdArticle: ArticleEntity;
  let createdUser: UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    articleService = app.get(ArticleService);
    userService = app.get(UserService);
    await app.init();
  });

  afterAll(async () => {
    const testService = app.get(TestService);
    await testService.afterAll();
    await app.close();
  });

  it('should create a new user', async () => {
    const newUser = { username: 'new-user', password: 'valid-password' };
    const user = await userService.create(newUser);
    expect(user).toBeInstanceOf(UserEntity);
    createdUser = user;
  });

  describe('Create', () => {
    it('should create a new article', async () => {
      const payload = {
        title: 'Test Article',
        description: 'This is a test content',
        authorId: createdUser.id,
      };
      createdArticle = await articleService.create(payload);
      expect(createdArticle).toBeInstanceOf(ArticleEntity);
    });

    it('should return null for creation error', async () => {
      const payload = {
        title: 'Test Article',
        description: 'This is a test content',
        authorId: randomUUID(),
      };

      const createdArticle = await articleService.create(payload);
      expect(createdArticle).toBeNull();
    });
  });

  describe('FindOneBy', () => {
    it('should find an article by title', async () => {
      const article = await articleService.findOneBy({
        title: createdArticle.title,
      });
      expect(article.title).toEqual(createdArticle.title);
    });

    it('should return null for no matching article', async () => {
      const article = await articleService.findOneBy({});
      expect(article).toBeNull();
    });

    it('should return null for empty payload', async () => {
      const article = await articleService.findOneBy({});
      expect(article).toBeNull();
    });
  });

  describe('FindManyBy', () => {
    it('should retrieve multiple articles with default pagination', async () => {
      const articles = await articleService.findManyBy({});
      expect(articles).toEqual([createdArticle]);
    });

    it('should retrieve empty array of articles', async () => {
      const articles = await articleService.findManyBy({ ids: [randomUUID()] });
      expect(articles).toEqual([]);
    });

    it('should retrieve created articles by title', async () => {
      const articles = await articleService.findManyBy({
        title: createdArticle.title,
      });
      expect(articles).toEqual([createdArticle]);
    });
  });

  describe('UpdateOne', () => {
    it('should update an article and invalidate cache', async () => {
      const id = createdArticle.id;
      const authorId = createdUser.id;
      const updateProps = { description: 'Updated description' };

      const status = await articleService.updateOne({
        id,
        authorId,
        ...updateProps,
      });
      expect(status).toBe(true);
    });

    it('should return false for empty update payload', async () => {
      const id = createdArticle.id;
      const authorId = createdUser.id;

      const status = await articleService.updateOne({ id, authorId });
      expect(status).toBe(false);
    });
  });

  describe('DeleteOne', () => {
    it('should delete an article and invalidate cache', async () => {
      const id = createdArticle.id;
      const authorId = createdUser.id;

      const status = await articleService.deleteOne(id, authorId);
      expect(status).toBe(true);
    });
  });
});
