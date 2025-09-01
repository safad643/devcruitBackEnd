import { inject, injectable } from "inversify"
import type { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository.ts"
import type { IAuthService } from "../../interfaces/services/IAuthService.ts"
import type { ICacheService } from "../../interfaces/services/ICacheService.ts"
import type { IBlockHistoryRepository } from "../../../domain/repositories/IBlockHistoryRepository.ts"
import { AuthError } from "../../../domain/errors/DomainError.ts"

@injectable()
export class CompanyLoginUseCase {
  private companyRepository: ICompanyRepository
  private authService: IAuthService
  private blockHistoryRepository: IBlockHistoryRepository
  private cacheService: ICacheService

  constructor(
    @inject("ICompanyRepository") companyRepository: ICompanyRepository,
    @inject("IAuthService") authService: IAuthService,
    @inject("IBlockHistoryRepository") blockHistoryRepository: IBlockHistoryRepository,
    @inject("ICacheService") cacheService: ICacheService,
  ) {
    this.companyRepository = companyRepository
    this.authService = authService
    this.blockHistoryRepository = blockHistoryRepository
    this.cacheService = cacheService
  }

  async execute(email: string, password: string): Promise<{ loggedIn: boolean; accessToken?: string; refreshToken?: string; status?: string; declineReason?: string; requestedDocuments?: string[]; isBlocked?: boolean; blockedReason?: string; blockedDetails?: string }> {
    const company = await this.companyRepository.findByEmail(email)
    if (!company) {
      throw new AuthError("Invalid credentials")
    }

    if (!company.isVerified) {
      throw new AuthError("Account not verified")
    }

    const isValidPassword = await this.authService.comparePassword(password, company.passwordHash)
    if (!isValidPassword) {
      throw new AuthError("Invalid credentials")
    }

    if (company.isBlocked) {
      const history = await this.blockHistoryRepository.findByEntityId(company.id, 'company')
      const lastBlocked = history.find(h => h.action === 'blocked')
      const blockedReason = lastBlocked?.reason
      const blockedDetails = lastBlocked?.details
      return {
        loggedIn: false,
        isBlocked: true,
        blockedReason,
        blockedDetails,
        status: company.status,
        declineReason: company.declineReason,
        requestedDocuments: company.requestedDocuments,
      }
    }

    const tokens = await this.authService.generateTokens(company.id, "company")
    await this.cacheService.set(`refresh:${company.id}`, tokens.refreshToken, 7 * 24 * 60 * 60)
    return {
      loggedIn: true,
      ...tokens,
      status: company.status,
      declineReason: company.declineReason,
      requestedDocuments: company.requestedDocuments,
    }
  }
}
