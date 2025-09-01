import { createClient } from "redis"

let redisClient: ReturnType<typeof createClient>

export async function connectRedis(): Promise<void> {
  const url = process.env.REDIS_URL
  if (!url) {
    throw new Error("REDIS_URL environment variable is required")
  }

  redisClient = createClient({ url })

  redisClient.on("error", (err) => {
    console.error("Redis Client Error", err)
  })

  await redisClient.connect()
  console.log("Connected to Redis")
}

export function getRedisClient() {
  if (!redisClient) {
    throw new Error("Redis client not initialized")
  }
  return redisClient
}
