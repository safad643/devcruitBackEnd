import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { BlockHRUseCase } from "../../../application/use-cases/company/BlockHRUseCase.ts"
import { BlockHRSchema } from "../../dtos/company/CompanyDTOs.ts"

@injectable()
export class BlockHRController {
  private blockHRUseCase: BlockHRUseCase

  constructor(
    @inject(BlockHRUseCase) blockHRUseCase: BlockHRUseCase,
  ) {
    this.blockHRUseCase = blockHRUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = BlockHRSchema.parse(request.body)
    await this.blockHRUseCase.execute(data.hrId, data.reason)
    return reply.code(200).send({ message: "HR blocked successfully" })
  }
}
