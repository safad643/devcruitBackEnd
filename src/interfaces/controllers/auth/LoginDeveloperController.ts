import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { DeveloperLoginUseCase } from "../../../application/use-cases/developer/DeveloperLoginUseCase.ts"
import { LoginSchema } from "../../dtos/auth/AuthDTOs.ts"

type LoginResult = {
  loggedIn: boolean
  accessToken?: string
  refreshToken?: string
  isBlocked?: boolean
  blockedReason?: string
  blockedDetails?: string
  profileSetup?: boolean
}

@injectable()
export class LoginDeveloperController {
  private developerLoginUseCase: DeveloperLoginUseCase

  constructor(
    @inject(DeveloperLoginUseCase) developerLoginUseCase: DeveloperLoginUseCase,
  ) {
    this.developerLoginUseCase = developerLoginUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = LoginSchema.parse(request.body)
    if (!data.email) {
      return reply.code(400).send({ error: "Email is required" })
    }
    
    const result: LoginResult = await this.developerLoginUseCase.execute(data.email, data.password)
    
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
    })
  }
}
