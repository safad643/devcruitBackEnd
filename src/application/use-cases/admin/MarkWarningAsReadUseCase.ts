import { inject, injectable } from "inversify"
import type { IWarningRepository } from "../../../domain/repositories/IWarningRepository.ts"
import { NotFoundError } from "../../../domain/errors/DomainError.ts"
import type { MarkWarningAsReadDTO } from "../../dto"

@injectable()
export class MarkWarningAsReadUseCase {
  private warningRepository: IWarningRepository

  constructor(
    @inject("IWarningRepository") warningRepository: IWarningRepository,
  ) {
    this.warningRepository = warningRepository
  }

  async execute(request: MarkWarningAsReadDTO): Promise<{ message: string }> {
    const warning = await this.warningRepository.findById(request.warningId)
    if (!warning) {
      throw new NotFoundError("Warning not found")
    }

    await this.warningRepository.markAsRead(request.warningId)
    return { message: "Warning marked as read successfully" }
  }
}
