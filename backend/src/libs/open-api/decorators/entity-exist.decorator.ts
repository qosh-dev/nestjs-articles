import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';

export function EntityExistPipe(entity: any) {
  @Injectable()
  class EntityExist<T> implements PipeTransform<any, Promise<T | never>> {
    constructor(readonly orm: EntityManager) {}

    async transform(
      value: any,
      { type }: ArgumentMetadata,
    ): Promise<T | never> {
      try {
        const id = type === 'param' ? value : value.id;

        if (!id) {
          throw new BadRequestException('Missing required entity ID');
        }

        const record = await this.orm.existsBy(entity, { id });

        if (!record) {
          throw new BadRequestException(`Entity with ID ${id} does not exist`);
        }

        return value as T;
      } catch {
        throw new UnprocessableEntityException();
      }
    }
  }
  return EntityExist;
}
