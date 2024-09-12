import { PrimaryGeneratedColumn } from 'typeorm';
import { IFindOneBase } from '../../libs/interfaces/find-one-base.interface';

export class BaseEntity implements IFindOneBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
