import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { ListHRUseCase } from "../../../application/use-cases/company/ListHRUseCase.ts"
import { ListHRSchema } from "../../dtos/company/CompanyDTOs.ts"

@injectable()
export class ListHRController {
  private listHRUseCase: ListHRUseCase

  constructor(
    @inject(ListHRUseCase) listHRUseCase: ListHRUseCase,
  ) {
    this.listHRUseCase = listHRUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = ListHRSchema.parse(request.method === "GET" ? (request.query as any) : (request.body as any))
    const result = await this.listHRUseCase.execute(data.companyId)
    return reply.code(200).send(result)
  }
}
