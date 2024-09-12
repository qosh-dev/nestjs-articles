import { Injectable } from '@nestjs/common';
import { RepositoryBase } from 'src/database/structs/repository';
import { EntityManager } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository extends RepositoryBase<UserEntity> {
  constructor(readonly orm: EntityManager) {
    super(orm, UserEntity);
  }
}
