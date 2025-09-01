import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { RequestPasswordResetUseCase } from "../../../application/use-cases/auth/RequestPasswordResetUseCase.ts"
import { RequestPasswordResetSchema } from "../../dtos/auth/AuthDTOs.ts"

@injectable()
export class RequestPasswordResetController {
  private requestPasswordResetUseCase: RequestPasswordResetUseCase

  constructor(
    @inject(RequestPasswordResetUseCase) requestPasswordResetUseCase: RequestPasswordResetUseCase,
  ) {
    this.requestPasswordResetUseCase = requestPasswordResetUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = RequestPasswordResetSchema.parse(request.body)
    await this.requestPasswordResetUseCase.execute(data.email, data.role)
    return reply.code(200).send({ message: "OTP sent successfully" })
  }
}
