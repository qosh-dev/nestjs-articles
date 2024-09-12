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
import { IFindManyBase, IFindManyResponseBase } from './types';

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
  async findManyBy<
    P extends IFindManyBase<any> &
      (FindOptionsWhere<Eb> | FindOptionsWhere<Eb>),
  >(payload: P): Promise<IFindManyResponseBase<Eb>> {
    if (payload.limit === 0) {
      return this.toManyResponse({
        page: payload.page,
        take: payload.limit,
        result: [],
        totalCount: 0,
      });
    }
    let { page = 1, limit = 10, sort, ids, ...fields } = payload;
    const skip = (page - 1) * limit;
    const alias = (this.entityClass as any).name.toLocaleLowerCase();
    const queryBuilder = this.orm.createQueryBuilder(this.entityClass, alias);
    if (ids && ids.length) {
      queryBuilder.andWhereInIds(ids);
    } else {
      for (let _field in fields) {
        const res = this._baseConditions(_field, fields);
        if (!res) continue;
        let { operand, prop, field, value } = res;
        queryBuilder.andWhere(`${field} ${operand} :${prop}`, {
          [prop]: value,
        });
      }
    }

    if (sort && sort.length) {
      for (let s of sort) {
        queryBuilder.addOrderBy(`"${s.column}"`, s.order);
      }
    }
    const [records, totalCount] = (await queryBuilder
      .take(limit)
      .skip(skip)
      .getManyAndCount()) as any;

    return this.toManyResponse({
      page: payload.page,
      take: payload.limit,
      result: records,
      totalCount: totalCount,
    });
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

  async delete(id: Eb['id'], t: EntityManager = this.orm) {
    try {
      const res = await t.delete(this.entityClass, { id });
      return res.affected !== 0;
    } catch (e) {
      return false;
    }
  }

  async deleteMany(ids: Eb['id'][], t: EntityManager = this.orm) {
    try {
      const res = await t.delete(this.entityClass, { id: In(ids) });
      return res.affected !== 0;
    } catch (e) {
      return false;
    }
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

  _baseConditions<P extends IFindManyBase<any>>(
    field: string,
    fields: Omit<P, 'page' | 'limit' | 'sort' | 'ids'>,
  ) {
    if (field.endsWith('In')) return;
    let value = fields[field];
    if (!value) return;
    let operand = '=';
    let prop = field;
    if (field.endsWith('Gte') || field.endsWith('Lte')) {
      operand = field.endsWith('Gte') ? '>=' : '<=';
      const tempField = field.substring(0, field.length - 3);
      prop = tempField;
      field = `"${tempField}"`;
    } else if (field.endsWith('Eq')) {
      const tempField = field.substring(0, field.length - 2);
      prop = tempField;
      field = `"${tempField}"`;
    } else if (field.endsWith('NotEq')) {
      const tempField = field.substring(0, field.length - 5);
      prop = tempField;
      field = `"${tempField}"`;
      operand = '!=';
    } else if (field.endsWith('NotContains')) {
      const tempField = field.substring(0, field.length - 11);
      prop = tempField;
      field = `NOT LOWER("${tempField}")`;
      operand = 'LIKE';
      value = `%${value.toLocaleLowerCase()}%`;
    } else if (field.endsWith('Contains')) {
      const tempField = field.substring(0, field.length - 8);
      prop = tempField;
      field = `LOWER("${tempField}")`;
      operand = 'LIKE';
      value = `%${value.toLocaleLowerCase()}%`;
    } else {
      field = `"${field}"`;
    }
    return { operand, prop, field, value };
  }

  joinStrIds(ids: string[]) {
    return ids.map((v) => `'${v}'`).join(',');
  }

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

