import { inject, injectable } from "inversify"
import type { FastifyReply } from "fastify"
import type { AuthenticatedRequest } from "../../middlewares/auth.ts"
import type { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository.ts"
import type { IFileUploadService } from "../../../application/interfaces/services/IFileUploadService.ts"

type CollectedDoc = {
  name: string
  type: "file" | "explanation"
  url?: string
  text?: string
}

@injectable()
export class SubmitAdditionalInfoController {
  constructor(
    @inject("ICompanyRepository") private companyRepository: ICompanyRepository,
    @inject("FileUploadService") private fileUploadService: IFileUploadService,
  ) {}

  async execute(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    // Ensure role handled by preHandler
    const companyId = request.user?.userId
    if (!companyId) {
      reply.code(401).send({ error: "UNAUTHORIZED", message: "Missing authenticated user" })
      return
    }

    // Validate company exists and is in declined state (optional)
    const company = await this.companyRepository.findById(companyId)
    if (!company) {
      reply.code(404).send({ error: "COMPANY_NOT_FOUND", message: "Company not found" })
      return
    }

    const parts = request.parts()
    const documents: CollectedDoc[] = []
    let notes: string | undefined

    for await (const part of parts) {
      if (part.type === "file") {
        // Expect field names like file:Document Name
        const fieldName = String(part.fieldname || "")
        if (fieldName.startsWith("file:")) {
          const name = fieldName.slice(5)
          const buffers: Buffer[] = []
          for await (const chunk of part.file) buffers.push(chunk as Buffer)
          const data = Buffer.concat(buffers)
          const url = await this.fileUploadService.upload(
            "company",
            companyId,
            "certificate",
            part.filename || name || "document",
            data,
            { contentType: part.mimetype },
          )
          documents.push({ name, type: "file", url })
        }
      } else {
        const fieldName = String(part.fieldname || "")
        const value = String(part.value || "")
        if (fieldName === "notes") {
          notes = value
        } else if (fieldName.startsWith("text:")) {
          const name = fieldName.slice(5)
          documents.push({ name, type: "explanation", text: value })
        }
      }
    }

    if (documents.length === 0) {
      reply.code(400).send({ error: "VALIDATION_ERROR", message: "No documents provided" })
      return
    }

    // Persist: save documents and notes, clear decline/requested, set status back to pending
    await this.companyRepository.updateById(companyId, {
      additionalDocuments: documents as any,
      resubmissionNotes: notes,
      declineReason: undefined,
      requestedDocuments: undefined,
    })
    await this.companyRepository.updateStatus(companyId, "resubmitted")

    reply.code(200).send({ message: "Additional information submitted", status: "resubmitted" })
  }
}


