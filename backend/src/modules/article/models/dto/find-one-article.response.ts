import { ApiProperty } from '@nestjs/swagger';
import { ArticleEntity } from '../../article.entity';

export class FindOneArticleResponse{
  @ApiProperty({
    example: 'b0beabbd-a32b-407d-a9ee-0f6cd2d1a4ab',
    description: 'Article id',
    required: true,
  })
  id: string;

  @ApiProperty({
    description: 'Article title',
    required: true,
  })
  title: string;

  @ApiProperty({
    description: 'Article description',
    required: true,
  })
  description: string;

  @ApiProperty({
    description: 'Article createdAt',
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    example: 'b0beabbd-a32b-407d-a9ee-0f6cd2d1a4ab',
    description: 'Article authorId',
    required: true,
  })
  authorId: string;

static  serialize(model: ArticleEntity): FindOneArticleResponse {
  if(!model) return null
    return {
      id: model.id,
      title: model.title,
      description: model.description,
      createdAt: model.createdAt,
      authorId: model.authorId,
    };
  }
}
