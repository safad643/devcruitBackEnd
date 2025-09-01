import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { EditHRUseCase } from "../../../application/use-cases/company/EditHRUseCase.ts"
import { EditHRSchema } from "../../dtos/company/CompanyDTOs.ts"

@injectable()
export class EditHRController {
  private editHRUseCase: EditHRUseCase

  constructor(
    @inject(EditHRUseCase) editHRUseCase: EditHRUseCase,
  ) {
    this.editHRUseCase = editHRUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = EditHRSchema.parse(request.body)
    await this.editHRUseCase.execute(data.hrId, { username: data.username, password: data.password })
    return reply.code(200).send({ message: "HR updated successfully" })
  }
}
