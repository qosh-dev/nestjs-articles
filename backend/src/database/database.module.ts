import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../database/database-config';
import { LoggerDatabase } from '../database/logger';

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



