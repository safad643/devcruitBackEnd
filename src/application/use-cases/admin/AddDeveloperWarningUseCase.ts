import { inject, injectable } from "inversify"
import type { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository.ts"
import type { IWarningRepository } from "../../../domain/repositories/IWarningRepository.ts"
import { NotFoundError } from "../../../domain/errors/DomainError.ts"
import type { IEmailService } from "../../interfaces/services/IEmailService.ts"
import type { AddDeveloperWarningDTO } from "../../dto"

@injectable()
export class AddDeveloperWarningUseCase {
  private developerRepository: IDeveloperRepository
  private warningRepository: IWarningRepository
  private emailService: IEmailService

  constructor(
    @inject("IDeveloperRepository") developerRepository: IDeveloperRepository,
    @inject("IWarningRepository") warningRepository: IWarningRepository,
    @inject("IEmailService") emailService: IEmailService,
  ) {
    this.developerRepository = developerRepository
    this.warningRepository = warningRepository
    this.emailService = emailService
  }

  async execute(request: AddDeveloperWarningDTO): Promise<{ message: string }> {
    const developer = await this.developerRepository.findById(request.developerId)
    if (!developer) {
      throw new NotFoundError("Developer not found")
    }

    const warning = {
      entityId: request.developerId,
      entityType: 'developer' as const,
      reason: request.reason,
      details: request.details,
      expectedResolution: request.expectedResolution,
      issuedAt: new Date(),
      read: false,
    }

    await this.warningRepository.create(warning)
    try {
      await this.emailService.sendDeveloperWarning(developer.email, {
        fullName: developer.fullName,
        reason: warning.reason,
        details: warning.details,
        expectedResolution: warning.expectedResolution,
        issuedAt: warning.issuedAt,
      })
    } catch (error) {
      console.error("Failed to send developer warning email", error)
    }
    return { message: "Warning added successfully" }
  }
}


