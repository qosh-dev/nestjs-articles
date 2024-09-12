import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { RepositoryBase } from '../../database/structs/repository';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository extends RepositoryBase<UserEntity> {
  constructor(readonly orm: EntityManager) {
    super(orm, UserEntity);
  }
}
