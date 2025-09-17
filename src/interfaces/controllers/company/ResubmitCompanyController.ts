import { inject, injectable } from "inversify"
import type { FastifyRequest, FastifyReply } from "fastify"
import { ResubmitCompanyUseCase } from "../../../application/use-cases/company/ResubmitCompanyUseCase.ts"
import type { ResubmitCompanyDTO } from "../../../application/dto/CompanyDTO.ts"

@injectable()
export class ResubmitCompanyController {
  constructor(
    @inject(ResubmitCompanyUseCase) private resubmitCompanyUseCase: ResubmitCompanyUseCase,
  ) {}

  async execute(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { companyId, additionalDocuments, resubmissionNotes } = request.body as ResubmitCompanyDTO

      if (!companyId || !additionalDocuments || additionalDocuments.length === 0) {
        reply.code(400).send({
          error: "VALIDATION_ERROR",
          message: "Company ID and additional documents are required",
          statusCode: 400,
        })
        return
      }

      await this.resubmitCompanyUseCase.execute({
        companyId,
        additionalDocuments,
        resubmissionNotes,
      })

      reply.code(200).send({
        message: "Company resubmission successful",
        status: "resubmitted",
      })
    } catch (error) {
      request.log.error({ err: error }, "Error in ResubmitCompanyController")
      
      if (error instanceof Error) {
        reply.code(500).send({
          error: "INTERNAL_SERVER_ERROR",
          message: error.message,
          statusCode: 500,
        })
      } else {
        reply.code(500).send({
          error: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
          statusCode: 500,
        })
      }
    }
  }
}
