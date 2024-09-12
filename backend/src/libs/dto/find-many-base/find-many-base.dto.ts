import { UnprocessableEntityException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { IFindManyBase, IFindManyBaseSortItem, SortOrderEnum } from '../../../database/structs/types';
import { CommonError } from '../../../libs/common/common.error';
import { IdsDtoOptional } from '../../../libs/dto/ids.dto';
import { isEqualStringArray } from '../../common/methods';
import { FindManyBaseSortItem } from './find-many-base-sort-item';

/**
 * Creates a base DTO (Data Transfer Object) for "find many" queries,
 * including pagination and sorting options.
 *
 * @template SEnum
 * @param {SEnum} SortEnum - Enum of sortable columns.
 * @returns {Class} - A class for handling "find many" queries.
 */
export function FindManyBaseDto<SEnum extends Record<string, string>>(
  SortEnum: SEnum,
) {
  const SortModel = FindManyBaseSortItem(SortEnum);

  /**
   * Class representing a DTO for "find many" queries with pagination and sorting.
   *
   * @class
   */
  class Class extends IdsDtoOptional implements IFindManyBase<SEnum> {
    @ApiProperty({
      description: 'Records page',
      required: false,
    })
    @Expose()
    @Transform((t) => {
      const v = Number(t.value);
      return !isNaN(v) ? v : 1;
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiProperty({
      description: 'Records limit per page',
      required: false,
    })
    @Expose()
    @Transform((t) => {
      const v = Number(t.value);
      return !isNaN(v) ? v : 10;
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @ApiProperty({
      description: getSortDescription(),
      required: false,
      isArray: true,
      type: 'string',
      example: [
        `{ "column": "${Object.values(SortEnum)[0]}", "order": "DESC" }`,
      ],
    })
    @Expose()
    @Transform(({ value }) => {
      let values = [];
      if (typeof value === 'string') {
        values.push(value);
      } else if (Array.isArray(value)) {
        values.push(...value);
      }
      return values.map((item) => ValidateAndTransform(item));
    })
    sort?: IFindManyBaseSortItem<SEnum>[] = [];
  }

  // ------------------------------------------------------------------

  /**
   * Validates and transforms the sorting input.
   *
   * @param {any} plain - The raw input to validate and transform.
   * @throws {UnprocessableEntityException} - If the payload is invalid.
   * @returns {T} - Transformed and validated sort model.
   */
  function ValidateAndTransform<T>(plain: any) {
    try {
      const obj = JSON.parse(plain);
      const modelKeys = Object.getOwnPropertyNames(new SortModel());
      const objKeys = Object.keys(obj);
      if (!isEqualStringArray(modelKeys, objKeys)) {
        throw new UnprocessableEntityException(CommonError.INVALID_PAYLOAD);
      }
      const model = plainToInstance(SortModel, obj);
      const colEnum = Object.values(SortEnum);
      const orderEnum = Object.values(SortOrderEnum);
      if (!colEnum.includes(model.column)) {
        throw new UnprocessableEntityException(
          `Invalid sort.column: ${model.column}`,
        );
      }
      if (!orderEnum.includes(model.order)) {
        throw new UnprocessableEntityException(
          `Invalid sort.order: ${model.order}`,
        );
      }
      return model;
    } catch {
      throw new UnprocessableEntityException(CommonError.INVALID_PAYLOAD);
    }
  }

  /**
   * Generates a description for sorting parameters in API documentation.
   * @returns {string} - Description of allowed columns and sorting order.
   */
  function getSortDescription() {
    const orderEls = Object.values(SortOrderEnum).join(', ');
    const colsEls = Object.values(SortEnum).join(', ');
    const cols = `Allowed column: (${colsEls})`;
    const orders = `Allowed order: (${orderEls})`;
    const key = Object.keys(SortEnum)[0];
    const order = Math.round(Math.random()) >= 0.5 ? 'ASC' : 'DESC';
    const example = `{ "column": "${SortEnum[key]}", "order": "${order}" }`;
    return [cols, orders, example].join('<br/> ');
  }

  // ------------------------------------------------------------------

  return Class;
}
