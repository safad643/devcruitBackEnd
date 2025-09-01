import { inject, injectable } from "inversify"
import type { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository.ts"
import type { CompanyListQuery, PaginatedResult } from "../../dto/index.ts"
import type { Company } from "../../../domain/entities/Company.ts"

export interface CompanyListResult extends PaginatedResult<Company> {
  pendingVerifiedCount: number
}

@injectable()
export class ListCompaniesUseCase {
  private companyRepository: ICompanyRepository

  constructor(@inject("ICompanyRepository") companyRepository: ICompanyRepository) {
    this.companyRepository = companyRepository
  }

  async execute(query: CompanyListQuery): Promise<CompanyListResult> {
    const [paginatedResult, pendingVerifiedCount] = await Promise.all([
      this.companyRepository.searchAndPaginate(query),
      this.companyRepository.getPendingVerifiedCount()
    ])
    
    return {
      ...paginatedResult,
      pendingVerifiedCount
    }
  }
}
