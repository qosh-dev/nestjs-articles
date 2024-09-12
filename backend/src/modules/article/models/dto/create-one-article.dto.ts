import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ICreateOneArticle } from '../interface/create-one-article.interface';

export class CreateOneArticleDto implements Omit<ICreateOneArticle,'authorId'>{
  @ApiProperty({
    description: 'Article title',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Article description',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
