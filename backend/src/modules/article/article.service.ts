import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArticleError } from './article.common';
import { ArticleEntity } from './article.entity';
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
    const record = await this.repo.findOneBy(payload);
    return FindOneArticleResponse.serialize(record);
  }

  async findManyBy(payload: IFindManyArticle) {
    const { page, limit, sort, ids = [], ...filter } = payload;
    const skip = (page - 1) * limit;
    const qb = this.repo.orm.createQueryBuilder(ArticleEntity, 'article');

    if (ids && ids.length) {
      qb.andWhereInIds(Array.isArray(ids) ? ids : [ids]);
    } else {
      for (let key in filter) {
        if (!filter[key]) continue;
        if (key === 'createdAtGte') {
          qb.andWhere('article.createdAt >= :createdAtGte', {
            createdAtGte: new Date(+filter[key]),
          });
        } else if (key === 'createdAtLte') {
          qb.andWhere('article.createdAt <= :createdAtLte', {
            createdAtLte: new Date(+filter[key]),
          });
        } else if (key === 'authorUserName') {
          qb.innerJoin('article.author', 'author');
          qb.andWhere('LOWER(author.username) LIKE :authorUserName', {
            authorUserName: `%${filter[key].toLocaleLowerCase()}%`,
          });
        } else {
          qb.andWhere(`article.${key} = :${key}`, { [key]: filter[key] });
        }
      }

      if (sort && sort.length) {
        for (const s of sort) {
          qb.addOrderBy(`article.${s.column}`, s.order);
        }
      }
    }

    qb.take(limit);
    qb.skip(skip);
    const [records, totalCount] = await qb.getManyAndCount();

    return this.repo.toManyResponse({
      page: payload.page,
      take: payload.limit,
      result: FindManyArticleItemResponse.serialize(records),
      totalCount: totalCount,
    });
  }

  async updateOne(payload: IUpdateOneArticle) {
    const { id, authorId, ...updateProps } = payload;
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
