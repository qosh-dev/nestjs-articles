import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerDatabase } from 'src/database/logger';
import { dataSourceOptions } from '../database/database-config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          ...dataSourceOptions,
          logging: true,
          logger: new LoggerDatabase(),
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}



