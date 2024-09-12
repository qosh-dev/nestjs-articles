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
  if(!model) return model
  const record = new FindOneArticleResponse();
  record.id = model.id;
  record.title = model.title;
  record.description = model.description;
  record.createdAt = model.createdAt;
  record.authorId = model.authorId;
  return record;
  }
}
