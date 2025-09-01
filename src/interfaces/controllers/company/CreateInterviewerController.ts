import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { CreateInterviewerUseCase } from "../../../application/use-cases/company/CreateInterviewerUseCase.ts"
import { CreateInterviewerSchema } from "../../dtos/company/CompanyDTOs.ts"

@injectable()
export class CreateInterviewerController {
  private createInterviewerUseCase: CreateInterviewerUseCase

  constructor(
    @inject(CreateInterviewerUseCase) createInterviewerUseCase: CreateInterviewerUseCase,
  ) {
    this.createInterviewerUseCase = createInterviewerUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = CreateInterviewerSchema.parse(request.body)
    const result = await this.createInterviewerUseCase.execute(data.companyId, data.username, data.password)
    return reply.code(201).send(result)
  }
}
