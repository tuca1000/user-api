import * as redisStore from 'cache-manager-redis-store'

import { CacheModuleAsyncOptions } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

export interface ICacheConfig {
  redis: {
    inject: any[]
    imports: any[]
    useFactory: any
  }
}

export default {
  /*
  |--------------------------------------------------------------------------
  | Redis cache configuration module
  |--------------------------------------------------------------------------
  |
  | Values used to export Redis Configuration to cache application.
  |
  */

  redis: {
    inject: [ConfigService],
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      const connection: any = {
        store: redisStore,
        ttl: 0,
        host: configService.get('database.redis.host'),
        port: configService.get('database.redis.port'),
      }

      const password = configService.get('database.redis.password')

      if (password !== '' && password) {
        connection.password = password
      }

      return connection
    },
  } as CacheModuleAsyncOptions,
} as ICacheConfig
