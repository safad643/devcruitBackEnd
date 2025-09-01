import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { ResendOTPUseCase } from "../../../application/use-cases/shared/ResendOTPUseCase.ts"
import { ResendOTPSchema } from "../../dtos/auth/AuthDTOs.ts"

@injectable()
export class ResendOTPController {
  private resendOTPUseCase: ResendOTPUseCase

  constructor(
    @inject(ResendOTPUseCase) resendOTPUseCase: ResendOTPUseCase,
  ) {
    this.resendOTPUseCase = resendOTPUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = ResendOTPSchema.parse(request.body)
    await this.resendOTPUseCase.execute(data.email)
    return reply.code(200).send({ message: "OTP sent successfully" })
  }
}
