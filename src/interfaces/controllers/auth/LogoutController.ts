import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { LogoutUseCase } from "../../../application/use-cases/shared/LogoutUseCase.ts"

@injectable()
export class LogoutController {
  private logoutUseCase: LogoutUseCase

  constructor(
    @inject(LogoutUseCase) logoutUseCase: LogoutUseCase,
  ) {
    this.logoutUseCase = logoutUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const cookieToken = (request as any).cookies?.refreshToken as string | undefined
    const headerToken = request.headers.authorization?.replace("Bearer ", "")
    const refreshToken = cookieToken || headerToken
    if (!refreshToken) {
      return reply.code(400).send({ error: "Refresh token is required" })
    }
    await this.logoutUseCase.execute(refreshToken)
    reply.clearCookie("refreshToken", { path: "/" })
    return reply.code(200).send({ message: "Logged out successfully" })
  }
}
