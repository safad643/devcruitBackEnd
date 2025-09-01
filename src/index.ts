import "reflect-metadata"
import { config } from "dotenv"
import { container } from "./infrastructure/container.ts"
import { FastifyApp } from "./infrastructure/web/FastifyApp.ts"
import { connectRedis } from "./infrastructure/cache/redis.ts"
import { connectDatabase } from "./infrastructure/database/mongodb.ts"

config()

async function bootstrap() {
  try {
    await connectDatabase()

    await connectRedis()

    const app = container.get(FastifyApp)
    await app.start()

    console.log(" Server started successfully")
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

bootstrap()
