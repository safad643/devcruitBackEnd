import { inject, injectable } from "inversify"
import type { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository.ts"
import { AuthError } from "../../../domain/errors/DomainError.ts"

@injectable()
export class UpdateCompanyPaymentUseCase {
  private companyRepository: ICompanyRepository

  constructor(
    @inject("ICompanyRepository") companyRepository: ICompanyRepository,
  ) {
    this.companyRepository = companyRepository
  }

  async execute(companyId: string, planName: string): Promise<{ success: boolean; status: string }> {
    const company = await this.companyRepository.findById(companyId)
    if (!company) {
      throw new AuthError("Company not found")
    }

    if (company.status !== "approved") {
      throw new AuthError("Company must be approved before payment")
    }

    await this.companyRepository.updateById(companyId, {
      status: "paid",
      planName: planName,
    })

    return {
      success: true,
      status: "paid",
    }
  }
}
