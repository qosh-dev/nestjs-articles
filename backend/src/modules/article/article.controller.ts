import { Body, Controller, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IdDto } from 'src/libs/dto/id.dto';
import { IsHasAnyFieldsPipe } from 'src/libs/validation/pipes/is-has-any-fields.pipe';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { CurrentUserModel } from '../auth/models/current-user.model';
import {
  ApiDeleteOneArticle,
  ApiGetManyArticle,
  ApiGetOneArticle,
  ApiPatchArticle,
  ApiPostCreateOneArticle,
} from './api.decorators';
import { ArticleService } from './article.service';
import { CreateOneArticleDto } from './models/dto/create-one-article.dto';
import { CreateOneArticleResponse } from './models/dto/create-one-article.response';
import { FindManyArticleDto } from './models/dto/find-many-article.dto';
import { FindOneArticleDto } from './models/dto/find-one-article.dto';
import { UpdateOneArticleDto } from './models/dto/update-one-article.dto';

@ApiTags('Articles')
@Controller('/article')
export class ArticleController {
  constructor(private service: ArticleService) {}

  @ApiPostCreateOneArticle()
  createArticle(
    @Body() body: CreateOneArticleDto,
    @CurrentUser() currentUser: CurrentUserModel,
  ): Promise<CreateOneArticleResponse> {
    return this.service.create({ ...body, authorId: currentUser.id });
  }

  @ApiGetOneArticle()
  async findOneArticle(@Query(IsHasAnyFieldsPipe) query: FindOneArticleDto) {
    return this.service.findOneBy(query);
  }

  @ApiGetManyArticle()
  async findManyArticles(@Query() query: FindManyArticleDto) {
    return this.service.findManyBy(query);
  }

  @ApiPatchArticle()
  async updateOneArticle(
    @Param() idDto: IdDto,
    @Body(IsHasAnyFieldsPipe) body: UpdateOneArticleDto,
    @CurrentUser() currentUser: CurrentUserModel,
  ) {
    return this.service.updateOne({
      ...body,
      id: idDto.id,
      authorId: currentUser.id,
    });
  }

  @ApiDeleteOneArticle()
  async deleteOneArticle(
    @Param() idDto: IdDto,
    @CurrentUser() currentUser: CurrentUserModel,
  ) {
    return this.service.deleteOne(idDto.id, currentUser.id);
    
  }
}
