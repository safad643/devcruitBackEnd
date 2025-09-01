import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { VerifyOTPUseCase } from "../../../application/use-cases/shared/VerifyOTPUseCase.ts"
import { VerifyOTPSchema } from "../../dtos/auth/AuthDTOs.ts"

@injectable()
export class VerifyOTPController {
  private verifyOTPUseCase: VerifyOTPUseCase

  constructor(
    @inject(VerifyOTPUseCase) verifyOTPUseCase: VerifyOTPUseCase,
  ) {
    this.verifyOTPUseCase = verifyOTPUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = VerifyOTPSchema.parse(request.body)
    await this.verifyOTPUseCase.execute(data.email, data.otp)
    
    return reply.code(200).send({ message: "OTP verified successfully" })
  }
}
