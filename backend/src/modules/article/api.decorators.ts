import {
  applyDecorators,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse as ApiResponseBase } from '@nestjs/swagger';

import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { InvalidateCached } from 'src/libs/cache/decorators/cache-invalidate.interceptor';
import { CacheIt } from 'src/libs/cache/decorators/cache.interceptor';
import { CommonError } from 'src/libs/common/common.error';
import { FindManyResponseBase } from 'src/libs/dto/find-many-base.response';
import { ApiResponse } from 'src/libs/open-api/decorators/api-response.decorator';
import { Authorized } from '../auth/decorator/authorized.decorator';
import { ArticleError } from './article.common';
import { CreateOneArticleDto } from './models/dto/create-one-article.dto';
import { CreateOneArticleResponse } from './models/dto/create-one-article.response';
import { FindManyArticleItemResponse } from './models/dto/find-many-article-item.response';
import { FindOneArticleResponse } from './models/dto/find-one-article.response';
import { UpdateOneArticleDto } from './models/dto/update-one-article.dto';

export const ApiPostCreateOneArticle = () =>
  applyDecorators(
    ApiResponseBase({
      status: HttpStatus.OK,
      description: 'Will return new article',
      type: CreateOneArticleResponse,
    }),
    ApiResponse(HttpStatus.BAD_REQUEST, ArticleError.INVALID_PAYLOAD),
    Authorized(),
    ApiBody({ type: CreateOneArticleDto, required: true }),
    Post('/'),
  );

export const ApiGetOneArticle = () =>
  applyDecorators(
    ApiResponseBase({
      status: HttpStatus.OK,
      description: 'Will return article',
      type: FindOneArticleResponse,
    }),
    ApiResponse(
      HttpStatus.UNPROCESSABLE_ENTITY,
      CommonError.SET_AT_LEAST_ONE_KNOWN_FIELD,
    ),
    ApiResponse(HttpStatus.NOT_FOUND, ArticleError.NOT_FOUND),
    CacheIt('article', 'query'),
    Get('/'),
  );

export const ApiGetManyArticle = () =>
  applyDecorators(
    ApiResponseBase({
      status: HttpStatus.OK,
      description: 'Will return many articles',
      type: FindManyResponseBase.apiSchema(
        FindManyArticleItemResponse,
        'Article',
      ),
    }),
    ApiConsumes('multipart/form-data', 'application/json'),
    Get('/many'),
  );

export const ApiPatchArticle = () =>
  applyDecorators(
    ApiResponseBase({
      status: HttpStatus.OK,
      description: 'Will return article update status',
      type: Boolean,
    }),
    ApiResponse(HttpStatus.NOT_FOUND, ArticleError.NOT_FOUND),
    ApiConsumes('application/json'),
    ApiBody({ type: UpdateOneArticleDto, required: true }),
    InvalidateCached('article', 'params'),
    Authorized(),
    Patch('/:id'),
  );

export const ApiDeleteOneArticle = () =>
  applyDecorators(
    ApiResponseBase({
      status: HttpStatus.OK,
      description: 'Will return article delete status',
      type: Boolean,
    }),
    ApiResponse(HttpStatus.NOT_FOUND, ArticleError.NOT_FOUND),
    ApiConsumes('application/json'),
    InvalidateCached('article', 'params'),
    Authorized(),
    Delete('/:id'),
  );
