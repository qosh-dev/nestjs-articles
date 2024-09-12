import { ApiProperty } from "@nestjs/swagger";
import { IFindManyResponseBase } from "../interfaces/find-many-base-response.interface";


export class FindManyResponseBase<T> implements IFindManyResponseBase<T> {

  @ApiProperty({
    description: 'Count',
    required: true,
  })
  count: number;

  @ApiProperty({
    description: 'Total',
    required: true,
  })
  total: number;

  @ApiProperty({
    description: 'Page',
    required: true,
  })
  page: number;

  @ApiProperty({
    description: 'Page count',
    required: true,
  })
  pageCount: number;

  @ApiProperty({
    description: 'Items',
    required: true,
  })
  data: T[];

  // --------------------------------------------------------------------------------------------------------------

  static apiSchema<M>(itemModel: M, modelName: string) {

    class FindManyResponse extends FindManyResponseBase<M> {
      @ApiProperty({
        description: 'Items',
        required: true,
        type: itemModel
      })
      data: M[];
    }

    Object.defineProperty(FindManyResponse, "name", { 'value': `GetMany${modelName}Response` })
    return FindManyResponse
  }
}

