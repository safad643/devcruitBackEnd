import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { ConfirmPasswordResetUseCase } from "../../../application/use-cases/auth/ConfirmPasswordResetUseCase.ts"
import { ConfirmPasswordResetSchema } from "../../dtos/auth/AuthDTOs.ts"

@injectable()
export class ConfirmPasswordResetController {
  private confirmPasswordResetUseCase: ConfirmPasswordResetUseCase

  constructor(
    @inject(ConfirmPasswordResetUseCase) confirmPasswordResetUseCase: ConfirmPasswordResetUseCase,
  ) {
    this.confirmPasswordResetUseCase = confirmPasswordResetUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = ConfirmPasswordResetSchema.parse(request.body)
    await this.confirmPasswordResetUseCase.execute(data.email, data.role, data.otp, data.newPassword)
    return reply.code(200).send({ message: "Password reset successfully" })
  }
}
