import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseException } from '../../database/exception.decorator';
import { ArticleError } from './article.common';
import { ArticleRepository } from './article.repository';
import { CreateOneArticleResponse } from './models/dto/create-one-article.response';
import { FindManyArticleItemResponse } from './models/dto/find-many-article-item.response';
import { FindOneArticleDto } from './models/dto/find-one-article.dto';
import { FindOneArticleResponse } from './models/dto/find-one-article.response';
import { ICreateOneArticle } from './models/interface/create-one-article.interface';
import { IFindManyArticle } from './models/interface/find-many-article.interface';
import { IUpdateOneArticle } from './models/interface/update-one-article.interface';

@Injectable()
export class ArticleService {
  constructor(private readonly repo: ArticleRepository) {}

  async create(payload: ICreateOneArticle): Promise<CreateOneArticleResponse> {
    let record = await this.repo.createOne({
      title: payload.title,
      description: payload.description,
      authorId: payload.authorId,
    });
    return CreateOneArticleResponse.serialize(record);
  }

  async findOneBy(payload: FindOneArticleDto) {
    if (!Object.keys(payload).length) {
      return null;
    }
    const record = await this.repo.findOneBy(payload);
    return FindOneArticleResponse.serialize(record);
  }

  @DatabaseException()
  async findManyBy(payload: IFindManyArticle) {
    const result = await this.repo.findManyBy(payload);
    return {
      ...result,
      data: FindManyArticleItemResponse.serialize(result.data),
    };
  }

  async updateOne(payload: IUpdateOneArticle) {
    const { id, authorId, ...updateProps } = payload;

    if (!Object.keys(updateProps).length) {
      return false;
    }
    const recordExist = await this.repo.existBy({
      id,
      authorId,
    });

    if (!recordExist) {
      throw new HttpException(ArticleError.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const status = await this.repo.update(id, updateProps);
    return status;
  }

  async deleteOne(articleId: string, authorId: string) {
    try {
      const recordExist = await this.repo.existBy({
        id: articleId,
        authorId,
      });

      if (!recordExist) {
        throw new HttpException(ArticleError.NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      await this.repo.deleteBy({ id: articleId, authorId });
      return true;
    } catch (e) {
      return false;
    }
  }
}
