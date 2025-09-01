import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { HRLoginUseCase } from "../../../application/use-cases/hr/HRLoginUseCase.ts"
import { LoginSchema } from "../../dtos/auth/AuthDTOs.ts"

@injectable()
export class LoginHRController {
  private hrLoginUseCase: HRLoginUseCase

  constructor(
    @inject(HRLoginUseCase) hrLoginUseCase: HRLoginUseCase,
  ) {
    this.hrLoginUseCase = hrLoginUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = LoginSchema.parse(request.body)
    if (!data.username) {
      return reply.code(400).send({ error: "Username is required" })
    }
    const result = await this.hrLoginUseCase.execute(data.username, data.password)
    reply.setCookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    })
    return reply.code(200).send({ accessToken: result.accessToken })
  }
}
