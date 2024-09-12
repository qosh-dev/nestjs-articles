import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { IUpdateOneArticle } from '../interface/update-one-article.interface';

@Exclude()
export class UpdateOneArticleDto implements Omit<IUpdateOneArticle, 'id' | "authorId"> {
  @ApiProperty({
    description: 'Article title',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Article description',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  description?: string;

}
