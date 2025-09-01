import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { AdminLoginUseCase } from "../../../application/use-cases/admin/AdminLoginUseCase.ts"
import { LoginSchema } from "../../dtos/auth/AuthDTOs.ts"

@injectable()
export class LoginAdminController {
  private adminLoginUseCase: AdminLoginUseCase

  constructor(
    @inject(AdminLoginUseCase) adminLoginUseCase: AdminLoginUseCase,
  ) {
    this.adminLoginUseCase = adminLoginUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = LoginSchema.parse(request.body)
    if (!data.email) {
      return reply.code(400).send({ error: "Email is required" })
    }
    const result = await this.adminLoginUseCase.execute(data.email, data.password)
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
