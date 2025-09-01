import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { RefreshAccessTokenUseCase } from "../../../application/use-cases/auth/RefreshAccessTokenUseCase.ts"

@injectable()
export class RefreshTokenController {
  private refreshAccessTokenUseCase: RefreshAccessTokenUseCase

  constructor(
    @inject(RefreshAccessTokenUseCase) refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
  ) {
    this.refreshAccessTokenUseCase = refreshAccessTokenUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const cookieToken = (request as any).cookies?.refreshToken as string | undefined
    const headerToken = request.headers.authorization?.replace("Bearer ", "")
    const refreshToken = cookieToken || headerToken
    if (!refreshToken) {
      return reply.code(400).send({ error: "Refresh token is required" })
    }
    try {
      const { accessToken } = await this.refreshAccessTokenUseCase.execute(refreshToken)
      return reply.code(200).send({ accessToken })
    } catch {
      return reply.code(401).send({ error: "Invalid or expired refresh token" })
    }
  }
}
