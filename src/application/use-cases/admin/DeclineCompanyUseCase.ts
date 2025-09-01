import { inject, injectable } from "inversify"
import type { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository.ts"
import { NotFoundError, ValidationError } from "../../../domain/errors/DomainError.ts"
import type { IEmailService } from "../../interfaces/services/IEmailService.ts"

@injectable()
export class DeclineCompanyUseCase {
  private companyRepository: ICompanyRepository
  private emailService: IEmailService

  constructor(
    @inject("ICompanyRepository") companyRepository: ICompanyRepository,
    @inject("IEmailService") emailService: IEmailService,
  ) {
    this.companyRepository = companyRepository
    this.emailService = emailService
  }

  async execute(companyId: string, reason?: string, requestedDocuments?: string[]): Promise<void> {
    const company = await this.companyRepository.findById(companyId)
    if (!company) {
      throw new NotFoundError("Company not found")
    }

    if (company.status === "approved") {
      throw new ValidationError("Cannot decline an already approved company")
    }

    await this.companyRepository.updateById(companyId, {
      status: "declined",
      declineReason: reason,
      requestedDocuments: Array.isArray(requestedDocuments) ? requestedDocuments : undefined,
    })
    try {
      await this.emailService.sendCompanyDeclined(company.businessEmail, {
        contactName: company.fullName,
        companyName: company.companyName,
        reason: reason,
        requestedDocuments: requestedDocuments,
      })
    } catch (error) {
      console.error("Failed to send company declined email", error)
    }
  }
}
