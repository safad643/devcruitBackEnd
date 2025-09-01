import { injectable } from "inversify"
import type { ICacheService } from "../../application/interfaces/services/ICacheService.ts"
import { getRedisClient } from "../cache/redis.ts"

@injectable()
export class CacheService implements ICacheService {
  private client = getRedisClient()

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value)
    } else {
      await this.client.set(key, value)
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key)
  }
}
