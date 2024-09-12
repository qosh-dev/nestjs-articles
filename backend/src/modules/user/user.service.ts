import { Injectable } from '@nestjs/common';
import { EntityManager, FindOptionsWhere } from 'typeorm';
import { ISignUp } from '../auth/models/interface/sign-up.interface';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(readonly repo: UserRepository) {}

  createOne(props: ISignUp, t?: EntityManager) {
    return this.repo.createOne(props, t);
  }

  async findOne(
    payload: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>,
  ): Promise<UserEntity | null> {
    const filters = Object.values(payload).filter((f) => f);
    if (!filters.length) {
      return null;
    }
    return this.repo.findOneBy(payload as any);
  }
}
