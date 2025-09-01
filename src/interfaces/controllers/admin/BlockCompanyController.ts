import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { BlockCompanyUseCase } from "../../../application/use-cases/admin/BlockCompanyUseCase.ts"
import { BlockCompanySchema } from "../../dtos/admin/AdminDTOs.ts"

@injectable()
export class BlockCompanyController {
  private blockCompanyUseCase: BlockCompanyUseCase

  constructor(
    @inject(BlockCompanyUseCase) blockCompanyUseCase: BlockCompanyUseCase,
  ) {
    this.blockCompanyUseCase = blockCompanyUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = BlockCompanySchema.parse(request.body)
    await this.blockCompanyUseCase.execute({ companyId: data.companyId, reason: data.reason, details: data.details })
    return reply.code(200).send({ message: "Company blocked successfully" })
  }
}
