import { Injectable } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { Envs } from 'src/config/config.module';

@Injectable()
export class CacheService {
  private instance: Redis;

  private cacheDelaySec = 15;

  constructor() {
    const redisConfig: RedisOptions = {
      host: Envs.REDIS_HOST,
      port: Envs.REDIS_PORT,
      password: Envs.REDIS_PASSWORD,
    };
    try {
      this.instance = new Redis(redisConfig);
    } catch (error) {
      throw error;
    }
  }

  async getOne<T = any>(key: string): Promise<T> {
    const [object] = await this.instance.lrange(key, 0, 1);
    if (object) {
      return JSON.parse(object);
    }
    return;
  }

  async create(key: string, object: any): Promise<void> {
    await this.instance.lpush(key, JSON.stringify(object));
    await this.instance.expire(key, this.cacheDelaySec);
  }

  async createMany<T = any>(
    records: { key: string; data: T }[],
  ): Promise<void> {
    const pipeline = this.instance.pipeline();
    for (const object of records) {
      pipeline.lpush(object.key, JSON.stringify(object.data));
      pipeline.expire(object.key, this.cacheDelaySec);
    }
    await pipeline.exec();
  }

  async getMany<T = any>(keys: string[]): Promise<T[]> {
    const objects: any[] = [];
    for (const key of keys) {
      const records = await this.instance.lrange(key, 0, -1);
      const parced = records.map((v) => JSON.parse(v));
      objects.push(...parced);
    }
    return objects;
  }



  async deleteOne(key: string): Promise<void> {
    await this.instance.del(key);
  }

  async drop(namespace: string): Promise<void> {
    const keys = await this.instance.keys(`${namespace}:*`);
    if (keys.length > 0) {
      await this.instance.del(keys);
    }
  }

  generateCacheableKey(context: string, args: any[]): string {
    let keyParts: string[] = [];

    for (const arg of args) {
      console.log({ arg });
      if (typeof arg === 'string' || typeof arg === 'number') {
        keyParts.push(String(arg));
      } else if (typeof arg === 'object') {
        for (const key in arg) {
          const value = arg[key];
          if (value !== undefined && value !== null) {
            keyParts.push(`${key}-${value}`);
          }
          if (key === 'id') {
            break;
          }
        }
      }
    }

    if (!keyParts.length) {
      console.log({ args, context });
      throw new Error('Invalid key');
    }

    return 'cached_' + context + '_' + keyParts.join('_');
  }
}
