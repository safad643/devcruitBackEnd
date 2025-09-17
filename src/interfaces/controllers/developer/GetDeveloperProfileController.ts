import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { GetDeveloperProfileUseCase } from "../../../application/use-cases/developer/GetDeveloperProfileUseCase.ts"

type AuthenticatedRequest = FastifyRequest & { user: { userId: string; role: string } }

@injectable()
export class GetDeveloperProfileController {
  constructor(
    @inject(GetDeveloperProfileUseCase) private readonly getDeveloperProfileUseCase: GetDeveloperProfileUseCase,
  ) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId } = (request as AuthenticatedRequest).user
      const profile = await this.getDeveloperProfileUseCase.execute(userId)
      
      return reply.code(200).send({
        success: true,
        data: profile
      })
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(400).send({
          success: false,
          error: error.message
        })
      }
      return reply.code(500).send({
        success: false,
        error: "Internal server error"
      })
    }
  }
}
