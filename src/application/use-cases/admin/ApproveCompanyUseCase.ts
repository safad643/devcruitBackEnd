import { inject, injectable } from "inversify"
import type { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository.ts"
import { NotFoundError } from "../../../domain/errors/DomainError.ts"
import type { IEmailService } from "../../interfaces/services/IEmailService.ts"

@injectable()
export class ApproveCompanyUseCase {
  private companyRepository: ICompanyRepository
  private emailService: IEmailService

  constructor(
    @inject("ICompanyRepository") companyRepository: ICompanyRepository,
    @inject("IEmailService") emailService: IEmailService,
  ) {
    this.companyRepository = companyRepository
    this.emailService = emailService
  }

  async execute(companyId: string): Promise<void> {
    const company = await this.companyRepository.findById(companyId)
    if (!company) {
      throw new NotFoundError("Company not found")
    }

    await this.companyRepository.updateStatus(companyId, "approved")
    try {
      await this.emailService.sendCompanyApproved(company.businessEmail, {
        contactName: company.fullName,
        companyName: company.companyName,
      })
    } catch (error) {
      console.error("Failed to send company approved email", error)
    }
  }
}
