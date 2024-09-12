import { IFindOneBase } from 'src/libs/interfaces/find-one-base.interface';
import { PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity implements IFindOneBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
