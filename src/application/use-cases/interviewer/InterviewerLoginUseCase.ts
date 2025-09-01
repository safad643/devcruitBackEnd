import { inject, injectable } from "inversify"
import type { IInterviewerRepository } from "../../../domain/repositories/IInterviewerRepository.ts"
import type { IAuthService } from "../../interfaces/services/IAuthService.ts"
import type { ICacheService } from "../../interfaces/services/ICacheService.ts"
import { AuthError } from "../../../domain/errors/DomainError.ts"

@injectable()
export class InterviewerLoginUseCase {
  private interviewerRepository: IInterviewerRepository
  private authService: IAuthService
  private cacheService: ICacheService

  constructor(
    @inject("IInterviewerRepository") interviewerRepository: IInterviewerRepository,
    @inject("IAuthService") authService: IAuthService,
    @inject("ICacheService") cacheService: ICacheService,
  ) {
    this.interviewerRepository = interviewerRepository
    this.authService = authService
    this.cacheService = cacheService
  }

  async execute(username: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const interviewer = await this.interviewerRepository.findByUsername(username)
    if (!interviewer) {
      throw new AuthError("Invalid credentials")
    }

    if (interviewer.isBlocked) {
      throw new AuthError("Account is blocked")
    }

    const isValidPassword = await this.authService.comparePassword(password, interviewer.passwordHash)
    if (!isValidPassword) {
      throw new AuthError("Invalid credentials")
    }

    const tokens = await this.authService.generateTokens(interviewer.id, "interviewer")
    await this.cacheService.set(`refresh:${interviewer.id}`, tokens.refreshToken, 7 * 24 * 60 * 60)
    return tokens
  }
}
