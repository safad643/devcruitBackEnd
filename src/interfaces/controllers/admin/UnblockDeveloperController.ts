import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { UnblockDeveloperUseCase } from "../../../application/use-cases/admin/UnblockDeveloperUseCase.ts"
import { UnblockDeveloperSchema } from "../../dtos/admin/AdminDTOs.ts"

@injectable()
export class UnblockDeveloperController {
  private unblockDeveloperUseCase: UnblockDeveloperUseCase

  constructor(
    @inject(UnblockDeveloperUseCase) unblockDeveloperUseCase: UnblockDeveloperUseCase,
  ) {
    this.unblockDeveloperUseCase = unblockDeveloperUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = UnblockDeveloperSchema.parse(request.body)
    const result = await this.unblockDeveloperUseCase.execute(data)
    return reply.code(200).send(result)
  }
}
