import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { CreateHRUseCase } from "../../../application/use-cases/company/CreateHRUseCase.ts"
import { CreateHRSchema } from "../../dtos/company/CompanyDTOs.ts"

@injectable()
export class CreateHRController {
  private createHRUseCase: CreateHRUseCase

  constructor(
    @inject(CreateHRUseCase) createHRUseCase: CreateHRUseCase,
  ) {
    this.createHRUseCase = createHRUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = CreateHRSchema.parse(request.body)
    const result = await this.createHRUseCase.execute(data.companyId, data.username, data.password)
    return reply.code(201).send(result)
  }
}
