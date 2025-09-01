import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { DeleteDeveloperUseCase } from "../../../application/use-cases/admin/DeleteDeveloperUseCase.ts"
import { DeleteDeveloperSchema } from "../../dtos/admin/AdminDTOs.ts"

@injectable()
export class DeleteDeveloperController {
  private deleteDeveloperUseCase: DeleteDeveloperUseCase

  constructor(
    @inject(DeleteDeveloperUseCase) deleteDeveloperUseCase: DeleteDeveloperUseCase,
  ) {
    this.deleteDeveloperUseCase = deleteDeveloperUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = DeleteDeveloperSchema.parse((request.body ?? request.query) as any)
    const result = await this.deleteDeveloperUseCase.execute(data)
    return reply.code(200).send(result)
  }
}
