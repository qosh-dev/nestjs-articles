import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { DatabaseException } from '../../database/exception.decorator';
import { RepositoryBase } from '../../database/structs/repository';
import { ArticleEntity } from './article.entity';
import { IFindManyArticle } from './models/interface/find-many-article.interface';

@Injectable()
export class ArticleRepository extends RepositoryBase<ArticleEntity> {
  constructor(readonly orm: EntityManager) {
    super(orm, ArticleEntity);
  }

  @DatabaseException()
  async findManyBy(payload: IFindManyArticle) {
    const { page = 1, limit = 10, sort, ids = [], ...filter } = payload;
    const skip = (page - 1) * limit;
    const qb = this.orm.createQueryBuilder(ArticleEntity, 'article');

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

    return this.toManyResponse({
      page: payload.page,
      take: payload.limit,
      result: records,
      totalCount: totalCount,
    });
  }
}
