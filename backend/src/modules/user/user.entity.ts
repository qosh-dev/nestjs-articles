import * as bcrypt from 'bcryptjs';
import { BaseEntity } from 'src/database/structs/entity';
import { BeforeInsert, Column, Entity, Index, OneToMany } from 'typeorm';
import { ArticleEntity } from '../article/article.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Index()
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => ArticleEntity, (u) => u.author)
  articles: ArticleEntity[];

  // --------------------------------------------------------------------

  @BeforeInsert()
  private async hashPassword() {
    if (!this.password) {
      return;
    }
    this.password = await bcrypt.hash(this.password, 10);
  }
}
