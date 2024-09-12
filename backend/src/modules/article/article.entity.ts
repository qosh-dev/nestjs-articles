import {
  Column,
  Entity,
  Index,
  ManyToOne
} from 'typeorm';
import { BaseEntity } from '../../database/structs/entity';
import { UserEntity } from '../user/user.entity';

@Entity('article') 
export class ArticleEntity extends BaseEntity {
  @Column({ unique: true })
  @Index()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp', default: 'now()' })
  createdAt!: Date

  @Column()
  authorId: string;

  @ManyToOne(() => UserEntity, (e) => e.articles, { onDelete: 'CASCADE' })
  author: UserEntity;
}
