import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ArticleEntity } from '../modules/article/article.entity';
import { UserEntity } from '../modules/user/user.entity';
dotenv.config({ path: '../.env' });


export let dataSourceOptions: DataSourceOptions = {
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  typename: '__typename',
  type: 'postgres',
  synchronize: false,
  // entities: ['dist/**/*.entity.{js,ts}'],
  entities:[
    ArticleEntity,
    UserEntity
  ]
};

const dataSource = new DataSource({
  ...dataSourceOptions,
  migrations: ['src/database/migrations/*.{js,ts}'],
  migrationsTableName: 'migrations',
});
export default dataSource;
