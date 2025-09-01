import { inject, injectable } from "inversify"
import type { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository.ts"
import type { IBlockHistoryRepository } from "../../../domain/repositories/IBlockHistoryRepository.ts"
import { NotFoundError } from "../../../domain/errors/DomainError.ts"
import { randomUUID } from "crypto"
import type { IEmailService } from "../../interfaces/services/IEmailService.ts"
import type { BlockDeveloperDTO } from "../../dto"

@injectable()
export class BlockDeveloperUseCase {
  private developerRepository: IDeveloperRepository
  private blockHistoryRepository: IBlockHistoryRepository
  private emailService: IEmailService

  constructor(
    @inject("IDeveloperRepository") developerRepository: IDeveloperRepository,
    @inject("IBlockHistoryRepository") blockHistoryRepository: IBlockHistoryRepository,
    @inject("IEmailService") emailService: IEmailService,
  ) {
    this.developerRepository = developerRepository
    this.blockHistoryRepository = blockHistoryRepository
    this.emailService = emailService
  }

  async execute(request: BlockDeveloperDTO): Promise<{ message: string }> {
    const developer = await this.developerRepository.findById(request.developerId)
    if (!developer) {
      throw new NotFoundError("Developer not found")
    }

    await this.developerRepository.updateBlockStatus(request.developerId, true)
    
    const blockHistory = {
      entityId: request.developerId,
      entityType: 'developer' as const,
      action: 'blocked' as const,
      reason: request.reason,
      details: request.details,
      performedAt: new Date(),
    }

    const createdBlockHistory = await this.blockHistoryRepository.create(blockHistory)
    try {
      await this.emailService.sendDeveloperBlocked(developer.email, {
        fullName: developer.fullName,
        reason: blockHistory.reason,
        details: blockHistory.details,
        blockId: createdBlockHistory.id,
      })
    } catch (error) {
      console.error("Failed to send developer blocked email", error)
    }
    return { message: "Developer blocked successfully" }
  }
}
