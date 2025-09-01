import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { AddDeveloperWarningUseCase } from "../../../application/use-cases/admin/AddDeveloperWarningUseCase.ts"
import { AddDeveloperWarningSchema } from "../../dtos/admin/AdminDTOs.ts"

@injectable()
export class AddDeveloperWarningController {
  private addDeveloperWarningUseCase: AddDeveloperWarningUseCase

  constructor(
    @inject(AddDeveloperWarningUseCase) addDeveloperWarningUseCase: AddDeveloperWarningUseCase,
  ) {
    this.addDeveloperWarningUseCase = addDeveloperWarningUseCase
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const data = AddDeveloperWarningSchema.parse(request.body)
    const result = await this.addDeveloperWarningUseCase.execute(data)
    return reply.code(200).send(result)
  }
}
