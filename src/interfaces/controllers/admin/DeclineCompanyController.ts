import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { DeclineCompanyUseCase } from "../../../application/use-cases/admin/DeclineCompanyUseCase.ts"
import { DeclineCompanySchema } from "../../dtos/admin/AdminDTOs.ts"

@injectable()
export class DeclineCompanyController {
  private declineCompanyUseCase: DeclineCompanyUseCase

  constructor(
    @inject(DeclineCompanyUseCase) declineCompanyUseCase: DeclineCompanyUseCase,
  ) {
    this.declineCompanyUseCase = declineCompanyUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = DeclineCompanySchema.parse(request.body)
    await this.declineCompanyUseCase.execute(data.companyId, data.reason, data.requestedDocuments)
    return reply.code(200).send({ message: "Company declined successfully" })
  }
}
