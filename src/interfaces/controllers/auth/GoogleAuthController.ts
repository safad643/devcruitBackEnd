import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { GoogleAuthUseCase } from "../../../application/use-cases/auth/GoogleAuthUseCase.ts"
import { GoogleAuthSchema } from "../../dtos/auth/AuthDTOs.ts"

type GoogleAuthResult = {
  loggedIn: boolean
  accessToken?: string
  refreshToken?: string
  isBlocked?: boolean
  blockedReason?: string
  blockedDetails?: string
  profileSetup?: boolean
  role?: string
}

@injectable()
export class GoogleAuthController {
  private googleAuthUseCase: GoogleAuthUseCase

  constructor(
    @inject(GoogleAuthUseCase) googleAuthUseCase: GoogleAuthUseCase,
  ) {
    this.googleAuthUseCase = googleAuthUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = GoogleAuthSchema.parse(request.body)
    if (!data.idToken) {
      return reply.code(400).send({ error: "Google ID token is required" })
    }
    
    const result: GoogleAuthResult = await this.googleAuthUseCase.execute(data.idToken, data.role)
    
    if (result.loggedIn && result.refreshToken) {
      reply.setCookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      })
    }
    
    return reply.code(200).send({ 
      loggedIn: result.loggedIn,
      accessToken: result.accessToken, 
      isBlocked: result.isBlocked,
      blockedReason: result.blockedReason,
      blockedDetails: result.blockedDetails,
      profileSetup: result.profileSetup,
      role: result.role,
    })
  }
}
