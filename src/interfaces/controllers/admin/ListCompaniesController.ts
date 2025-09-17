import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import type { CompanyListQuery } from "../../../application/dto/index.ts"
import { ListCompaniesUseCase, type CompanyListResult } from "../../../application/use-cases/admin/ListCompaniesUseCase.ts"

@injectable()
export class ListCompaniesController {
  private listCompaniesUseCase: ListCompaniesUseCase

  constructor(
    @inject(ListCompaniesUseCase) listCompaniesUseCase: ListCompaniesUseCase,
  ) {
    this.listCompaniesUseCase = listCompaniesUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    type Source = {
      q?: string
      query?: string
      page?: number | string
      pageSize?: number | string
      sortBy?: CompanyListQuery["sortBy"]
      sortOrder?: CompanyListQuery["sortOrder"]
      isVerified?: boolean
      isBlocked?: boolean
      companySize?: string
      activeTab?:
        | "pending_review"
        | "approved"
        | "rejected"
        | "paid"
        | "blocked"
        | "settled"
        | "email_unverified"
        | "resubmitted"
        | string
    }

    const src = (request.method === "GET" ? request.query : request.body) as Partial<Source> | undefined
    const safe = src ?? {}

    const q = typeof safe.q === "string" ? safe.q : typeof safe.query === "string" ? safe.query : undefined
    const pageNumber = Number(safe.page)
    const page = Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1
    const pageSizeNumber = Number(safe.pageSize)
    const pageSize = Number.isFinite(pageSizeNumber) && pageSizeNumber > 0 ? pageSizeNumber : 10
    const sortBy = safe.sortBy
    const sortOrder = safe.sortOrder

    const filters: NonNullable<CompanyListQuery["filters"]> = {}
    if (typeof safe.isVerified === "boolean") filters.isVerified = safe.isVerified
    if (typeof safe.isBlocked === "boolean") filters.isBlocked = safe.isBlocked
    if (typeof safe.companySize === "string") filters.companySize = safe.companySize

    if (typeof safe.activeTab === "string") {
      switch (safe.activeTab) {
        case "pending_review":
          filters.status = "pending"
          filters.isVerified = true
          break
        
        case "resubmitted":
          filters.status = "resubmitted"
          filters.isVerified = true
          break
        case "approved":
          filters.status = "approved"
          filters.isVerified = true
          break
        case "rejected":
          filters.status = "declined"
          filters.isVerified = true
          break
        case "paid":
          filters.status = "paid"
          filters.isVerified = true
          break
        case "blocked":
          filters.isBlocked = true
          filters.isVerified = true
          break
        case "settled":
          filters.status = "paid"  // Settled companies are those with paid status
          filters.isVerified = true
          break
        case "email_unverified":
          filters.isVerified = false
          break
        default:
          break
      }
    }

    const query: CompanyListQuery = { q, page, pageSize, sortBy, sortOrder, filters }
    const result: CompanyListResult = await this.listCompaniesUseCase.execute(query)

    const transformedResult = {
      ...result,
      items: result.items.map(company => ({
        ...company,
        status: company.getFrontendStatus(),
      })),
    }

    return reply.code(200).send(transformedResult)
  }
}
