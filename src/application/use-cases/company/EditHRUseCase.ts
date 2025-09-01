import { inject, injectable } from "inversify"
import type { IHRRepository } from "../../../domain/repositories/IHRRepository.ts"
import type { IAuthService } from "../../interfaces/services/IAuthService.ts"
import { NotFoundError } from "../../../domain/errors/DomainError.ts"

@injectable()
export class EditHRUseCase {
  private hrRepository: IHRRepository
  private authService: IAuthService

  constructor(
    @inject("IHRRepository") hrRepository: IHRRepository,
    @inject("IAuthService") authService: IAuthService,
  ) {
    this.hrRepository = hrRepository
    this.authService = authService
  }

  async execute(hrId: string, data: { username?: string; password?: string }): Promise<void> {
    const hr = await this.hrRepository.findById(hrId)
    if (!hr) {
      throw new NotFoundError("HR not found")
    }

    const updateData: any = {}
    if (data.username) {
      updateData.username = data.username
    }
    if (data.password) {
      updateData.passwordHash = await this.authService.hashPassword(data.password)
    }

    await this.hrRepository.update(hrId, updateData)
  }
}
