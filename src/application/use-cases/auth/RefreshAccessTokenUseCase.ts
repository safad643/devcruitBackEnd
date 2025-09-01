import { inject, injectable } from "inversify"
import type { IAuthService } from "../../interfaces/services/IAuthService.ts"

@injectable()
export class RefreshAccessTokenUseCase {
  private authService: IAuthService

  constructor(@inject("IAuthService") authService: IAuthService) {
    this.authService = authService
  }

  async execute(refreshToken: string): Promise<{ accessToken: string }> {
    const { userId, role } = await this.authService.verifyRefreshToken(refreshToken)
    const accessToken = await this.authService.issueAccessToken(userId, role)
    return { accessToken }
  }
}



