import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleRepository } from './article.repository';
import { ArticleService } from './article.service';

@Module({
  imports: [],
  providers: [ArticleService,ArticleRepository],
  controllers: [ArticleController],
})
export class ArticleModule {}
