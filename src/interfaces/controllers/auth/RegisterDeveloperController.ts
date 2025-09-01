import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { DeveloperRegisterUseCase } from "../../../application/use-cases/developer/DeveloperRegisterUseCase.ts"
import { RegisterDeveloperSchema } from "../../dtos/auth/AuthDTOs.ts"

@injectable()
export class RegisterDeveloperController {
  private developerRegisterUseCase: DeveloperRegisterUseCase

  constructor(
    @inject(DeveloperRegisterUseCase) developerRegisterUseCase: DeveloperRegisterUseCase,
  ) {
    this.developerRegisterUseCase = developerRegisterUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = RegisterDeveloperSchema.parse(request.body)
    await this.developerRegisterUseCase.execute(data)
    return reply.code(201).send({ message: "Developer registered successfully. Please verify your email." })
  }
}
