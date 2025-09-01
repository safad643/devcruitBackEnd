import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { UnblockCompanyUseCase } from "../../../application/use-cases/admin/UnblockCompanyUseCase.ts"
import { UnblockCompanySchema } from "../../dtos/admin/AdminDTOs.ts"

@injectable()
export class UnblockCompanyController {
  private unblockCompanyUseCase: UnblockCompanyUseCase

  constructor(
    @inject(UnblockCompanyUseCase) unblockCompanyUseCase: UnblockCompanyUseCase,
  ) {
    this.unblockCompanyUseCase = unblockCompanyUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = UnblockCompanySchema.parse(request.body)
    await this.unblockCompanyUseCase.execute({ 
      companyId: data.companyId, 
      reason: data.reason, 
      details: data.details
    })
    return reply.code(200).send({ message: "Company unblocked successfully" })
  }
}
