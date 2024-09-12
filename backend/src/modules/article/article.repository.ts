import { Injectable } from '@nestjs/common';
import { RepositoryBase } from 'src/database/structs/repository';
import { EntityManager } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Injectable()
export class ArticleRepository extends RepositoryBase<ArticleEntity> {
  constructor(readonly orm: EntityManager) {
    super(orm, ArticleEntity);
  }
}
