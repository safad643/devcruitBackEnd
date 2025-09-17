import { inject, injectable } from "inversify"
import type { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository.ts"
import type { IBlockHistoryRepository } from "../../../domain/repositories/IBlockHistoryRepository.ts"
import type { IEmailService } from "../../interfaces/services/IEmailService.ts"
import { NotFoundError } from "../../../domain/errors/DomainError.ts"
import type { UnblockCompanyDTO } from "../../dto"

@injectable()
export class UnblockCompanyUseCase {
  private companyRepository: ICompanyRepository
  private blockHistoryRepository: IBlockHistoryRepository
  private emailService: IEmailService

  constructor(
    @inject("ICompanyRepository") companyRepository: ICompanyRepository,
    @inject("IBlockHistoryRepository") blockHistoryRepository: IBlockHistoryRepository,
    @inject("IEmailService") emailService: IEmailService,
  ) {
    this.companyRepository = companyRepository
    this.blockHistoryRepository = blockHistoryRepository
    this.emailService = emailService
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
    
    try {
      await this.emailService.sendCompanyUnblocked(company.businessEmail, {
        contactName: company.fullName,
        companyName: company.companyName,
        reason: request.reason,
        referenceId: blockHistory.entityId,
      })
    } catch (error) {
      console.error("Failed to send company unblocked email", error)
    }
  }
}
