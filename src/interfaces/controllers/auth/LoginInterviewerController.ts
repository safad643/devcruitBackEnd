import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { InterviewerLoginUseCase } from "../../../application/use-cases/interviewer/InterviewerLoginUseCase.ts"
import { LoginSchema } from "../../dtos/auth/AuthDTOs.ts"

@injectable()
export class LoginInterviewerController {
  private interviewerLoginUseCase: InterviewerLoginUseCase

  constructor(
    @inject(InterviewerLoginUseCase) interviewerLoginUseCase: InterviewerLoginUseCase,
  ) {
    this.interviewerLoginUseCase = interviewerLoginUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = LoginSchema.parse(request.body)
    if (!data.username) {
      return reply.code(400).send({ error: "Username is required" })
    }
    const result = await this.interviewerLoginUseCase.execute(data.username, data.password)
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
