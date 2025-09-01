import { inject, injectable } from "inversify"
import type { IHRRepository } from "../../../domain/repositories/IHRRepository.ts"
import type { IAuthService } from "../../interfaces/services/IAuthService.ts"
import type { ICacheService } from "../../interfaces/services/ICacheService.ts"
import { AuthError } from "../../../domain/errors/DomainError.ts"

@injectable()
export class HRLoginUseCase {
  private hrRepository: IHRRepository
  private authService: IAuthService
  private cacheService: ICacheService

  constructor(
    @inject("IHRRepository") hrRepository: IHRRepository,
    @inject("IAuthService") authService: IAuthService,
    @inject("ICacheService") cacheService: ICacheService,
  ) {
    this.hrRepository = hrRepository
    this.authService = authService
    this.cacheService = cacheService
  }

  async execute(username: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const hr = await this.hrRepository.findByUsername(username)
    if (!hr) {
      throw new AuthError("Invalid credentials")
    }

    if (hr.isBlocked) {
      throw new AuthError("Account is blocked")
    }

    const isValidPassword = await this.authService.comparePassword(password, hr.passwordHash)
    if (!isValidPassword) {
      throw new AuthError("Invalid credentials")
    }

    const tokens = await this.authService.generateTokens(hr.id, "hr")
    await this.cacheService.set(`refresh:${hr.id}`, tokens.refreshToken, 7 * 24 * 60 * 60)
    return tokens
  }
}
