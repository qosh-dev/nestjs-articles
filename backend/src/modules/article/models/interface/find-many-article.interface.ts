import { IFindManyBase } from "src/database/structs/types";
import { SortEnum } from "../enum/sort.enum";

export interface IFindManyArticle extends IFindManyBase<typeof SortEnum> {
  title?: string;
  description?: string;
  createdAtGte?: number;
  createdAtLte?: number;
  authorUserName?: string;
}