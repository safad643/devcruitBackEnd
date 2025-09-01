import { inject, injectable } from "inversify"
import type { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository.ts"
import type { IBlockHistoryRepository } from "../../../domain/repositories/IBlockHistoryRepository.ts"
import { NotFoundError } from "../../../domain/errors/DomainError.ts"
import type { UnblockCompanyDTO } from "../../dto"

@injectable()
export class UnblockCompanyUseCase {
  private companyRepository: ICompanyRepository
  private blockHistoryRepository: IBlockHistoryRepository

  constructor(
    @inject("ICompanyRepository") companyRepository: ICompanyRepository,
    @inject("IBlockHistoryRepository") blockHistoryRepository: IBlockHistoryRepository,
  ) {
    this.companyRepository = companyRepository
    this.blockHistoryRepository = blockHistoryRepository
  }

  async execute(request: UnblockCompanyDTO): Promise<void> {
    const company = await this.companyRepository.findById(request.companyId)
    if (!company) {
      throw new NotFoundError("Company not found")
    }

    await this.companyRepository.updateBlockStatus(request.companyId, false)
    
    const blockHistory = {
      entityId: request.companyId,
      entityType: 'company' as const,
      action: 'unblocked' as const,
      reason: request.reason || 'No reason provided',
      details: request.details,
      performedAt: new Date(),
    }

    await this.blockHistoryRepository.create(blockHistory)
  }
}
