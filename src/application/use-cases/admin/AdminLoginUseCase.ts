import { inject, injectable } from "inversify"
import type { IAdminRepository } from "../../../domain/repositories/IAdminRepository.ts"
import type { IAuthService } from "../../interfaces/services/IAuthService.ts"
import type { ICacheService } from "../../interfaces/services/ICacheService.ts"
import { AuthError } from "../../../domain/errors/DomainError.ts"

@injectable()
export class AdminLoginUseCase {
  private adminRepository: IAdminRepository
  private authService: IAuthService
  private cacheService: ICacheService

  constructor(
    @inject("IAdminRepository") adminRepository: IAdminRepository,
    @inject("IAuthService") authService: IAuthService,
    @inject("ICacheService") cacheService: ICacheService,
  ) {
    this.adminRepository = adminRepository
    this.authService = authService
    this.cacheService = cacheService
  }

  async execute(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; fullName: string; email: string }> {
    const admin = await this.adminRepository.findByEmail(email)
    if (!admin) {
      throw new AuthError("Invalid credentials")
    }

    const isValidPassword = await this.authService.comparePassword(password, admin.passwordHash)
    if (!isValidPassword) {
      throw new AuthError("Invalid credentials")
    }

    const tokens = await this.authService.generateTokens(admin.id, "admin")
    await this.cacheService.set(`refresh:${admin.id}`, tokens.refreshToken, 7 * 24 * 60 * 60)
    return { 
      ...tokens, 
      fullName: admin.fullName,
      email: admin.email
    }
  }
}
