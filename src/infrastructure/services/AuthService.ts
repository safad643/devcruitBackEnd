import { injectable } from "inversify"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import type { SignOptions, Secret } from "jsonwebtoken"
import type { IAuthService } from "../../application/interfaces/services/IAuthService.ts"

function parseJwtExpiresInToSeconds(value: string): number {
  const match = value.trim().match(/^(\d+)\s*([smhdwy])$/i)
  if (!match) {
    const numeric = Number(value)
    return Number.isFinite(numeric) ? numeric : 0
  }
  const amount = Number(match[1])
  const unit = match[2].toLowerCase()
  switch (unit) {
    case "s":
      return amount
    case "m":
      return amount * 60
    case "h":
      return amount * 60 * 60
    case "d":
      return amount * 60 * 60 * 24
    case "w":
      return amount * 60 * 60 * 24 * 7
    case "y":
      return amount * 60 * 60 * 24 * 365
    default:
      return amount
  }
}

@injectable()
export class AuthService implements IAuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  async generateTokens(userId: string, role: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { userId, role }

    const accessToken = this.generateAccessToken(payload)
    const refreshToken = this.generateRefreshToken(payload)

    return { accessToken, refreshToken }
  }

  async verifyAccessToken(token: string): Promise<{ userId: string; role: string }> {
    const payload = this.verifyToken(token, "access")
    return { userId: payload.userId as string, role: payload.role as string }
  }

  async verifyRefreshToken(token: string): Promise<{ userId: string; role: string }> {
    const payload = this.verifyToken(token, "refresh")
    return { userId: payload.userId as string, role: payload.role as string }
  }

  async issueAccessToken(userId: string, role: string): Promise<string> {
    const payload = { userId, role }
    return this.generateAccessToken(payload)
  }

  private generateAccessToken(payload: Record<string, unknown>): string {
    const secret = process.env.JWT_ACCESS_SECRET
    const expiresIn: SignOptions['expiresIn'] = parseJwtExpiresInToSeconds(
      process.env.JWT_ACCESS_EXPIRES_IN || "15m"
    )

    if (!secret) {
      throw new Error("JWT_ACCESS_SECRET environment variable is required")
    }

    const options: SignOptions = { expiresIn }
    return jwt.sign(payload, secret as unknown as Secret, options)
  }

  private generateRefreshToken(payload: Record<string, unknown>): string {
    const secret = process.env.JWT_REFRESH_SECRET
    const expiresIn: SignOptions['expiresIn'] = parseJwtExpiresInToSeconds(
      process.env.JWT_REFRESH_EXPIRES_IN || "7d"
    )

    if (!secret) {
      throw new Error("JWT_REFRESH_SECRET environment variable is required")
    }

    const options: SignOptions = { expiresIn }
    return jwt.sign(payload, secret as unknown as Secret, options)
  }

  private verifyToken(token: string, type: "access" | "refresh"): Record<string, unknown> {
    const secret = type === "access" ? process.env.JWT_ACCESS_SECRET : process.env.JWT_REFRESH_SECRET
    if (!secret) {
      throw new Error(`JWT_${type.toUpperCase()}_SECRET environment variable is required`)
    }

    return jwt.verify(token, secret as unknown as Secret) as Record<string, unknown>
  }
}
