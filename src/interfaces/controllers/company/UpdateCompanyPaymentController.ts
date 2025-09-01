import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { UpdateCompanyPaymentUseCase } from "../../../application/use-cases/company/UpdateCompanyPaymentUseCase.ts"
import { UpdateCompanyPaymentSchema } from "../../dtos/company/CompanyDTOs.ts"
import type { AuthenticatedRequest } from "../../middlewares/auth.ts"

@injectable()
export class UpdateCompanyPaymentController {
  private updateCompanyPaymentUseCase: UpdateCompanyPaymentUseCase

  constructor(
    @inject(UpdateCompanyPaymentUseCase) updateCompanyPaymentUseCase: UpdateCompanyPaymentUseCase,
  ) {
    this.updateCompanyPaymentUseCase = updateCompanyPaymentUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = UpdateCompanyPaymentSchema.parse(request.body)
    const companyId = (request as AuthenticatedRequest).user?.userId
    
    if (!companyId) {
      return reply.code(401).send({ message: "Unauthorized" })
    }

    const result = await this.updateCompanyPaymentUseCase.execute(companyId, data.planName)
    return reply.code(200).send(result)
  }
}
