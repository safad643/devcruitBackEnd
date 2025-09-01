import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { CompanyRegisterUseCase } from "../../../application/use-cases/company/CompanyRegisterUseCase.ts"
import { RegisterCompanySchema } from "../../dtos/auth/AuthDTOs.ts"

@injectable()
export class RegisterCompanyController {
  private companyRegisterUseCase: CompanyRegisterUseCase

  constructor(
    @inject(CompanyRegisterUseCase) companyRegisterUseCase: CompanyRegisterUseCase,
  ) {
    this.companyRegisterUseCase = companyRegisterUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = RegisterCompanySchema.parse(request.body)
    await this.companyRegisterUseCase.execute(data)
    return reply.code(201).send({ message: "Company registered successfully. Please verify your email." })
  }
}
