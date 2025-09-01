import { inject, injectable } from "inversify"
import type { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository.ts"
import { NotFoundError } from "../../../domain/errors/DomainError.ts"
import type { IEmailService } from "../../interfaces/services/IEmailService.ts"
import type { DeleteDeveloperDTO } from "../../dto"

@injectable()
export class DeleteDeveloperUseCase {
  private developerRepository: IDeveloperRepository
  private emailService: IEmailService

  constructor(
    @inject("IDeveloperRepository") developerRepository: IDeveloperRepository,
    @inject("IEmailService") emailService: IEmailService,
  ) {
    this.developerRepository = developerRepository
    this.emailService = emailService
  }

  async execute(request: DeleteDeveloperDTO): Promise<{ message: string }> {
    const developer = await this.developerRepository.findById(request.developerId)
    if (!developer) {
      throw new NotFoundError("Developer not found")
    }

    await this.developerRepository.deleteById(request.developerId)
    try {
      await this.emailService.sendDeveloperTerminated(developer.email, {
        fullName: developer.fullName,
      })
    } catch (error) {
      console.error("Failed to send developer termination email", error)
    }
    return { message: "Developer deleted successfully" }
  }
}
