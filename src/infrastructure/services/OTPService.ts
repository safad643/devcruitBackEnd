import { injectable } from "inversify"
import { createClient } from "redis"
import type { IOTPService } from "../../application/interfaces/services/IOTPService.ts"

@injectable()
export class OTPService implements IOTPService {
  private redisClient = createClient({ url: process.env.REDIS_URL })

  constructor() {
    this.redisClient.connect()
  }

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  async storeOTP(email: string, otp: string): Promise<void> {
    await this.redisClient.setEx(`otp:${email}`, 60, otp)
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const storedOTP = await this.redisClient.get(`otp:${email}`)
    if (storedOTP === otp) {
      await this.redisClient.del(`otp:${email}`)
      return true
    }
    return false
  }


}
