import { inject, injectable } from "inversify"
import type { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository.ts"
import type { IEmailService } from "../../interfaces/services/IEmailService.ts"
import type { ResubmitCompanyDTO } from "../../dto/CompanyDTO.ts"
import { DomainError } from "../../../domain/errors/DomainError.ts"

@injectable()
export class ResubmitCompanyUseCase {
  constructor(
    @inject("ICompanyRepository") private companyRepository: ICompanyRepository,
    @inject("IEmailService") private emailService: IEmailService,
  ) {}

  async execute(data: ResubmitCompanyDTO): Promise<void> {
    // Find the company
    const company = await this.companyRepository.findById(data.companyId)
    if (!company) {
      throw new DomainError("COMPANY_NOT_FOUND", "Company not found", 404)
    }

    // Check if company is in declined status
    if (company.status !== "declined") {
      throw new DomainError("INVALID_STATUS", "Company is not in declined status", 400)
    }

    // Update company status to resubmitted
    await this.companyRepository.updateStatus(data.companyId, "resubmitted")

    // Clear decline reason and requested documents since they're being addressed
    await this.companyRepository.updateById(data.companyId, {
      declineReason: undefined,
      requestedDocuments: undefined,
    })

    // Send email notification to admin about resubmission
    try {
      await this.emailService.sendCompanyResubmitted(
        company.businessEmail,
        {
          contactName: company.fullName,
          companyName: company.companyName,
          resubmissionNotes: data.resubmissionNotes,
        }
      )
    } catch (error) {
      // Log error but don't fail the resubmission
      console.error("Failed to send resubmission email:", error)
    }
  }
}
