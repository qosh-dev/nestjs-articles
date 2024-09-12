import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.provider';

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
