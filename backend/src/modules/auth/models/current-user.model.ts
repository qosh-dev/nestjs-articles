import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { randomUUID } from 'crypto';
import { UserEntity } from 'src/modules/user/user.entity';

export class CurrentUserModel {
  @ApiProperty({
    description: 'Identifier',
    example: randomUUID(),
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Username',
    example: 'Mesmer',
  })
  @Expose()
  username: string;

  static serialize(model: UserEntity): CurrentUserModel {
    return {
      id: model.id,
      username: model.username,
    };
  }
}
