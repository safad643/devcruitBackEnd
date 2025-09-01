import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { DeleteHRUseCase } from "../../../application/use-cases/company/DeleteHRUseCase.ts"
import { DeleteHRSchema } from "../../dtos/company/CompanyDTOs.ts"

@injectable()
export class DeleteHRController {
  private deleteHRUseCase: DeleteHRUseCase

  constructor(
    @inject(DeleteHRUseCase) deleteHRUseCase: DeleteHRUseCase,
  ) {
    this.deleteHRUseCase = deleteHRUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = DeleteHRSchema.parse(request.body ?? request.query)
    await this.deleteHRUseCase.execute(data.hrId)
    return reply.code(200).send({ message: "HR deleted successfully" })
  }
}
