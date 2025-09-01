import { inject, injectable } from "inversify"
import type { IAuthService } from "../../interfaces/services/IAuthService.ts"
import type { ICacheService } from "../../interfaces/services/ICacheService.ts"

@injectable()
export class LogoutUseCase {
  private authService: IAuthService
  private cacheService: ICacheService

  constructor(
    @inject("IAuthService") authService: IAuthService,
    @inject("ICacheService") cacheService: ICacheService,
  ) {
    this.authService = authService
    this.cacheService = cacheService
  }

  async execute(refreshToken: string): Promise<void> {
    const { userId } = await this.authService.verifyRefreshToken(refreshToken)
    await this.cacheService.delete(`refresh:${userId}`)
  }
}
