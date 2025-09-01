import { injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { passwordPolicy } from "../../dtos/PasswordSchema.ts"

@injectable()
export class GetPasswordPolicyController {
  async execute(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send(passwordPolicy)
  }
}
