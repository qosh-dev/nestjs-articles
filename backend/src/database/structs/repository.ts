import { Logger } from '@nestjs/common';
import * as lodash from 'lodash';
import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindOptionsWhere,
  In,
} from 'typeorm';
import { DatabaseException } from '../exception.decorator';
import { BaseEntity } from './entity';
import { IFindManyResponseBase } from './types';

export class RepositoryBase<Eb extends BaseEntity> {
  logger = new Logger(RepositoryBase.name);

  constructor(
    readonly orm: EntityManager,
    private readonly entityClass: EntityTarget<Eb>,
  ) {}

  @DatabaseException()
  async createOne<P extends Eb>(
    payload: Partial<Omit<P, 'id'>>,
    t: EntityManager = this.orm,
  ): Promise<Eb> {
    let record = t.create(this.entityClass, payload as DeepPartial<P>);
    record = await t.save(record);
    return record;
  }

  @DatabaseException()
  async findOneBy<E extends Eb>(
    where: FindOptionsWhere<E> | FindOptionsWhere<E>[],
  ): Promise<Eb> {
    const record = await this.orm.findOneBy(this.entityClass, where as any);
    return record;
  }

  @DatabaseException()
  async countBy<E extends Eb>(
    where: FindOptionsWhere<E> | FindOptionsWhere<E>[],
  ) {
    return this.orm.count(this.entityClass, { where });
  }

  @DatabaseException()
  async existAll(ids: Eb['id'][]): Promise<boolean> {
    const count = await this.orm.count(this.entityClass, {
      where: { id: In(ids) } as any,
    });
    return count === ids.length;
  }

  @DatabaseException()
  async existBy(
    where: FindOptionsWhere<Eb> | FindOptionsWhere<Eb>[],
  ): Promise<boolean> {
    const count = await this.orm.count(this.entityClass, {
      where: where,
    });
    return count === 1;
  }

  @DatabaseException()
  async update(id: Eb['id'], props: Partial<Eb>, t: EntityManager = this.orm) {
    const res = await t.update(this.entityClass, { id }, props as any);
    return res.affected === 1;
  }

  @DatabaseException()
  async updateMany(
    ids: Eb['id'][],
    props: Partial<Eb>,
    t: EntityManager = this.orm,
  ) {
    const res = await t.update(this.entityClass, { id: In(ids) }, props as any);
    return res.affected !== ids.length;
  }

  async deleteBy(criteria: Partial<Eb>, t: EntityManager = this.orm) {
    try {
      const res = await t.delete(this.entityClass, criteria);
      return res.affected !== 0;
    } catch (e) {
      return false;
    }
  }

  // ------------------------------------------------------------------------------

  toManyResponse<T>(payload: {
    result: T[];
    take: number;
    totalCount: number;
    page: number;
  }): IFindManyResponseBase<T> {
    const pageCount = Math.round(payload.totalCount / payload.take);
    return {
      data: payload.result,
      count: payload.take ?? 0,
      total: payload.totalCount,
      page: payload.page ?? 0,
      pageCount: lodash.isNaN(pageCount) ? 0 : pageCount,
    };
  }
}
