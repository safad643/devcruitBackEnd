import { inject, injectable } from "inversify"
import type { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository.ts"
import type { IBlockHistoryRepository } from "../../../domain/repositories/IBlockHistoryRepository.ts"
import { NotFoundError } from "../../../domain/errors/DomainError.ts"
import type { IEmailService } from "../../interfaces/services/IEmailService.ts"
import type { BlockCompanyDTO } from "../../dto"

@injectable()
export class BlockCompanyUseCase {
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

  async execute(request: BlockCompanyDTO): Promise<void> {
    const company = await this.companyRepository.findById(request.companyId)
    if (!company) {
      throw new NotFoundError("Company not found")
    }

    await this.companyRepository.updateBlockStatus(request.companyId, true)
    
    const blockHistory = {
      entityId: request.companyId,
      entityType: 'company' as const,
      action: 'blocked' as const,
      reason: request.reason || 'No reason provided',
      details: request.details,
      performedAt: new Date(),
    }

    await this.blockHistoryRepository.create(blockHistory)
    
    try {
      await this.emailService.sendCompanyBlocked(company.businessEmail, {
        contactName: company.fullName,
        companyName: company.companyName,
      })
    } catch (error) {
      console.error("Failed to send company blocked email", error)
    }
  }
}
