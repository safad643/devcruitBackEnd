import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { BlockDeveloperUseCase } from "../../../application/use-cases/admin/BlockDeveloperUseCase.ts"
import { BlockDeveloperSchema } from "../../dtos/admin/AdminDTOs.ts"

@injectable()
export class BlockDeveloperController {
  private blockDeveloperUseCase: BlockDeveloperUseCase

  constructor(
    @inject(BlockDeveloperUseCase) blockDeveloperUseCase: BlockDeveloperUseCase,
  ) {
    this.blockDeveloperUseCase = blockDeveloperUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = BlockDeveloperSchema.parse(request.body)
    const result = await this.blockDeveloperUseCase.execute(data)
    return reply.code(200).send(result)
  }
}
