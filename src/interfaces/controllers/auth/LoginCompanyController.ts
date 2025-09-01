import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { CompanyLoginUseCase } from "../../../application/use-cases/company/CompanyLoginUseCase.ts"
import { LoginSchema } from "../../dtos/auth/AuthDTOs.ts"

@injectable()
export class LoginCompanyController {
  private companyLoginUseCase: CompanyLoginUseCase

  constructor(
    @inject(CompanyLoginUseCase) companyLoginUseCase: CompanyLoginUseCase,
  ) {
    this.companyLoginUseCase = companyLoginUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = LoginSchema.parse(request.body)
    if (!data.email) {
      return reply.code(400).send({ error: "Email is required" })
    }
    const result = await this.companyLoginUseCase.execute(data.email, data.password)
    if ((result as any).loggedIn) {
      reply.setCookie("refreshToken", (result as any).refreshToken as string, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      })
    }
    return reply.code(200).send({ 
      loggedIn: (result as any).loggedIn,
      accessToken: (result as any).accessToken, 
      status: (result as any).status,
      declineReason: (result as any).declineReason,
      requestedDocuments: (result as any).requestedDocuments,
      isBlocked: (result as any).isBlocked,
      blockedReason: (result as any).blockedReason,
      blockedDetails: (result as any).blockedDetails,
    })
  }
}
