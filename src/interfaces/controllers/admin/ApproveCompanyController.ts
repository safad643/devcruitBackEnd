import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { ApproveCompanyUseCase } from "../../../application/use-cases/admin/ApproveCompanyUseCase.ts"
import { ApproveCompanySchema } from "../../dtos/admin/AdminDTOs.ts"

@injectable()
export class ApproveCompanyController {
  private approveCompanyUseCase: ApproveCompanyUseCase

  constructor(
    @inject(ApproveCompanyUseCase) approveCompanyUseCase: ApproveCompanyUseCase,
  ) {
    this.approveCompanyUseCase = approveCompanyUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = ApproveCompanySchema.parse(request.body)
    await this.approveCompanyUseCase.execute(data.companyId)
    return reply.code(200).send({ message: "Company approved successfully" })
  }
}
