import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { CreateDeveloperProfileUseCase } from "../../../application/use-cases/developer/CreateDeveloperProfileUseCase.ts"
import { parseDeveloperProfileInput, type UploadedFile } from "../../dtos/developer/DeveloperDTOs.ts"

type AuthenticatedRequest = FastifyRequest & { user: { userId: string; role: string } }

@injectable()
export class CreateDeveloperProfileController {
  constructor(
    @inject(CreateDeveloperProfileUseCase) private readonly createDeveloperProfileUseCase: CreateDeveloperProfileUseCase,
  ) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const isMultipart = request.isMultipart?.()
    if (!isMultipart) {
      return reply.code(400).send({ error: "BAD_REQUEST", message: "Expected multipart/form-data" })
    }

    const fields: Record<string, any> = {}
    const files: Record<string, UploadedFile | undefined> = {}

    const parts = request.parts()
    for await (const part of parts) {
      if (part.type === "file") {
        const chunks: Buffer[] = []
        for await (const chunk of part.file) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
        }
        const buffer = Buffer.concat(chunks)
        files[part.fieldname] = {
          fieldname: part.fieldname,
          originalname: part.filename,
          mimetype: part.mimetype,
          size: buffer.length,
          buffer,
        }
      } else {
        fields[part.fieldname] = part.value
      }
    }

    const input = parseDeveloperProfileInput(fields, files)
    const { userId } = (request as AuthenticatedRequest).user
    await this.createDeveloperProfileUseCase.execute(userId, input)
    return reply.code(200).send({ message: "Profile created successfully" })
  }
}



