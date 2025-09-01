import { inject, injectable } from "inversify"
import type { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository.ts"
import type { IBlockHistoryRepository } from "../../../domain/repositories/IBlockHistoryRepository.ts"
import { NotFoundError } from "../../../domain/errors/DomainError.ts"
import { randomUUID } from "crypto"
import type { UnblockDeveloperDTO } from "../../dto"

@injectable()
export class UnblockDeveloperUseCase {
  private developerRepository: IDeveloperRepository
  private blockHistoryRepository: IBlockHistoryRepository

  constructor(
    @inject("IDeveloperRepository") developerRepository: IDeveloperRepository,
    @inject("IBlockHistoryRepository") blockHistoryRepository: IBlockHistoryRepository,
  ) {
    this.developerRepository = developerRepository
    this.blockHistoryRepository = blockHistoryRepository
  }

  async execute(request: UnblockDeveloperDTO): Promise<{ message: string }> {
    const developer = await this.developerRepository.findById(request.developerId)
    
    if (!developer) {
      throw new NotFoundError("Developer not found")
    }

    await this.developerRepository.updateBlockStatus(request.developerId, false)
    
    const blockHistory = {
      entityId: request.developerId,
      entityType: 'developer' as const,
      action: 'unblocked' as const,
      reason: request.reason,
      details: request.details,
      performedAt: new Date(),
    }

    await this.blockHistoryRepository.create(blockHistory)
    return { message: "Developer unblocked successfully" }
  }
}
