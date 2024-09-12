import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AppContextModule } from './libs/als/app-context.module';
import { CacheModule } from './libs/cache/cache.module';
import { LoggerModule } from './libs/logger/logger.module';
import { TestService } from './libs/test/test.service';
import { ArticleModule } from './modules/article/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    LoggerModule,
    AppContextModule,
    CacheModule,
    UserModule,
    AuthModule,
    ArticleModule,
  ],
  providers: [TestService],
})
export class AppModule {}
