import { inject, injectable } from "inversify"
import type { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository.ts"
import type { IAuthService } from "../../interfaces/services/IAuthService.ts"
import type { ICacheService } from "../../interfaces/services/ICacheService.ts"
import type { IBlockHistoryRepository } from "../../../domain/repositories/IBlockHistoryRepository.ts"
import { AuthError } from "../../../domain/errors/DomainError.ts"

@injectable()
export class DeveloperLoginUseCase {
  private developerRepository: IDeveloperRepository
  private authService: IAuthService
  private blockHistoryRepository: IBlockHistoryRepository
  private cacheService: ICacheService

  constructor(
    @inject("IDeveloperRepository") developerRepository: IDeveloperRepository,
    @inject("IAuthService") authService: IAuthService,
    @inject("IBlockHistoryRepository") blockHistoryRepository: IBlockHistoryRepository,
    @inject("ICacheService") cacheService: ICacheService,
  ) {
    this.developerRepository = developerRepository
    this.authService = authService
    this.blockHistoryRepository = blockHistoryRepository
    this.cacheService = cacheService
  }

  async execute(email: string, password: string): Promise<{ loggedIn: boolean; accessToken?: string; refreshToken?: string; isBlocked?: boolean; blockedReason?: string; blockedDetails?: string; profileSetup?: boolean }> {
    const developer = await this.developerRepository.findByEmail(email)
    if (!developer) {
      throw new AuthError("Invalid credentials")
    }

    if (!developer.isVerified) {
      console.log(developer);
      
      throw new AuthError("Account not verified")
    }

    const isValidPassword = await this.authService.comparePassword(password, developer.passwordHash)
    if (!isValidPassword) {
      throw new AuthError("Invalid credentials")
    }

    if (developer.isBlocked) {
      const history = await this.blockHistoryRepository.findByEntityId(developer.id, 'developer')
      const lastBlocked = history.find(h => h.action === 'blocked')
      const blockedReason = lastBlocked?.reason
      const blockedDetails = lastBlocked?.details
      return { loggedIn: false, isBlocked: true, blockedReason, blockedDetails }
    }

    const tokens = await this.authService.generateTokens(developer.id, "developer")
    await this.cacheService.set(`refresh:${developer.id}`, tokens.refreshToken, 7 * 24 * 60 * 60)
    return { loggedIn: true, ...tokens, profileSetup: developer.profileSetup }
  }
}
