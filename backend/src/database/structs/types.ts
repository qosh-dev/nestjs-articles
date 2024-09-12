// ---------------------------------------------------------------

type StringValues<T> = {
  [K in keyof T]: T[K] extends string | number ? T[K] : never;
}[keyof T];

export type EnumAsUnion<T> = `${StringValues<T>}`;

// ---------------------------------------------------------------


export interface IFindManyResponseBase<T> {
  data: T[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
};


export enum SortOrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IFindPaginationBase {
  page?: number;
  limit?: number;
}

export interface IFindManyBase<SEnum extends Record<string, string>> extends IFindPaginationBase {
  ids?: string[];
  sort?: IFindManyBaseSortItem<SEnum>[];
}

export interface IFindManyBaseSortItem<SEnum extends Record<string, string>>{
  column: EnumAsUnion<SEnum>;
  order: SortOrderEnum;
}

