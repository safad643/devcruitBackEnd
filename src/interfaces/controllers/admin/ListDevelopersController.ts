import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import type { DeveloperListQuery } from "../../../application/dto/index.ts"
import { ListDevelopersUseCase } from "../../../application/use-cases/admin/ListDevelopersUseCase.ts"

@injectable()
export class ListDevelopersController {
  private listDevelopersUseCase: ListDevelopersUseCase

  constructor(
    @inject(ListDevelopersUseCase) listDevelopersUseCase: ListDevelopersUseCase,
  ) {
    this.listDevelopersUseCase = listDevelopersUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const source: any = request.method === "GET" ? (request.query ?? {}) : (request.body ?? {})
    const body = source as any

    const q = typeof body.q === "string" ? body.q : typeof body.searchTerm === "string" ? body.searchTerm : undefined

    const page = Number.isFinite(Number(body.page)) ? Number(body.page) : 1
    const pageSize = Number.isFinite(Number(body.pageSize)) ? Number(body.pageSize) : 10

    const rawSortBy = typeof body.sortBy === "string" ? body.sortBy : undefined
    let sortBy: DeveloperListQuery["sortBy"] = rawSortBy === "status" ? "createdAt" : (rawSortBy as any)
    let sortOrder = (body.sortOrder as DeveloperListQuery["sortOrder"]) || undefined

    const filters: NonNullable<DeveloperListQuery["filters"]> = {}
    if (typeof body.isVerified === "boolean") filters.isVerified = body.isVerified
    if (typeof body.isBlocked === "boolean") filters.isBlocked = body.isBlocked

    if (typeof body.statusFilter === "string") {
      if (body.statusFilter === "blocked") filters.isBlocked = true
      if (body.statusFilter === "active") filters.isBlocked = false
      if (body.statusFilter === "pending") filters.isVerified = false
    }

    if (typeof body.experienceFilter === "string" && body.experienceFilter !== "all") {
      const m = body.experienceFilter.match(/(\d+)(?:\+)?\s*-?\s*(\d+)?/)
      if (m) {
        const min = Number(m[1])
        const max = m[2] ? Number(m[2]) : undefined
        if (Number.isFinite(min)) (filters as any).minYears = min
        if (Number.isFinite(max)) (filters as any).maxYears = max
      }
    }

    if (typeof body.experienceLevel === "string") filters.experienceLevel = body.experienceLevel
    if (typeof body.preferredWorkStyle === "string") filters.preferredWorkStyle = body.preferredWorkStyle
    if (typeof body.preferredJobType === "string") filters.preferredJobType = body.preferredJobType
    if (typeof body.location === "string") filters.location = body.location
    if (Array.isArray(body.skills)) filters.skills = body.skills

    const query: DeveloperListQuery = { q, page, pageSize, sortBy, sortOrder, filters }
    const result = await this.listDevelopersUseCase.execute(query)
    return reply.code(200).send(result)
  }
}
