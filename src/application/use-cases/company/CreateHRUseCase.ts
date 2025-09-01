import { inject, injectable } from "inversify"
import type { IHRRepository } from "../../../domain/repositories/IHRRepository.ts"
import type { IAuthService } from "../../interfaces/services/IAuthService.ts"
import { HR } from "../../../domain/entities/HR.ts"
import { ConflictError } from "../../../domain/errors/DomainError.ts"
import { randomUUID } from "crypto"

@injectable()
export class CreateHRUseCase {
  private hrRepository: IHRRepository
  private authService: IAuthService

  constructor(
    @inject("IHRRepository") hrRepository: IHRRepository,
    @inject("IAuthService") authService: IAuthService,
  ) {
    this.hrRepository = hrRepository
    this.authService = authService
  }

  async execute(companyId: string, username: string, password: string): Promise<HR> {
    const existingHR = await this.hrRepository.findByUsername(username)
    if (existingHR) {
      throw new ConflictError("HR username already exists")
    }

    const passwordHash = await this.authService.hashPassword(password)
    const hr = new HR(randomUUID(), username, passwordHash, companyId)

    return this.hrRepository.create(hr)
  }
}
