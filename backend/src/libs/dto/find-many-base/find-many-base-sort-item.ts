import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsEnum } from 'class-validator';
import { EnumAsUnion, IFindManyBaseSortItem, SortOrderEnum } from 'src/database/structs/types';

/**
 * Function that creates a dynamic sort item class for querying entities.
 * It returns a class that enforces sorting by a specified column and sort order.
 *
 * @template SEnum
 * @param {SEnum} SortEnum - An enum defining the columns that can be sorted.
 * @returns {Class} - A dynamically created class for sorting entities.
 */
export function FindManyBaseSortItem<SEnum extends Record<string, string>>(
  SortEnum: SEnum,
) {
  class Class implements IFindManyBaseSortItem<SEnum> {
    @ApiProperty({
      description: 'Sort by column item',
      required: true,
      type: 'enum',
      enum: SortEnum,
    })
    @IsEnum(SortEnum)
    @IsDefined()
    @Expose()
    column: EnumAsUnion<SEnum> = null;

    @ApiProperty({
      description: 'Sort by column item',
      required: true,
      type: 'enum',
      enum: SortOrderEnum,
    })
    @IsEnum(SortOrderEnum)
    @IsDefined()
    @Expose()
    order: SortOrderEnum = null;
  }

  return Class;
}
