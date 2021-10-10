import { RedisClient } from 'redis'
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common'

@Injectable()
export class RedisCacheService {
  @Inject(CACHE_MANAGER) private cache: any

  async close() {
    const client: RedisClient = this.cache.store.getClient()

    client.quit()
  }

  async get(key: string) {
    return this.cache.get(key)
  }

  async set(key: string, value: any, ttl = 0) {
    await this.cache.set(key, value, { ttl })
  }

  async del(key: string | string[]) {
    await this.cache.del(key)
  }

  async truncate() {
    const keys = await this.cache.keys()

    if (!keys.length) return

    await this.cache.del(keys)
  }
}
