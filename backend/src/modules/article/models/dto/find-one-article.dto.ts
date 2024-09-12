import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { FindOneBaseDto } from 'src/libs/dto/find-one-base.dto';

@Exclude()
export class FindOneArticleDto extends FindOneBaseDto {
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
    example: 'b0beabbd-a32b-407d-a9ee-0f6cd2d1a4ab',
    description: 'Article authorId',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  authorId?: string;
}
