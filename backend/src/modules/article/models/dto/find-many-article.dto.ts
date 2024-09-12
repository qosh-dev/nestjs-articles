import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { FindManyBaseDto } from '../../../../libs/dto/find-many-base/find-many-base.dto';
import { SortEnum } from '../enum/sort.enum';
import { IFindManyArticle } from '../interface/find-many-article.interface';

@Exclude()
export class FindManyArticleDto
  extends FindManyBaseDto(SortEnum)
  implements IFindManyArticle
{
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

  @ApiProperty({
    description: 'Article createdAtGte',
    type: Number,
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsNumberString()
  createdAtGte?: number;

  @ApiProperty({
    description: 'Article createdAtLte',
    type: Number,
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsNumberString()
  createdAtLte?: number;

  @ApiProperty({
    description: 'Article name',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  authorUserName?: string;
}
